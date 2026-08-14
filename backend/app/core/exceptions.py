from typing import Any, Dict, Optional


class ERPException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = 400,
        meta: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.meta = meta or {}
        super().__init__(message)


class DatabaseException(ERPException):
    def __init__(self, message: str, meta: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=400, meta=meta)


class PermissionException(ERPException):
    def __init__(self, message: str, meta: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=403, meta=meta)


class ValidationException(ERPException):
    def __init__(self, message: str, meta: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=422, meta=meta)
