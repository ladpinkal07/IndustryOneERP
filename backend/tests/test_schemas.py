import pytest
from pydantic import ValidationError
from app.schemas.setting import SystemSettingCreate, SystemSettingResponse


# Mock class simulating a database model instance for attributes validation
class MockSystemSettingModel:
    def __init__(self, id, tenant_id, setting_key, setting_value, value_type, category, description):
        self.id = id
        self.tenant_id = tenant_id
        self.setting_key = setting_key
        self.setting_value = setting_value
        self.value_type = value_type
        self.category = category
        self.description = description


def test_schema_valid_inputs():
    # 1. Valid input parses correctly
    data = {
        "setting_key": "fiscal_year_end",
        "setting_value": "12-31",
        "value_type": "string",
        "category": "SYSTEM"
    }
    schema = SystemSettingCreate(**data)
    assert schema.setting_key == "fiscal_year_end"
    assert schema.setting_value == "12-31"


def test_schema_missing_required_fields():
    # 2. Missing required field raises ValidationError
    data = {
        "setting_value": "12-31"
    }
    with pytest.raises(ValidationError) as exc_info:
        SystemSettingCreate(**data)
    assert "setting_key" in str(exc_info.value)


def test_schema_length_constraint_violations():
    # 3. Exceeding max_length raises ValidationError
    too_long_key = "x" * 101
    data = {
        "setting_key": too_long_key,
        "setting_value": "test"
    }
    with pytest.raises(ValidationError) as exc_info:
        SystemSettingCreate(**data)
    assert "setting_key" in str(exc_info.value)


def test_schema_serialization_from_orm_attributes():
    # 4. Assert model_validate maps attributes from mock instances
    mock_model = MockSystemSettingModel(
        id="set_99",
        tenant_id="tenant-99",
        setting_key="currency",
        setting_value="EUR",
        value_type="string",
        category="FINANCE",
        description="Base currency"
    )
    
    response = SystemSettingResponse.model_validate(mock_model)
    assert response.id == "set_99"
    assert response.tenant_id == "tenant-99"
    assert response.setting_key == "currency"
    assert response.setting_value == "EUR"
