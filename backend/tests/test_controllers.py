import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
from app.core.config import settings

client = TestClient(app)


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


def test_openapi_schema_endpoint():
    # Verify that Swagger/OpenAPI details compile and export cleanly
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "info" in schema
    assert schema["info"]["title"] == "IndustryOne ERP API Backend"
    
    # Assert settings route exists in paths
    assert "/api/v1/settings" in schema["paths"]


def test_controller_envelope_validation():
    # Verify that a standard request follows standard APIResponse guidelines
    headers = {
        "X-Tenant-ID": "tenant-xyz",
        "Authorization": "Bearer mock-token"
    }
    
    # 1. Post request with invalid parameters (required setting_key is missing)
    payload = {
        "setting_value": "HALF_UP",
        "value_type": "string"
    }
    # FastAPI triggers validation since setting_key is required
    response = client.post("/api/v1/settings", json=payload, headers=headers)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "validation" in data["message"].lower()
