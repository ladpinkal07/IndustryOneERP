from pydantic import BaseModel, Field
from fastapi.testclient import TestClient
from sqlalchemy.exc import IntegrityError
from app.main import app
from app.core.exceptions import ERPException

client = TestClient(app, raise_server_exceptions=False)


# Mock schemas for validation testing
class MockItem(BaseModel):
    sku: str = Field(min_length=3)


@app.post("/api/v1/test-validation")
def mock_validation_endpoint(item: MockItem):
    return {"sku": item.sku}


@app.get("/api/v1/test-integrity")
def mock_integrity_endpoint():
    # Raise a mock IntegrityError simulating a duplicate key constraint
    raise IntegrityError(
        statement="INSERT INTO item ...",
        params=[],
        orig=Exception("Duplicate entry 'RAW-01' for key 'uq_item_sku'")
    )


@app.get("/api/v1/test-custom-err")
def mock_custom_err_endpoint(code: int = 400):
    raise ERPException(
        message="Business rule violated",
        status_code=code,
        meta={"reason": "insufficient_stock"}
    )


def test_pydantic_validation_handler():
    # Request payload is invalid (sku too short)
    response = client.post("/api/v1/test-validation", json={"sku": "ab"})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "errors" in data["meta"]
    assert data["meta"]["errors"][0]["field"] == "sku"


def test_database_integrity_handler():
    response = client.get("/api/v1/test-integrity")
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "uq_item_sku" in data["meta"]["detail"]


def test_custom_erp_exception_handler():
    response = client.get("/api/v1/test-custom-err?code=403")
    assert response.status_code == 403
    data = response.json()
    assert data["success"] is False
    assert data["message"] == "Business rule violated"
    assert data["meta"]["reason"] == "insufficient_stock"
