from sqlalchemy import Column, String, Text
from app.models.base import TenantBaseModel


class SystemSetting(TenantBaseModel):
    __tablename__ = "system_setting"

    id = Column(String(50), primary_key=True, index=True)
    setting_key = Column(String(100), nullable=False, index=True)
    setting_value = Column(Text, nullable=False)
    value_type = Column(String(20), default="string", nullable=False)  # string, int, float, bool
    category = Column(String(50), default="SYSTEM", nullable=False)   # SYSTEM, INVENTORY, FINANCE
    description = Column(Text, nullable=True)
