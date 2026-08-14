import pytest
from sqlalchemy.orm import Session
from app.core.database import Base, engine, SessionLocal
from app.core.tenant import TenantContext
from app.services.setting import system_setting_service
from app.schemas.setting import SystemSettingCreate


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


def test_service_type_conversions(db_session: Session):
    TenantContext.set_current_tenant("tenant-service-test")

    # 1. Test integer conversion
    system_setting_service.save_setting(
        db_session,
        SystemSettingCreate(
            setting_key="max_items",
            setting_value="150",
            value_type="int",
            category="SYSTEM"
        )
    )
    assert system_setting_service.get_value(db_session, "max_items") == 150

    # 2. Test invalid integer fallback
    system_setting_service.save_setting(
        db_session,
        SystemSettingCreate(
            setting_key="bad_int",
            setting_value="not-an-int",
            value_type="int",
            category="SYSTEM"
        )
    )
    assert system_setting_service.get_value(db_session, "bad_int", default=10) == 10

    # 3. Test float conversion
    system_setting_service.save_setting(
        db_session,
        SystemSettingCreate(
            setting_key="discount_rate",
            setting_value="0.125",
            value_type="float",
            category="FINANCE"
        )
    )
    assert system_setting_service.get_value(db_session, "discount_rate") == 0.125

    # 4. Test boolean conversion (true cases)
    system_setting_service.save_setting(
        db_session,
        SystemSettingCreate(
            setting_key="enable_audit",
            setting_value="true",
            value_type="bool",
            category="SYSTEM"
        )
    )
    assert system_setting_service.get_value(db_session, "enable_audit") is True

    system_setting_service.save_setting(
        db_session,
        SystemSettingCreate(
            setting_key="enable_tracking",
            setting_value="1",
            value_type="bool",
            category="SYSTEM"
        )
    )
    assert system_setting_service.get_value(db_session, "enable_tracking") is True

    # 5. Test boolean conversion (false cases)
    system_setting_service.save_setting(
        db_session,
        SystemSettingCreate(
            setting_key="maintenance_mode",
            setting_value="false",
            value_type="bool",
            category="SYSTEM"
        )
    )
    assert system_setting_service.get_value(db_session, "maintenance_mode") is False

    # Clear Context
    TenantContext.clear_current_tenant()
