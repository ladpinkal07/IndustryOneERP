from typing import Callable, List
from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.tenant import TenantContext


# Active Tenant verification dependency
def get_active_tenant(x_tenant_id: str = Header(..., alias="X-Tenant-ID")) -> str:
    if not x_tenant_id or x_tenant_id.strip() == "":
        raise HTTPException(
            status_code=400,
            detail="Missing or invalid X-Tenant-ID header."
        )
    # Set the ContextVar for this thread execution
    TenantContext.set_current_tenant(x_tenant_id)
    return x_tenant_id


# Mock User profile structure for authentication placeholder
class MockUser:
    def __init__(self, id: str, tenant_id: str, roles: List[str], permissions: List[str]):
        self.id = id
        self.tenant_id = tenant_id
        self.roles = roles
        self.permissions = permissions


# Mock Authenticated User dependency
def get_current_user(
    tenant_id: str = Depends(get_active_tenant),
    authorization: str = Header(..., alias="Authorization")
) -> MockUser:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format.")
    
    token = authorization.replace("Bearer ", "")
    if token == "invalid-token":
        raise HTTPException(status_code=401, detail="Authentication token expired or invalid.")
    
    # Mock user details mapped from active tenant header context
    return MockUser(
        id="usr_mock_123",
        tenant_id=tenant_id,
        roles=["ProductionManager"],
        permissions=["mdm:read", "production:read", "production:write", "settings:read", "settings:write"]
    )


# Role-Based Access Control (RBAC) verification dependency
def require_permission(required_permission: str) -> Callable:
    def dependency(current_user: MockUser = Depends(get_current_user)) -> MockUser:
        # Check permissions scope
        if required_permission not in current_user.permissions:
            raise HTTPException(
                status_code=403,
                detail=f"Permission Denied: Missing required permission '{required_permission}'."
            )
        return current_user
    return dependency
