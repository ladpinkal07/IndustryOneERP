import pytest
from sqlalchemy.orm import Session
from app.core.database import Base, engine, SessionLocal
from app.core.tenant import TenantContext
from app.repositories.setting import system_setting_repository
from app.models.setting import SystemSetting


@pytest.fixture(scope="module", autouse=True)
def setup_test_tables():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_repository_tenant_isolation_enforcement(db_session: Session):
    # 1. Accessing repository without context raises PermissionError
    TenantContext.clear_current_tenant()
    with pytest.raises(PermissionError) as exc_info:
        system_setting_repository.list(db_session)
    assert "No active Tenant context set" in str(exc_info.value)


def test_repository_crud_workflow(db_session: Session):
    # Set active tenant context
    TenantContext.set_current_tenant("tenant-abc")

    # 2. Create setting record (tenant_id maps automatically)
    obj_data = {
        "id": "set_test_001",
        "setting_key": "fiscal_year_start",
        "setting_value": "04-01",
        "value_type": "string"
    }
    db_obj = system_setting_repository.create(db_session, obj_data, created_by="usr_admin")
    assert db_obj.tenant_id == "tenant-abc"
    assert db_obj.created_by == "usr_admin"

    # 3. Update setting record (tenant_id is preserved)
    update_data = {
        "setting_value": "01-01",
        "tenant_id": "malicious-tenant-xyz"  # Attempt to tamper
    }
    updated_obj = system_setting_repository.update(db_session, db_obj, update_data, updated_by="usr_editor")
    assert updated_obj.setting_value == "01-01"
    # Ensure tenant_id was NOT modified
    assert updated_obj.tenant_id == "tenant-abc"

    # 4. List records (returns active rows)
    records = system_setting_repository.list(db_session)
    assert len(records) >= 1
    assert any(r.id == "set_test_001" for r in records)

    # 5. Soft-delete record
    system_setting_repository.delete(db_session, db_obj, deleted_by="usr_admin")
    
    # 6. Verify soft-deleted record is excluded from queries
    deleted_check = system_setting_repository.get_by_id(db_session, "set_test_001")
    assert deleted_check is None

    # Clear context
    TenantContext.clear_current_tenant()
