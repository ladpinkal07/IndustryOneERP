import math
from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel, Field, ConfigDict
from fastapi import Query

T = TypeVar("T")


class PaginationParams:
    """Reusable dependency for extracting pagination query parameters."""

    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number (1-indexed)"),
        page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    ):
        self.page = page
        self.page_size = page_size

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


class ResponseMetadata(BaseModel):
    page: int
    page_size: int
    total_records: int
    total_pages: int

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "page": 1,
                "page_size": 20,
                "total_records": 150,
                "total_pages": 8
            }
        }
    )


class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Operation completed successfully"
    meta: Optional[ResponseMetadata] = None


class ErrorDetail(BaseModel):
    field: str
    message: str


class APIErrorResponse(BaseModel):
    success: bool = False
    data: Optional[Any] = None
    message: str
    meta: Optional[dict] = Field(default_factory=dict)


def build_paginated_response(
    items: List,
    total: int,
    page: int,
    page_size: int,
    message: str = "Records retrieved successfully",
) -> APIResponse:
    """Build a standardized paginated APIResponse envelope."""
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return APIResponse(
        success=True,
        data=items,
        message=message,
        meta=ResponseMetadata(
            page=page,
            page_size=page_size,
            total_records=total,
            total_pages=total_pages,
        ),
    )

