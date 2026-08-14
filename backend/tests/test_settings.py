import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
from app.core.config import settings

client = TestClient(app, raise_server_exceptions=False)


# Setup local database tables for this test run
@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    from sqlalchemy import create_engine
    from sqlalchemy.sql import text
    
    # Connect without specifying database to create it dynamically
    base_url = settings.DATABASE_URL.rsplit("/", 1)[0] + "/"
    temp_engine = create_engine(base_url)
    with temp_engine.connect() as conn:
        conn.execute(text("CREATE DATABASE IF NOT EXISTS industryone_erp_test"))
        conn.commit()
    temp_engine.dispose()

    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_settings_workflow():
    headers = {
        "X-Tenant-ID": "test-tenant-123",
        "Authorization": "Bearer mock-user-token"
    }

    # 1. Create/Save a setting via POST
    payload = {
        "setting_key": "decimal_precision",
        "setting_value": "4",
        "value_type": "int",
        "category": "SYSTEM",
        "description": "Decimal places for quantity"
    }
    response = client.post("/api/v1/settings", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["setting_key"] == "decimal_precision"
    assert data["data"]["setting_value"] == "4"

    # 2. Get setting value via key lookup
    response = client.get("/api/v1/settings/decimal_precision", headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["setting_value"] == 4  # Converted to int by service

    # 3. List all settings for the active tenant
    response = client.get("/api/v1/settings", headers=headers)
    assert response.status_code == 200
    assert len(response.json()["data"]) >= 1

    # 4. Deny access if tenant header is missing
    response = client.get("/api/v1/settings")
    assert response.status_code == 422
