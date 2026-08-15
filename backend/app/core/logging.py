import contextvars
import json
import logging
import os
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler
from typing import Optional, Any, Dict

from app.core.tenant import TenantContext

# Define log file parameters
LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "erp_app.log")
AUDIT_LOG_FILE = os.path.join(LOG_DIR, "erp_audit.log")

# Guarantee logs directory exists
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Context variables for asynchronous request and security tracking
_request_id_context: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "request_id", default=None
)
_user_id_context: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "user_id", default=None
)


def get_request_id() -> Optional[str]:
    """Retrieve the current request/correlation ID from the async context."""
    return _request_id_context.get()


def set_request_id(req_id: str) -> contextvars.Token:
    """Set the request/correlation ID for the current async context."""
    return _request_id_context.set(req_id)


def clear_request_id(token: Optional[contextvars.Token] = None) -> None:
    """Reset the request/correlation ID in the current async context."""
    if token is not None:
        _request_id_context.reset(token)
    else:
        _request_id_context.set(None)


def get_user_id() -> Optional[str]:
    """Retrieve the current authenticated user ID from context."""
    return _user_id_context.get()


def set_user_id(user_id: str) -> contextvars.Token:
    """Set the authenticated user ID for the current context."""
    return _user_id_context.set(user_id)


def clear_user_id(token: Optional[contextvars.Token] = None) -> None:
    """Reset the authenticated user ID in the current context."""
    if token is not None:
        _user_id_context.reset(token)
    else:
        _user_id_context.set(None)


class ContextualLogFilter(logging.Filter):
    """Logging filter that injects tenant_id, request_id, and user_id into all LogRecords."""

    def filter(self, record: logging.LogRecord) -> bool:
        if not hasattr(record, "request_id") or record.request_id is None:
            record.request_id = get_request_id() or "-"
        if not hasattr(record, "tenant_id") or record.tenant_id is None:
            record.tenant_id = TenantContext.get_current_tenant() or "-"
        if not hasattr(record, "user_id") or record.user_id is None:
            record.user_id = get_user_id() or "-"
        return True


class JSONLogFormatter(logging.Formatter):
    """Structured JSON formatter for production log aggregation."""

    def format(self, record: logging.LogRecord) -> str:
        log_obj: Dict[str, Any] = {
            "timestamp": datetime.fromtimestamp(record.created).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3],
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": getattr(record, "request_id", "-"),
            "tenant_id": getattr(record, "tenant_id", "-"),
            "user_id": getattr(record, "user_id", "-"),
            "filename": record.filename,
            "lineno": record.lineno,
            "func_name": record.funcName,
        }
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)


# Text log formatting layout
LOG_FORMAT = "[%(asctime)s] [%(levelname)s] [req:%(request_id)s] [tenant:%(tenant_id)s] [user:%(user_id)s] [%(filename)s:%(lineno)d] - %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# 1. Main Application Logger
logger = logging.getLogger("erp_logger")
logger.setLevel(logging.INFO)

context_filter = ContextualLogFilter()

if not logger.handlers:
    # Console Stream Handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    console_handler.addFilter(context_filter)
    logger.addHandler(console_handler)

    # Rotating File Handler (10MB limit, 5 backup files)
    file_handler = RotatingFileHandler(
        LOG_FILE,
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8"
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    file_handler.addFilter(context_filter)
    logger.addHandler(file_handler)

# 2. Audit Event Logger
audit_logger = logging.getLogger("erp_audit_logger")
audit_logger.setLevel(logging.INFO)
audit_logger.propagate = False

if not audit_logger.handlers:
    audit_file_handler = RotatingFileHandler(
        AUDIT_LOG_FILE,
        maxBytes=20 * 1024 * 1024,  # 20MB
        backupCount=10,
        encoding="utf-8"
    )
    audit_file_handler.setLevel(logging.INFO)
    audit_file_handler.setFormatter(logging.Formatter("%(message)s"))
    audit_logger.addHandler(audit_file_handler)


def log_audit_event(
    action: str,
    resource: str,
    user_id: Optional[str] = None,
    tenant_id: Optional[str] = None,
    status: str = "SUCCESS",
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None
) -> Dict[str, Any]:
    """Emit a structured security and compliance audit event."""
    effective_tenant = tenant_id or TenantContext.get_current_tenant() or "-"
    effective_user = user_id or get_user_id() or "-"
    effective_req_id = get_request_id() or "-"

    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event_type": "AUDIT",
        "action": action,
        "resource": resource,
        "tenant_id": effective_tenant,
        "user_id": effective_user,
        "request_id": effective_req_id,
        "status": status,
        "ip_address": ip_address or "-",
        "details": details or {}
    }
    audit_logger.info(json.dumps(event))
    return event
