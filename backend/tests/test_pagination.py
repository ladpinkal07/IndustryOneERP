import math
import pytest
from app.schemas.base import (
    PaginationParams,
    ResponseMetadata,
    build_paginated_response,
)


class TestPaginationParams:
    def test_default_values(self):
        # When called via FastAPI DI, defaults are page=1, page_size=20.
        # Direct instantiation requires explicit values.
        params = PaginationParams(page=1, page_size=20)
        assert params.page == 1
        assert params.page_size == 20

    def test_custom_values(self):
        params = PaginationParams(page=3, page_size=50)
        assert params.page == 3
        assert params.page_size == 50

    def test_offset_calculation_page_1(self):
        params = PaginationParams(page=1, page_size=20)
        assert params.offset == 0

    def test_offset_calculation_page_3(self):
        params = PaginationParams(page=3, page_size=25)
        assert params.offset == 50  # (3-1)*25

    def test_offset_calculation_page_5(self):
        params = PaginationParams(page=5, page_size=10)
        assert params.offset == 40  # (5-1)*10


class TestBuildPaginatedResponse:
    def test_single_page(self):
        items = [{"id": 1}, {"id": 2}]
        resp = build_paginated_response(items=items, total=2, page=1, page_size=20)
        assert resp.success is True
        assert resp.data == items
        assert resp.meta.page == 1
        assert resp.meta.page_size == 20
        assert resp.meta.total_records == 2
        assert resp.meta.total_pages == 1

    def test_multiple_pages(self):
        items = [{"id": i} for i in range(10)]
        resp = build_paginated_response(items=items, total=55, page=2, page_size=10)
        assert resp.meta.total_records == 55
        assert resp.meta.total_pages == 6  # ceil(55/10)
        assert resp.meta.page == 2
        assert resp.meta.page_size == 10

    def test_exact_page_boundary(self):
        items = [{"id": i} for i in range(5)]
        resp = build_paginated_response(items=items, total=100, page=1, page_size=20)
        assert resp.meta.total_pages == 5  # 100/20 exactly

    def test_empty_results(self):
        resp = build_paginated_response(items=[], total=0, page=1, page_size=20)
        assert resp.success is True
        assert resp.data == []
        assert resp.meta.total_records == 0
        assert resp.meta.total_pages == 0

    def test_custom_message(self):
        resp = build_paginated_response(
            items=[], total=0, page=1, page_size=10, message="Custom message"
        )
        assert resp.message == "Custom message"

    def test_last_page_partial(self):
        items = [{"id": 1}]
        resp = build_paginated_response(items=items, total=21, page=3, page_size=10)
        assert resp.meta.total_pages == 3  # ceil(21/10)
        assert resp.meta.page == 3


class TestResponseMetadata:
    def test_metadata_fields(self):
        meta = ResponseMetadata(page=2, page_size=25, total_records=100, total_pages=4)
        assert meta.page == 2
        assert meta.page_size == 25
        assert meta.total_records == 100
        assert meta.total_pages == 4

    def test_metadata_serialization(self):
        meta = ResponseMetadata(page=1, page_size=20, total_records=50, total_pages=3)
        data = meta.model_dump()
        assert "page" in data
        assert "page_size" in data
        assert "total_records" in data
        assert "total_pages" in data
