from typing import Any, Optional
from sqlalchemy.orm import Session
from app.repositories.setting import system_setting_repository
from app.models.setting import SystemSetting
from app.schemas.setting import SystemSettingCreate


class SystemSettingService:
    def get_value(self, db: Session, key: str, default: Any = None) -> Any:
        db_setting = system_setting_repository.get_by_key(db, key)
        if not db_setting:
            return default

        val = db_setting.setting_value
        val_type = db_setting.value_type.lower()

        if val_type == "int":
            try:
                return int(val)
            except ValueError:
                return default
        elif val_type == "float":
            try:
                return float(val)
            except ValueError:
                return default
        elif val_type == "bool":
            return val.lower() in ("true", "1", "yes")
        return val

    def save_setting(self, db: Session, payload: SystemSettingCreate, user_id: Optional[str] = None) -> SystemSetting:
        return system_setting_repository.upsert_setting(
            db,
            key=payload.setting_key,
            value=payload.setting_value,
            value_type=payload.value_type,
            category=payload.category,
            description=payload.description,
            user_id=user_id
        )


system_setting_service = SystemSettingService()
