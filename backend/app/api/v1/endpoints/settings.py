from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_permission
from app.schemas.base import APIResponse, PaginationParams, FilterSortParams, build_paginated_response
from app.schemas.setting import SystemSettingCreate, SystemSettingResponse
from app.services.setting import system_setting_service
from app.repositories.setting import system_setting_repository

router = APIRouter()


@router.get("", response_model=APIResponse[List[SystemSettingResponse]])
def get_all_settings(
    pagination: PaginationParams = Depends(),
    filtering: FilterSortParams = Depends(),
    category: Optional[str] = Query(None, description="Filter by category (exact match)"),
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("settings:read"))
):
    # Build exact-match filters dict from named query params
    filters = {}
    if category:
        filters["category"] = category

    items, total = system_setting_repository.list_paginated(
        db,
        page=pagination.page,
        page_size=pagination.page_size,
        search=filtering.search,
        sort_by=filtering.sort_by,
        sort_order=filtering.sort_order,
        filters=filters if filters else None,
    )
    return build_paginated_response(
        items=items,
        total=total,
        page=pagination.page,
        page_size=pagination.page_size,
        message="System configurations loaded successfully"
    )


@router.get("/{key}", response_model=APIResponse)
def get_setting_by_key(
    key: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("settings:read"))
):
    val = system_setting_service.get_value(db, key)
    if val is None:
        raise HTTPException(status_code=404, detail=f"Configuration key '{key}' not found.")
    return APIResponse(
        success=True,
        data={"setting_key": key, "setting_value": val},
        message="Configuration value fetched successfully"
    )


@router.post("", response_model=APIResponse[SystemSettingResponse])
def save_setting(
    payload: SystemSettingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("settings:write"))
):
    db_setting = system_setting_service.save_setting(db, payload)
    return APIResponse(
        success=True,
        data=db_setting,
        message="Configuration saved successfully"
    )
