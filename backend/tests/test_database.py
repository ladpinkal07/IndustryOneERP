from app.core.database import engine
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_database_connection_pool_configuration():
    # 1. Assert connection pool options conform to architecture guidelines
    assert engine.pool.size() == 20
    # max_overflow is stored in the pool implementation (QueuePool)
    assert hasattr(engine.pool, "_max_overflow")
    assert getattr(engine.pool, "_max_overflow") == 10
    
    # pool_recycle limit (recycle parameter is stored in seconds)
    assert getattr(engine.pool, "_recycle") == 3600


def test_health_check_database_connectivity():
    # 2. Assert health check ping returns successful database connections
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["database"] == "CONNECTED"
    assert json_data["data"]["status"] == "HEALTHY"
