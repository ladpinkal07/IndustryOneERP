from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.tenant import TenantContext


class TenantResolverMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # Extract tenant ID from HTTP headers
        tenant_id = request.headers.get("X-Tenant-ID")

        if tenant_id:
            # Set the execution context for this request
            token = TenantContext.set_current_tenant(tenant_id)
            try:
                response = await call_next(request)
                return response
            finally:
                # Guarantee context clearing to prevent memory/data leakage
                TenantContext.clear_current_tenant(token)
        else:
            # Bypass setting context if header is absent (e.g. public health routes)
            return await call_next(request)
