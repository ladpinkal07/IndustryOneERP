import pytest
from app.schemas.base import FilterSortParams
from app.repositories.base import BaseMultiTenantRepository, BLOCKED_COLUMNS


class TestFilterSortParams:
    def test_defaults(self):
        params = FilterSortParams(search=None, sort_by=None, sort_order="asc")
        assert params.search is None
        assert params.sort_by is None
        assert params.sort_order == "asc"

    def test_custom_values(self):
        params = FilterSortParams(search="currency", sort_by="category", sort_order="desc")
        assert params.search == "currency"
        assert params.sort_by == "category"
        assert params.sort_order == "desc"

    def test_search_only(self):
        params = FilterSortParams(search="hello", sort_by=None, sort_order="asc")
        assert params.search == "hello"
        assert params.sort_by is None


class TestBlockedColumns:
    def test_tenant_id_is_blocked(self):
        assert "tenant_id" in BLOCKED_COLUMNS

    def test_is_deleted_is_blocked(self):
        assert "is_deleted" in BLOCKED_COLUMNS

    def test_deleted_at_is_blocked(self):
        assert "deleted_at" in BLOCKED_COLUMNS

    def test_deleted_by_is_blocked(self):
        assert "deleted_by" in BLOCKED_COLUMNS

    def test_normal_column_not_blocked(self):
        assert "setting_key" not in BLOCKED_COLUMNS
        assert "category" not in BLOCKED_COLUMNS


class TestRepositorySearchableColumns:
    def test_base_has_empty_searchable(self):
        """Base repository defaults to no searchable columns."""
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        assert repo.searchable_columns == []

    def test_setting_repo_has_searchable_columns(self):
        """SystemSettingRepository declares searchable columns."""
        from app.repositories.setting import system_setting_repository
        assert "setting_key" in system_setting_repository.searchable_columns
        assert "category" in system_setting_repository.searchable_columns


class TestApplySearchMethod:
    """Test the _apply_search helper using a mock query object."""

    class MockQuery:
        """Minimal mock to track if filter() was called."""
        def __init__(self):
            self.filtered = False

        def filter(self, *args):
            self.filtered = True
            return self

    def test_no_search_returns_query_unchanged(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_search(query, None)
        assert result is query
        assert not query.filtered

    def test_no_search_empty_string(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_search(query, "")
        assert result is query
        assert not query.filtered


class TestApplyFiltersMethod:
    class MockQuery:
        def __init__(self):
            self.filter_count = 0

        def filter(self, *args):
            self.filter_count += 1
            return self

    def test_no_filters_returns_query_unchanged(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_filters(query, None)
        assert result is query
        assert query.filter_count == 0

    def test_empty_filters_returns_query_unchanged(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_filters(query, {})
        assert result is query
        assert query.filter_count == 0

    def test_blocked_column_is_skipped(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_filters(query, {"tenant_id": "hacker"})
        assert query.filter_count == 0

    def test_nonexistent_column_is_skipped(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_filters(query, {"nonexistent_col": "value"})
        assert query.filter_count == 0

    def test_valid_column_applies_filter(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_filters(query, {"category": "FINANCE"})
        assert query.filter_count == 1


class TestApplySortingMethod:
    class MockQuery:
        def __init__(self):
            self.ordered = False

        def order_by(self, *args):
            self.ordered = True
            return self

    def test_no_sort_returns_query_unchanged(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_sorting(query, None)
        assert result is query
        assert not query.ordered

    def test_blocked_column_sort_ignored(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_sorting(query, "tenant_id", "asc")
        assert not query.ordered

    def test_nonexistent_column_sort_ignored(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_sorting(query, "fake_column", "asc")
        assert not query.ordered

    def test_valid_column_sort_applied(self):
        from app.models.setting import SystemSetting
        repo = BaseMultiTenantRepository(SystemSetting)
        query = self.MockQuery()
        result = repo._apply_sorting(query, "category", "desc")
        assert query.ordered
