import uuid
from typing import Optional
from sqlalchemy.orm import Session
from app.models.setting import SystemSetting
from app.repositories.base import BaseMultiTenantRepository


class SystemSettingRepository(BaseMultiTenantRepository[SystemSetting]):
    def __init__(self):
        super().__init__(SystemSetting)

    def get_by_key(self, db: Session, key: str) -> Optional[SystemSetting]:
        tenant_id = self._get_tenant_id()
        return (
            db.query(self.model)
            .filter(
                self.model.setting_key == key,
                self.model.tenant_id == tenant_id,
                self.model.is_deleted == False,
            )
            .first()
        )

    def upsert_setting(
        self,
        db: Session,
        key: str,
        value: str,
        value_type: str = "string",
        category: str = "SYSTEM",
        description: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> SystemSetting:
        db_setting = self.get_by_key(db, key)
        if db_setting:
            db_setting.setting_value = value
            db_setting.value_type = value_type
            db_setting.category = category
            if description:
                db_setting.description = description
            db_setting.updated_by = user_id
            db.add(db_setting)
        else:
            tenant_id = self._get_tenant_id()
            db_setting = SystemSetting(
                id=str(uuid.uuid4()),
                tenant_id=tenant_id,
                setting_key=key,
                setting_value=value,
                value_type=value_type,
                category=category,
                description=description,
                created_by=user_id,
                updated_by=user_id,
            )
            db.add(db_setting)
        
        db.commit()
        db.refresh(db_setting)
        return db_setting


system_setting_repository = SystemSettingRepository()
