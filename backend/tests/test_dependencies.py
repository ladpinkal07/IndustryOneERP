from fastapi import Depends
from fastapi.testclient import TestClient
from app.main import app
from app.core.dependencies import require_permission, MockUser

client = TestClient(app)


# Setup secure mock routes
@app.get("/api/v1/test-secure-action")
def secure_action_route(
    current_user: MockUser = Depends(require_permission("production:write"))
):
    return {"status": "authorized", "user_id": current_user.id}


@app.get("/api/v1/test-secure-admin")
def secure_admin_route(
    current_user: MockUser = Depends(require_permission("admin:write"))
):
    return {"status": "authorized"}


def test_secure_route_authorized():
    headers = {"X-Tenant-ID": "tenant-123", "Authorization": "Bearer token"}
    response = client.get("/api/v1/test-secure-action", headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "authorized"


def test_secure_route_missing_tenant():
    # Missing X-Tenant-ID header (FastAPI header injection raises 422)
    headers = {"Authorization": "Bearer token"}
    response = client.get("/api/v1/test-secure-action", headers=headers)
    assert response.status_code == 422


def test_secure_route_invalid_auth():
    # Invalid token format (doesn't start with Bearer)
    headers = {"X-Tenant-ID": "tenant-123", "Authorization": "invalid-token-format"}
    response = client.get("/api/v1/test-secure-action", headers=headers)
    assert response.status_code == 401


def test_secure_route_forbidden():
    # User doesn't have "admin:write" permission
    headers = {"X-Tenant-ID": "tenant-123", "Authorization": "Bearer token"}
    response = client.get("/api/v1/test-secure-admin", headers=headers)
    assert response.status_code == 403
    assert "Permission Denied" in response.json()["message"]
