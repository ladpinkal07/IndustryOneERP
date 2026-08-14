from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel, Field

T = TypeVar("T")


class ResponseMetadata(BaseModel):
    page: int
    limit: int
    total_records: int
    total_pages: int


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
