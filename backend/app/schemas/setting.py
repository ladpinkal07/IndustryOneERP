from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class SystemSettingBase(BaseModel):
    setting_key: str = Field(..., max_length=100)
    setting_value: str
    value_type: str = Field("string", max_length=20)
    category: str = Field("SYSTEM", max_length=50)
    description: Optional[str] = None


class SystemSettingCreate(SystemSettingBase):
    pass


class SystemSettingUpdate(BaseModel):
    setting_value: str
    description: Optional[str] = None


class SystemSettingResponse(SystemSettingBase):
    id: str
    tenant_id: str

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "set_38b97a",
                "tenant_id": "tenant-abc",
                "setting_key": "currency",
                "setting_value": "USD",
                "value_type": "string",
                "category": "FINANCE",
                "description": "Primary operating currency"
            }
        }
    )
