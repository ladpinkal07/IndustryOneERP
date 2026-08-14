import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.tenant import TenantContext
from app.repositories.base import BaseMultiTenantRepository

client = TestClient(app)


# Temporary endpoint to test middleware headers resolving
@app.get("/api/v1/test-tenant")
def mock_tenant_endpoint():
    current_tenant = TenantContext.get_current_tenant()
    return {"tenant_id": current_tenant}


def test_tenant_middleware_resolves_context():
    # Guarantee clean starting context state
    TenantContext.clear_current_tenant()

    # 1. Query with X-Tenant-ID header
    response = client.get("/api/v1/test-tenant", headers={"X-Tenant-ID": "tenant-abc"})
    assert response.status_code == 200
    assert response.json()["tenant_id"] == "tenant-abc"

    # Clean context state again to test default None fallback
    TenantContext.clear_current_tenant()

    # 2. Query without X-Tenant-ID header (should be None)
    response = client.get("/api/v1/test-tenant")
    assert response.status_code == 200
    assert response.json()["tenant_id"] is None


def test_repository_denies_access_when_no_tenant_context():
    class DummyModel:
        pass

    repo = BaseMultiTenantRepository(DummyModel)
    
    # Executing database reads without context should raise PermissionError
    TenantContext.clear_current_tenant()
    with pytest.raises(PermissionError) as exc_info:
        repo._get_tenant_id()
    assert "No active Tenant context set" in str(exc_info.value)
