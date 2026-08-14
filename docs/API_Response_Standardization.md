# Enterprise ERP: API Response Standardization

This document defines the rules for wrapping all REST API responses inside standard JSON envelope configurations.

---

## 1. Unified Response Envelope

Every request returned by the ERP (both version-1 and version-2 endpoints) must conform to the generic `APIResponse` Pydantic model:

```json
{
  "success": true,
  "data": {
    "key": "value"
  },
  "message": "Resource retrieved successfully",
  "meta": null
}
```

### Response Parameter Specifications:
*   **`success`** (boolean): Declares if the query was processed without warnings/exceptions.
*   **`data`** (any/null): Contains the requested resource payloads. If an error occurs, this defaults to `null`.
*   **`message`** (string/null): Provides a user-friendly status message.
*   **`meta`** (dict/null): Stores supplemental request-level telemetry parameters (e.g. pagination metrics).

---

## 2. Standardized Pagination Schemas

For query list requests, the `meta` dict parameter maps pagination states to guide client requests:

```json
{
  "success": true,
  "data": [...],
  "message": "Items list loaded successfully",
  "meta": {
    "pagination": {
      "total_records": 1250,
      "page_size": 100,
      "current_page": 2,
      "total_pages": 13
    }
  }
}
```

---

## 3. Standard HTTP Status Responses

We strictly map HTTP status codes to action triggers:
*   `200 OK`: Resource queried, modified, or processed successfully.
*   `201 Created`: Resource successfully written to the database.
*   `204 No Content`: Resource deleted or processed successfully with no returning payload.
