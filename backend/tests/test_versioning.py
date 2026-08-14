from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_v1_version():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    # v1 health check is registered directly in main.py, returning 1.0.0
    assert json_data["data"]["version"] == "1.0.0"


def test_api_v2_version():
    response = client.get("/api/v2/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    # v2 health check is registered in api/v2/api.py, returning 2.0.0
    assert json_data["data"]["version"] == "2.0.0"
