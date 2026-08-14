from typing import Generic, Type, TypeVar, List, Optional
from sqlalchemy.orm import Session
from app.core.tenant import TenantContext

T = TypeVar("T")


class BaseMultiTenantRepository(Generic[T]):
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
