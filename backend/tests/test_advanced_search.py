import pytest
from pydantic import ValidationError
from app.schemas.base import AdvancedSearchCriteria, AdvancedSearchRequest
from app.repositories.base import BaseMultiTenantRepository, BLOCKED_COLUMNS


# ---------------------------------------------------------------------------
# Schema validation tests
# ---------------------------------------------------------------------------

class TestAdvancedSearchCriteria:
    def test_valid_eq_criterion(self):
        c = AdvancedSearchCriteria(field="category", operator="eq", value="FINANCE")
        assert c.field == "category"
        assert c.operator == "eq"
        assert c.value == "FINANCE"

    def test_valid_contains_criterion(self):
        c = AdvancedSearchCriteria(field="setting_key", operator="contains", value="tax")
        assert c.operator == "contains"

    def test_valid_in_criterion(self):
        c = AdvancedSearchCriteria(field="value_type", operator="in", value=["string", "int"])
        assert isinstance(c.value, list)

    def test_valid_between_criterion(self):
        c = AdvancedSearchCriteria(field="created_at", operator="between", value=["2025-01-01", "2025-12-31"])
        assert len(c.value) == 2

    def test_invalid_operator_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            AdvancedSearchCriteria(field="category", operator="INVALID", value="x")
        assert "operator" in str(exc_info.value)

    def test_all_operators_accepted(self):
        ops = ["eq", "neq", "contains", "startswith", "endswith", "gt", "gte", "lt", "lte", "in", "between"]
        for op in ops:
            c = AdvancedSearchCriteria(field="test", operator=op, value="x")
            assert c.operator == op

    def test_missing_field_rejected(self):
        with pytest.raises(ValidationError):
            AdvancedSearchCriteria(operator="eq", value="x")

    def test_missing_value_rejected(self):
        with pytest.raises(ValidationError):
            AdvancedSearchCriteria(field="category", operator="eq")


class TestAdvancedSearchRequest:
    def test_defaults(self):
        req = AdvancedSearchRequest()
        assert req.criteria == []
        assert req.search is None
        assert req.sort_by is None
        assert req.sort_order == "asc"
        assert req.page == 1
        assert req.page_size == 20

    def test_with_criteria(self):
        req = AdvancedSearchRequest(
            criteria=[
                {"field": "category", "operator": "eq", "value": "FINANCE"},
                {"field": "setting_key", "operator": "contains", "value": "tax"},
            ],
            search="keyword",
            sort_by="created_at",
            sort_order="desc",
            page=3,
            page_size=50,
        )
        assert len(req.criteria) == 2
        assert req.criteria[0].field == "category"
        assert req.criteria[1].operator == "contains"
        assert req.search == "keyword"
        assert req.sort_order == "desc"
        assert req.page == 3

    def test_invalid_sort_order_rejected(self):
        with pytest.raises(ValidationError):
            AdvancedSearchRequest(sort_order="RANDOM")

    def test_page_must_be_positive(self):
        with pytest.raises(ValidationError):
            AdvancedSearchRequest(page=0)

    def test_page_size_max_100(self):
        with pytest.raises(ValidationError):
            AdvancedSearchRequest(page_size=101)


# ---------------------------------------------------------------------------
# Repository _apply_advanced_filters tests (using mock query objects)
# ---------------------------------------------------------------------------

class MockQuery:
    """Tracks how many times filter/in_/between/ilike is called."""
    def __init__(self):
        self.filter_count = 0

    def filter(self, *args):
        self.filter_count += 1
        return self


class MockCriterion:
    """Simple object to emulate AdvancedSearchCriteria without Pydantic."""
    def __init__(self, field, operator, value):
        self.field = field
        self.operator = operator
        self.value = value


class TestApplyAdvancedFilters:
    def _get_repo(self):
        from app.models.setting import SystemSetting
        return BaseMultiTenantRepository(SystemSetting)

    def test_empty_criteria(self):
        repo = self._get_repo()
        q = MockQuery()
        result = repo._apply_advanced_filters(q, [])
        assert result is q
        assert q.filter_count == 0

    def test_none_criteria(self):
        repo = self._get_repo()
        q = MockQuery()
        result = repo._apply_advanced_filters(q, None)
        assert result is q

    def test_blocked_column_skipped(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("tenant_id", "eq", "hacker-id")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 0

    def test_nonexistent_column_skipped(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("fake_column", "eq", "anything")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 0

    def test_eq_operator_applies_filter(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("category", "eq", "FINANCE")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 1

    def test_neq_operator_applies_filter(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("category", "neq", "SYSTEM")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 1

    def test_contains_operator_applies_filter(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("setting_key", "contains", "tax")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 1

    def test_startswith_operator_applies_filter(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("setting_key", "startswith", "fiscal")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 1

    def test_endswith_operator_applies_filter(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("setting_key", "endswith", "_rate")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 1

    def test_gt_operator_applies_filter(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("setting_value", "gt", "100")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 1

    def test_in_operator_applies_filter(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("value_type", "in", ["string", "int"])]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 1

    def test_in_operator_non_list_skipped(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("value_type", "in", "not_a_list")]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 0

    def test_between_operator_applies_filter(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("setting_value", "between", ["A", "Z"])]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 1

    def test_between_operator_wrong_length_skipped(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [MockCriterion("setting_value", "between", ["only_one"])]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 0

    def test_multiple_criteria_stacked(self):
        repo = self._get_repo()
        q = MockQuery()
        criteria = [
            MockCriterion("category", "eq", "FINANCE"),
            MockCriterion("setting_key", "contains", "tax"),
            MockCriterion("value_type", "in", ["string", "int"]),
        ]
        result = repo._apply_advanced_filters(q, criteria)
        assert q.filter_count == 3
