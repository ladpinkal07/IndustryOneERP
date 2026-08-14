import contextvars
from typing import Optional

# Thread-safe context for asynchronous request isolation
_tenant_context: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "tenant_id", default=None
)


class TenantContext:
    @staticmethod
    def get_current_tenant() -> Optional[str]:
        return _tenant_context.get()

    @staticmethod
    def set_current_tenant(tenant_id: str) -> contextvars.Token:
        return _tenant_context.set(tenant_id)

    @staticmethod
    def clear_current_tenant(token: Optional[contextvars.Token] = None) -> None:
        if token is not None:
            _tenant_context.reset(token)
        else:
            _tenant_context.set(None)
