# Enterprise ERP: Advanced Search Engine Architecture

This document defines the operator-based advanced search system that extends the basic filtering engine.

---

## 1. Supported Operators

| Operator | SQL Equivalent | Value Type | Example |
| :--- | :--- | :--- | :--- |
| `eq` | `= value` | scalar | `{"field": "category", "operator": "eq", "value": "FINANCE"}` |
| `neq` | `!= value` | scalar | `{"field": "category", "operator": "neq", "value": "SYSTEM"}` |
| `contains` | `ILIKE %value%` | string | `{"field": "setting_key", "operator": "contains", "value": "tax"}` |
| `startswith` | `ILIKE value%` | string | `{"field": "setting_key", "operator": "startswith", "value": "fiscal"}` |
| `endswith` | `ILIKE %value` | string | `{"field": "description", "operator": "endswith", "value": "policy"}` |
| `gt` | `> value` | comparable | `{"field": "created_at", "operator": "gt", "value": "2025-01-01"}` |
| `gte` | `>= value` | comparable | `{"field": "setting_value", "operator": "gte", "value": "100"}` |
| `lt` | `< value` | comparable | `{"field": "created_at", "operator": "lt", "value": "2026-01-01"}` |
| `lte` | `<= value` | comparable | `{"field": "setting_value", "operator": "lte", "value": "999"}` |
| `in` | `IN (values)` | list | `{"field": "value_type", "operator": "in", "value": ["string", "int"]}` |
| `between` | `BETWEEN a AND b` | list[2] | `{"field": "created_at", "operator": "between", "value": ["2025-01-01", "2025-12-31"]}` |

---

## 2. Schema Models

### AdvancedSearchCriteria
A single filter condition with `field`, `operator`, and `value`.

### AdvancedSearchRequest (POST body)
Bundles multiple criteria with search, sort, and pagination:

```json
{
  "criteria": [
    {"field": "category", "operator": "eq", "value": "FINANCE"},
    {"field": "setting_key", "operator": "contains", "value": "tax"}
  ],
  "search": "optional keyword",
  "sort_by": "created_at",
  "sort_order": "desc",
  "page": 1,
  "page_size": 20
}
```

---

## 3. Repository Methods

| Method | Purpose |
| :--- | :--- |
| `_apply_advanced_filters(query, criteria_list)` | Maps each criterion to a SQLAlchemy column expression |
| `advanced_search(db, criteria_list, search, sort_by, sort_order, page, page_size)` | Orchestrates search → advanced filters → count → sort → paginate |

---

## 4. Security

- **BLOCKED_COLUMNS** (`tenant_id`, `is_deleted`, `deleted_at`, `deleted_by`) are silently skipped
- Non-existent column names are silently skipped (no error leakage)
- `in` requires a list value; non-list is skipped
- `between` requires exactly 2 elements; invalid lengths are skipped

---

## 5. API Endpoint

```
POST /api/v1/settings/search
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant>

{
  "criteria": [
    {"field": "category", "operator": "eq", "value": "FINANCE"},
    {"field": "setting_key", "operator": "contains", "value": "tax"}
  ],
  "sort_by": "setting_key",
  "sort_order": "asc",
  "page": 1,
  "page_size": 10
}
```

Response follows the standard `APIResponse` envelope with pagination metadata.
