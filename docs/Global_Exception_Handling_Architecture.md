# Enterprise ERP: Global Exception Handling Architecture

This document defines the rules for mapping exceptions, HTTP error responses, database constraint failures, validation warnings, and logging stack traces in the system.

---

## 1. Unified Error Response Format

To simplify frontend handling, all server errors must resolve to the standardized JSON envelope:

```json
{
  "success": false,
  "data": null,
  "message": "Human-readable description of what went wrong",
  "meta": {
    "detail": "Detailed developer context or validation fields lists"
  }
}
```

---

## 2. Exception Mapping Grid

The central middleware registers handlers converting key errors to HTTP states:

| Exception Class | Status Code | Reason | Envelope Payload |
| :--- | :--- | :--- | :--- |
| `sqlalchemy.exc.IntegrityError` | `400 Bad Request` | Constraint violation | `{"success": false, "message": "Database integrity constraint violation occurred.", "meta": {"detail": "..."}}` |
| `starlette.exceptions.HTTPException` | `401 / 403 / 404` | Standard HTTP errors | `{"success": false, "message": "...", "meta": null}` |
| `app.core.exceptions.ERPException` | `Custom (4xx)` | Business rule violates | `{"success": false, "message": "...", "meta": {...}}` |
| `fastapi.exceptions.RequestValidationError`| `422 Unprocessable` | Input mismatch | `{"success": false, "message": "Input validation failed.", "meta": {"errors": [{"field": "...", "message": "..."}]}}` |
| `Exception` (Fallback) | `500 Server Error` | Unhandled crashes | `{"success": false, "message": "An unexpected server error occurred.", "meta": {"detail": "..."}}` |

---

## 3. Operations Guidelines

*   **Exceptions Logging:** All unhandled exceptions mapped to `500` status codes must print full tracebacks using `logger.error(..., exc_info=True)` to logs files.
*   **Security Bounds:** Never expose internal Python file paths, query formats, or raw SQL errors inside `500` error payloads. Expose them only for validation errors (422) or constraint details (400) when safe.
