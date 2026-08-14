from fastapi import APIRouter

# Base version 2 composition router
api_router = APIRouter()


@api_router.get("/health", tags=["system"])
async def health_check_v2():
    return {
        "success": True,
        "data": {
            "status": "HEALTHY",
            "version": "2.0.0"
        },
        "message": "ERP V2 API is running and accessible",
        "meta": None
    }
