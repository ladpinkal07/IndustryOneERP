from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.middleware.tenant import TenantResolverMiddleware
from app.core.logging import logger

app = FastAPI(
    title="IndustryOne ERP API Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middlewares registration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Multi-Tenant Isolation Middleware
app.add_middleware(TenantResolverMiddleware)


# Global health check endpoint
@app.get("/api/v1/health", tags=["system"])
async def health_check():
    logger.info("System health check triggered")
    return {
        "success": True,
        "data": {
            "status": "HEALTHY",
            "version": "1.0.0"
        },
        "message": "ERP Backend Server is running and accessible",
        "meta": None
    }


# Central exception handler mapping unhandled exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error("Unhandled System Exception occurred: %s", str(exc), exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "data": None,
            "message": "An unexpected server error occurred.",
            "meta": {"detail": str(exc)}
        }
    )
