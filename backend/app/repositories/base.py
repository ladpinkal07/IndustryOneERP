from typing import Generic, Type, TypeVar, List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import or_, asc, desc
from app.core.tenant import TenantContext

T = TypeVar("T")

# Columns that are never allowed for filtering/sorting (security)
BLOCKED_COLUMNS = frozenset({"tenant_id", "is_deleted", "deleted_at", "deleted_by"})


class BaseMultiTenantRepository(Generic[T]):
    # Subclasses can override this to declare which columns support LIKE search
    searchable_columns: List[str] = []

    def __init__(self, model: Type[T]):
        self.model = model

    def _get_tenant_id(self) -> str:
        tenant_id = TenantContext.get_current_tenant()
        if not tenant_id:
            raise PermissionError("Access Denied: No active Tenant context set.")
        return tenant_id

    def get_by_id(self, db: Session, id: any) -> Optional[T]:
        tenant_id = self._get_tenant_id()
        return (
            db.query(self.model)
            .filter(
                self.model.id == id,
                self.model.tenant_id == tenant_id,
                self.model.is_deleted == False,
            )
            .first()
        )

    def list(self, db: Session, skip: int = 0, limit: int = 100) -> List[T]:
        tenant_id = self._get_tenant_id()
        return (
            db.query(self.model)
            .filter(self.model.tenant_id == tenant_id, self.model.is_deleted == False)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count(self, db: Session) -> int:
        """Return total count of non-deleted records for the current tenant."""
        tenant_id = self._get_tenant_id()
        return (
            db.query(self.model)
            .filter(self.model.tenant_id == tenant_id, self.model.is_deleted == False)
            .count()
        )

    def _apply_search(self, query, search: str):
        """Apply LIKE search across configured searchable_columns."""
        if not search or not self.searchable_columns:
            return query
        pattern = f"%{search}%"
        conditions = []
        for col_name in self.searchable_columns:
            col = getattr(self.model, col_name, None)
            if col is not None:
                conditions.append(col.ilike(pattern))
        if conditions:
            query = query.filter(or_(*conditions))
        return query

    def _apply_filters(self, query, filters: Optional[Dict[str, str]] = None):
        """Apply exact-match filters for valid, non-blocked columns."""
        if not filters:
            return query
        for col_name, value in filters.items():
            if col_name in BLOCKED_COLUMNS:
                continue
            col = getattr(self.model, col_name, None)
            if col is not None:
                query = query.filter(col == value)
        return query

    def _apply_sorting(self, query, sort_by: Optional[str] = None, sort_order: str = "asc"):
        """Apply dynamic column sorting. Blocked columns are rejected."""
        if not sort_by:
            return query
        if sort_by in BLOCKED_COLUMNS:
            return query
        col = getattr(self.model, sort_by, None)
        if col is None:
            return query
        order_fn = desc if sort_order == "desc" else asc
        return query.order_by(order_fn(col))

    def list_paginated(
        self,
        db: Session,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_order: str = "asc",
        filters: Optional[Dict[str, str]] = None,
    ) -> tuple:
        """Return (items, total_count) with optional search, filter, and sort."""
        tenant_id = self._get_tenant_id()
        base_query = db.query(self.model).filter(
            self.model.tenant_id == tenant_id, self.model.is_deleted == False
        )

        # Apply search
        base_query = self._apply_search(base_query, search)

        # Apply exact-match filters
        base_query = self._apply_filters(base_query, filters)

        # Count after filtering, before pagination
        total = base_query.count()

        # Apply sorting
        base_query = self._apply_sorting(base_query, sort_by, sort_order)

        # Apply pagination
        items = base_query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total

    def create(self, db: Session, obj_in_data: dict, created_by: Optional[str] = None) -> T:
        tenant_id = self._get_tenant_id()
        db_obj = self.model(**obj_in_data, tenant_id=tenant_id, created_by=created_by)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: T, obj_in_data: dict, updated_by: Optional[str] = None) -> T:
        for field, value in obj_in_data.items():
            if hasattr(db_obj, field) and field != "tenant_id":
                setattr(db_obj, field, value)
        
        if hasattr(db_obj, "updated_by"):
            db_obj.updated_by = updated_by

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, db_obj: T, deleted_by: Optional[str] = None) -> T:
        if hasattr(db_obj, "is_deleted"):
            db_obj.is_deleted = True
        if hasattr(db_obj, "deleted_at"):
            import datetime
            db_obj.deleted_at = datetime.datetime.utcnow()
        if hasattr(db_obj, "updated_by"):
            db_obj.updated_by = deleted_by

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
