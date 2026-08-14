import re
from app.core.database import Base
from app.models.base import TenantBaseModel


def test_orm_model_naming_compliance():
    # Enforces that all registered tables follow standard snake_case naming rules
    snake_case_pattern = re.compile(r"^[a-z0-9_]+$")

    for mapper in Base.registry.mappers:
        cls = mapper.class_
        tablename = getattr(cls, "__tablename__", None)
        if tablename:
            assert snake_case_pattern.match(tablename), (
                f"Model table name '{tablename}' in class '{cls.__name__}' must follow snake_case."
            )


def test_orm_multi_tenant_compliance():
    # Enforces that all operational tenant models map required audit columns
    for mapper in Base.registry.mappers:
        cls = mapper.class_
        # Verify if class is a subclass of TenantBaseModel
        if issubclass(cls, TenantBaseModel) and cls is not TenantBaseModel:
            columns = [col.key for col in mapper.columns]
            
            # Assert audit & tenant isolation fields are present
            assert "tenant_id" in columns, f"Model '{cls.__name__}' missing 'tenant_id'."
            assert "created_at" in columns, f"Model '{cls.__name__}' missing 'created_at'."
            assert "updated_at" in columns, f"Model '{cls.__name__}' missing 'updated_at'."
            assert "is_deleted" in columns, f"Model '{cls.__name__}' missing 'is_deleted'."
