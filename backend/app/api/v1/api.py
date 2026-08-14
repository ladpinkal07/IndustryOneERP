from fastapi import APIRouter

# Base version 1 composition router
api_router = APIRouter()

# Individual module routes will be registered here, e.g.:
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(items.router, prefix="/items", tags=["items"])
