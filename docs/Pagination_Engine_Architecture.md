# Enterprise ERP: Pagination Engine Architecture

This document defines the reusable pagination system used across all list endpoints in the ERP.

---

## 1. Components

### PaginationParams (Query Dependency)
Located in `app/schemas/base.py`. Injected via FastAPI `Depends()` on any list endpoint.

| Parameter | Type | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `page` | int | 1 | `>= 1` | 1-indexed page number |
| `page_size` | int | 20 | `1–100` | Items per page |

The `offset` property computes `(page - 1) * page_size` for SQL queries.

### ResponseMetadata (Pydantic Model)
Returned inside the `meta` field of every paginated `APIResponse`:

```json
{
  "page": 2,
  "page_size": 20,
  "total_records": 150,
  "total_pages": 8
}
```

### build_paginated_response() (Helper)
Computes `total_pages = ceil(total / page_size)` and assembles the full `APIResponse` envelope.

---

## 2. Repository Layer

`BaseMultiTenantRepository` provides two new methods:

| Method | Returns | Description |
| :--- | :--- | :--- |
| `count(db)` | `int` | Total non-deleted tenant-scoped rows |
| `list_paginated(db, page, page_size)` | `(items, total)` | Paginated slice + total count in a single call |

---

## 3. Controller Wiring

```python
from app.schemas.base import PaginationParams, build_paginated_response

@router.get("", response_model=APIResponse[List[ItemResponse]])
def list_items(
    pagination: PaginationParams = Depends(),
    db: Session = Depends(get_db),
):
    items, total = repository.list_paginated(
        db, page=pagination.page, page_size=pagination.page_size
    )
    return build_paginated_response(
        items=items, total=total,
        page=pagination.page, page_size=pagination.page_size
    )
```

---

## 4. Client Usage

```
GET /api/v1/settings?page=2&page_size=10
```

Response:
```json
{
  "success": true,
  "data": [...],
  "message": "System configurations loaded successfully",
  "meta": {
    "page": 2,
    "page_size": 10,
    "total_records": 35,
    "total_pages": 4
  }
}
```
