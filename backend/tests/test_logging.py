import os
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app, raise_server_exceptions=False)


# Temporary endpoint designed to raise exceptions for test collection
@app.get("/api/v1/test-exception")
def mock_exception_endpoint():
    raise ValueError("Test dynamic system exception trace logging.")


def test_health_check_writes_to_log():
    log_file_path = "logs/erp_app.log"
    # Clear active logs file to assert clean triggers
    if os.path.exists(log_file_path):
        try:
            os.remove(log_file_path)
        except PermissionError:
            # Handle open handles during test concurrency
            pass

    response = client.get("/api/v1/health")
    assert response.status_code == 200

    assert os.path.exists(log_file_path)
    with open(log_file_path, "r") as f:
        log_content = f.read()
        assert "System health check triggered" in log_content


def test_exception_handler_logs_error_trace():
    log_file_path = "logs/erp_app.log"
    response = client.get("/api/v1/test-exception")
    assert response.status_code == 500

    with open(log_file_path, "r") as f:
        log_content = f.read()
        assert "Unhandled System Exception occurred" in log_content
        assert "ValueError: Test dynamic system exception trace logging" in log_content
