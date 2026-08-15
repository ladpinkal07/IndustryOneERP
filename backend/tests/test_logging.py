import json
import logging
import os
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.core.tenant import TenantContext
from app.core.logging import (
    logger,
    audit_logger,
    log_audit_event,
    set_request_id,
    clear_request_id,
    set_user_id,
    clear_user_id,
    get_request_id,
    get_user_id,
    ContextualLogFilter,
    JSONLogFormatter,
)

client = TestClient(app, raise_server_exceptions=False)


# Mock endpoint designed to raise exceptions for unhandled trace testing
@app.get("/api/v1/test-exception")
def mock_exception_endpoint():
    raise ValueError("Test dynamic system exception trace logging.")


def test_health_check_writes_to_log():
    log_file_path = "logs/erp_app.log"
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    assert os.path.exists(log_file_path)
    with open(log_file_path, "r", encoding="utf-8") as f:
        log_content = f.read()
        assert "System health check triggered" in log_content


def test_exception_handler_logs_error_trace():
    log_file_path = "logs/erp_app.log"
    response = client.get("/api/v1/test-exception")
    assert response.status_code == 500

    with open(log_file_path, "r", encoding="utf-8") as f:
        log_content = f.read()
        assert "Unhandled System Exception occurred" in log_content
        assert "ValueError: Test dynamic system exception trace logging" in log_content


def test_request_id_generation_and_propagation():
    # 1. Without header -> auto-generated request ID in response
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert "X-Request-ID" in response.headers
    generated_id = response.headers["X-Request-ID"]
    assert generated_id.startswith("req_")

    # 2. With client-supplied X-Request-ID header -> echo back
    custom_id = f"custom-req-{uuid.uuid4().hex[:8]}"
    response2 = client.get("/api/v1/health", headers={"X-Request-ID": custom_id})
    assert response2.status_code == 200
    assert response2.headers["X-Request-ID"] == custom_id

    # Verify custom request ID made it into log file
    with open("logs/erp_app.log", "r", encoding="utf-8") as f:
        log_content = f.read()
        assert f"[req:{custom_id}]" in log_content


def test_contextual_log_filter_enrichment():
    record = logging.LogRecord(
        name="test_logger",
        level=logging.INFO,
        pathname="test.py",
        lineno=10,
        msg="Testing contextual filter",
        args=(),
        exc_info=None
    )
    
    # When context is unset, defaults to "-"
    filter_obj = ContextualLogFilter()
    filter_obj.filter(record)
    assert record.request_id == "-"
    assert record.tenant_id == "-"
    assert record.user_id == "-"

    # When context is set
    t_token = TenantContext.set_current_tenant("tenant-corp-1")
    r_token = set_request_id("req-abc-999")
    u_token = set_user_id("usr-admin-42")
    try:
        record2 = logging.LogRecord(
            name="test_logger",
            level=logging.INFO,
            pathname="test.py",
            lineno=20,
            msg="Testing populated context",
            args=(),
            exc_info=None
        )
        filter_obj.filter(record2)
        assert record2.tenant_id == "tenant-corp-1"
        assert record2.request_id == "req-abc-999"
        assert record2.user_id == "usr-admin-42"
    finally:
        TenantContext.clear_current_tenant(t_token)
        clear_request_id(r_token)
        clear_user_id(u_token)


def test_json_log_formatter():
    formatter = JSONLogFormatter()
    record = logging.LogRecord(
        name="erp_logger",
        level=logging.WARNING,
        pathname="test_file.py",
        lineno=45,
        msg="Structured log message test",
        args=(),
        exc_info=None
    )
    record.request_id = "req-12345"
    record.tenant_id = "tenant-xyz"
    record.user_id = "user-789"

    formatted_str = formatter.format(record)
    log_json = json.loads(formatted_str)

    assert log_json["level"] == "WARNING"
    assert log_json["logger"] == "erp_logger"
    assert log_json["message"] == "Structured log message test"
    assert log_json["request_id"] == "req-12345"
    assert log_json["tenant_id"] == "tenant-xyz"
    assert log_json["user_id"] == "user-789"
    assert "timestamp" in log_json


def test_audit_event_logging():
    audit_file_path = "logs/erp_audit.log"
    event = log_audit_event(
        action="UPDATE_SETTING",
        resource="system_setting:tax_rate",
        user_id="usr_manager_01",
        tenant_id="tenant_finance_corp",
        status="SUCCESS",
        details={"old_value": "0.15", "new_value": "0.18"},
        ip_address="192.168.1.100"
    )

    assert event["action"] == "UPDATE_SETTING"
    assert event["resource"] == "system_setting:tax_rate"
    assert event["user_id"] == "usr_manager_01"
    assert event["tenant_id"] == "tenant_finance_corp"
    assert event["status"] == "SUCCESS"
    assert event["details"]["new_value"] == "0.18"

    # Verify written to audit log file
    assert os.path.exists(audit_file_path)
    with open(audit_file_path, "r", encoding="utf-8") as f:
        audit_content = f.read()
        assert "UPDATE_SETTING" in audit_content
        assert "system_setting:tax_rate" in audit_content
        assert "tenant_finance_corp" in audit_content
