# Enterprise ERP: Filtering & Sorting Engine Architecture

This document defines the reusable filtering, search, and sorting system used across all list endpoints.

---

## 1. Components

### FilterSortParams (Query Dependency)
Located in `app/schemas/base.py`. Injected via FastAPI `Depends()` alongside `PaginationParams`.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | str (optional) | `null` | Case-insensitive LIKE search across `searchable_columns` |
| `sort_by` | str (optional) | `null` | Column name to sort by |
| `sort_order` | str | `asc` | Sort direction: `asc` or `desc` (validated by regex) |

### Security: BLOCKED_COLUMNS
The following columns are **never** allowed for filtering or sorting to prevent data leakage:
- `tenant_id`, `is_deleted`, `deleted_at`, `deleted_by`

---

## 2. Repository Layer Methods

`BaseMultiTenantRepository` provides three internal helpers and an enhanced `list_paginated()`:

| Method | Purpose |
| :--- | :--- |
| `_apply_search(query, search)` | Applies `ILIKE %term%` across all `searchable_columns` with `OR` |
| `_apply_filters(query, filters)` | Applies exact-match `WHERE col = val` for non-blocked columns |
| `_apply_sorting(query, sort_by, sort_order)` | Applies `ORDER BY col ASC/DESC` for non-blocked columns |
| `list_paginated(...)` | Orchestrates search → filter → count → sort → paginate |

### Configuring Searchable Columns
Each repository subclass declares which columns support LIKE search:

```python
class SystemSettingRepository(BaseMultiTenantRepository[SystemSetting]):
    searchable_columns = ["setting_key", "setting_value", "category", "description"]
```

---

## 3. Controller Wiring

```python
@router.get("", response_model=APIResponse[List[ItemResponse]])
def list_items(
    pagination: PaginationParams = Depends(),
    filtering: FilterSortParams = Depends(),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    filters = {}
    if category:
        filters["category"] = category

    items, total = repository.list_paginated(
        db,
        page=pagination.page, page_size=pagination.page_size,
        search=filtering.search,
        sort_by=filtering.sort_by, sort_order=filtering.sort_order,
        filters=filters or None,
    )
    return build_paginated_response(items=items, total=total, ...)
```

---

## 4. Client Usage Examples

```
# Search
GET /api/v1/settings?search=currency

# Sort descending by category
GET /api/v1/settings?sort_by=category&sort_order=desc

# Filter by category
GET /api/v1/settings?category=FINANCE

# Combined: search + sort + filter + paginate
GET /api/v1/settings?search=tax&sort_by=setting_key&sort_order=asc&category=FINANCE&page=2&page_size=10
```
