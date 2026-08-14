from fastapi import APIRouter
from app.api.v1.endpoints import settings

# Base version 1 composition router
api_router = APIRouter()

api_router.include_router(settings.router, prefix="/settings", tags=["settings"])

# Individual module routes will be registered here, e.g.:
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(items.router, prefix="/items", tags=["items"])
