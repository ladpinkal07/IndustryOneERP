from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import SessionLocal
from app.schemas.base import APIResponse

# Base version 2 composition router
api_router = APIRouter()


@api_router.get("/health", response_model=APIResponse, tags=["system"])
async def health_check_v2():
    db_status = "UNKNOWN"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db_status = "CONNECTED"
        db.close()
    except Exception as e:
        db_status = "UNREACHABLE"

    return APIResponse(
        success=True,
        data={
            "status": "HEALTHY" if db_status == "CONNECTED" else "UNHEALTHY",
            "version": "2.0.0",
            "database": db_status
        },
        message="ERP V2 API is running and accessible"
    )
