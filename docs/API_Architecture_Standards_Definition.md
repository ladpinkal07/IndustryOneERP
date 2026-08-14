# Enterprise ERP: API Architecture & Standards Definition

This document defines the interface standards, serialization envelopes, validation rules, HTTP status code usage, query string conventions, and exception handling middleware protocols for all ERP API endpoints.

---

## 1. REST API Endpoint Conventions & Versioning

All API routes follow standard pluralized REST endpoints structured under a global version prefix.

*   **Prefix Format:** `/api/v{version_number}/` (e.g., `/api/v1/`)
*   **Path Conventions:** Plural nouns for resource collections, lower-case snake_case.
    *   *Create an Item:* `POST /api/v1/items`
    *   *Retrieve Item List:* `GET /api/v1/items`
    *   *Retrieve Single Item:* `GET /api/v1/items/{id}`
    *   *Update Item details:* `PUT /api/v1/items/{id}`
    *   *Delete Item:* `DELETE /api/v1/items/{id}`
    *   *List Work Order Materials:* `GET /api/v1/work-orders/{id}/materials`

---

## 2. Standard HTTP Methods & Status Codes

We mapping HTTP operations to the following standard success and error codes:

| HTTP Method | API Action | Expected Success Code | Common Error Codes |
| :--- | :--- | :--- | :--- |
| **GET** | Read / Search collections or single records | `200 OK` | `401 Unauthorized`, `403 Forbidden`, `404 Not Found` |
| **POST** | Create a new record or trigger calculations | `201 Created` | `400 Bad Request`, `422 Unprocessable Entity` |
| **PUT** | Replace/overwrite existing record | `200 OK` | `400 Bad Request`, `404 Not Found`, `422 Unprocessable Entity` |
| **PATCH** | Partially update selective fields | `200 OK` | `400 Bad Request`, `404 Not Found`, `422 Unprocessable Entity` |
| **DELETE** | Soft-delete a record | `200 OK` or `204 No Content` | `400 Bad Request` (active dependency blocks deletion) |

---

## 3. Serialization Envelopes (JSON Layouts)

To keep responses consistent across the frontend grid tables and client callers, every response must use a uniform JSON wrapper.

### 1. Standard Success Envelope (Single Record)
```json
{
  "success": true,
  "data": {
    "id": "itm_98a72b",
    "sku": "RAW-STL-001",
    "name": "Stainless Steel Plate 5mm"
  },
  "message": "Item retrieved successfully",
  "meta": null
}
```

### 2. Standard Paginated List Envelope
```json
{
  "success": true,
  "data": [
    {
      "id": "itm_98a72b",
      "sku": "RAW-STL-001"
    }
  ],
  "message": "Items fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total_records": 125,
    "total_pages": 13
  }
}
```

### 3. Standard Error Envelope
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed on input parameters",
  "meta": {
    "errors": [
      {
        "field": "sku",
        "message": "SKU length must be between 3 and 50 characters"
      }
    ]
  }
}
```

---

## 4. Pydantic Serialization Schema Definitions

Below are the base Pydantic models to be inherited by all resource-specific schemas.

```python
from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel, Field

T = TypeVar("T")

# Response Metadata Schema
class ResponseMetadata(BaseModel):
    page: int
    limit: int
    total_records: int
    total_pages: int

# Generic Success Response Schema
class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Operation completed successfully"
    meta: Optional[ResponseMetadata] = None

# Validation Error Detail
class ErrorDetail(BaseModel):
    field: str
    message: str

# Response Error Envelope
class APIErrorResponse(BaseModel):
    success: bool = False
    data: Optional[Any] = None
    message: str
    meta: Optional[dict] = Field(default_factory=dict) # E.g., {"errors": [...]}
```

---

## 5. Query String Parameter Standards (Filtering, Sorting, Pagination)

To avoid building custom filtering strings for every resource, the API layer implements uniform query parameter parsing rules:

### 1. Pagination Parameters
*   `page`: Target page index (1-based, default: 1).
*   `limit`: Records per page (range 1-100, default: 20, max enforcement: 250).

### 2. Sorting Format
*   `sort`: Multi-field comma-separated sorting criteria.
*   Prefix fields with `-` for descending ordering.
*   *Example:* `GET /api/v1/items?sort=-created_at,name` (Translates to `ORDER BY created_at DESC, name ASC`).

### 3. Filtering Syntax
*   Format: `{field}__{operator}={value}`.
*   *Example:* `GET /api/v1/items?quantity__gte=100&status__eq=ACTIVE` (Translates to SQL `quantity >= 100 AND status = 'ACTIVE'`).
*   Supported operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`.

---

## 6. Global Exception Middleware Mapping

The backend application contains a central exception handler mapping all standard system errors to standard JSON response envelopes:

```mermaid
graph TD
    Exception[System Error Raised] --> DBException{DB Integrity Error?}
    Exception --> AuthException{JWT / Permissions Error?}
    Exception --> PydanticException{Pydantic Validation Error?}

    DBException -- Yes --> 400Response[400 Bad Request: "Duplicate entry or foreign key violation"]
    AuthException -- Yes --> 401Response[401/403: "Token expired or permission denied"]
    PydanticException -- Yes --> 422Response[422 Unprocessable Entity: List of fields and reasons]
```

### Response Mapping Matrix:
1.  `SQLAlchemy.exc.IntegrityError` (Duplicate fields, constraint fails) `400 Bad Request`.
2.  `AuthJWT.exceptions.AuthJWTException` (Expired or tampered token) `401 Unauthorized`.
3.  `Pydantic.ValidationError` (Schema schema check failed) `422 Unprocessable Entity`.
4.  `Base HTTPException` (API raised errors) Custom HTTP Status code.
5.  `Unexpected Exception` (System bugs, database losses) `500 Internal Server Error`.
