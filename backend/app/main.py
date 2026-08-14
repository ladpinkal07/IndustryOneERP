import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.api.middleware.tenant import TenantResolverMiddleware
from app.core.logging import logger
from app.core.exceptions import ERPException
from app.api.v1.api import api_router

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


# Request Logging Middleware (logs access metrics)
@app.middleware("http")
async def request_logger_middleware(request: Request, call_next) -> Response:
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    # Log access request data
    logger.info(
        "Request: %s %s - Status: %d - Duration: %.4fs - Client: %s",
        request.method,
        request.url.path,
        response.status_code,
        duration,
        request.client.host if request.client else "unknown"
    )
    return response


# Register V1 Routers
app.include_router(api_router, prefix="/api/v1")


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


# Central exception handler for custom ERP exceptions
@app.exception_handler(ERPException)
async def erp_exception_handler(request: Request, exc: ERPException):
    logger.warning("Application warning raised: %s", exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.message,
            "meta": exc.meta
        }
    )


# Exception handler for Pydantic/FastAPI input validations
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"field": str(err["loc"][-1]), "message": err["msg"]} for err in exc.errors()]
    logger.warning("Input validation failed: %s", str(errors))
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "data": None,
            "message": "Input validation failed.",
            "meta": {"errors": errors}
        }
    )


# Exception handler for database constraint failures
@app.exception_handler(IntegrityError)
async def database_integrity_exception_handler(request: Request, exc: IntegrityError):
    logger.error("Database integrity constraint failed: %s", str(exc.orig) if exc.orig else str(exc))
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "data": None,
            "message": "Database integrity constraint violation occurred.",
            "meta": {"detail": str(exc.orig) if exc.orig else "Constraint failed"}
        }
    )


# Central exception handler mapping unhandled exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
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
