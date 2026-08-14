from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_v1_health_response_standardization():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    json_data = response.json()
    
    # Assert standard envelope keys exist
    assert "success" in json_data
    assert "data" in json_data
    assert "message" in json_data
    assert "meta" in json_data
    
    # Assert success state is boolean True
    assert json_data["success"] is True
    assert json_data["data"]["database"] == "CONNECTED"


def test_v2_health_response_standardization():
    response = client.get("/api/v2/health")
    assert response.status_code == 200
    json_data = response.json()
    
    # Assert standard envelope keys exist
    assert "success" in json_data
    assert "data" in json_data
    assert "message" in json_data
    assert "meta" in json_data
    
    # Assert success state is boolean True
    assert json_data["success"] is True
    assert json_data["data"]["database"] == "CONNECTED"
    assert json_data["data"]["version"] == "2.0.0"
