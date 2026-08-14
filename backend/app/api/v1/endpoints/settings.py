from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.base import APIResponse
from app.schemas.setting import SystemSettingCreate, SystemSettingResponse
from app.services.setting import system_setting_service
from app.repositories.setting import system_setting_repository

router = APIRouter()


@router.get("", response_model=APIResponse[List[SystemSettingResponse]])
def get_all_settings(db: Session = Depends(get_db)):
    settings_list = system_setting_repository.list(db)
    return APIResponse(
        success=True,
        data=settings_list,
        message="System configurations loaded successfully"
    )


@router.get("/{key}", response_model=APIResponse)
def get_setting_by_key(key: str, db: Session = Depends(get_db)):
    val = system_setting_service.get_value(db, key)
    if val is None:
        raise HTTPException(status_code=404, detail=f"Configuration key '{key}' not found.")
    return APIResponse(
        success=True,
        data={"setting_key": key, "setting_value": val},
        message="Configuration value fetched successfully"
    )


@router.post("", response_model=APIResponse[SystemSettingResponse])
def save_setting(payload: SystemSettingCreate, db: Session = Depends(get_db)):
    db_setting = system_setting_service.save_setting(db, payload)
    return APIResponse(
        success=True,
        data=db_setting,
        message="Configuration saved successfully"
    )
