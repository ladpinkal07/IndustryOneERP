import { useState, useCallback, useEffect, useMemo } from 'react';
import { usePagination } from './usePagination';
import { useDebounce } from './useDebounce';
import { exportTableToCsv, exportTableToJson } from '../utils/tableExport';
import { extractErrorMessage } from '../utils/errorHandler';

/**
 * Enterprise Data Table Management Hook
 * Connects table state (page, sort, search, filters, selection) directly to backend services.
 */
export function useDataTable({
  fetchFn,
  initialPageSize = 20,
  initialSortBy = null,
  initialSortOrder = 'asc',
  initialFilters = {},
  columns = [],
  rowKey = 'id',
  autoFetch = true,
  exportFilename = 'erp_export',
} = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [filters, setFilters] = useState(initialFilters);

  // Sort State
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  // Pagination State
  const pagination = usePagination(1, initialPageSize);

  // Row Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Column Visibility State
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState([]);

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => !hiddenColumnKeys.includes(col.key));
  }, [columns, hiddenColumnKeys]);

  const toggleColumnVisibility = useCallback((colKey) => {
    setHiddenColumnKeys((prev) =>
      prev.includes(colKey) ? prev.filter((k) => k !== colKey) : [...prev, colKey]
    );
  }, []);

  // Fetch Data Function
  const loadData = useCallback(async () => {
    if (!fetchFn) return;
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(sortBy ? { sort_by: sortBy, sort_order: sortOrder } : {}),
        ...filters,
      };

      const response = await fetchFn(params);
      const items = response && response.data !== undefined ? response.data : response;
      setData(Array.isArray(items) ? items : []);

      if (response && response.meta) {
        pagination.setPaginationMeta(response.meta);
      }
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, pagination.page, pagination.pageSize, debouncedSearch, sortBy, sortOrder, filters]);

  // Trigger load on state change
  useEffect(() => {
    if (autoFetch) {
      loadData();
    }
  }, [loadData, autoFetch]);

  // Sort handler
  const handleSort = useCallback((colKey, newOrder) => {
    setSortBy(colKey);
    setSortOrder(newOrder);
    pagination.resetPagination();
  }, [pagination]);

  // Selection handlers
  const handleSelectRow = useCallback(
    (rowId, checked) => {
      setSelectedIds((prev) =>
        checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)
      );
    },
    []
  );

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        const allIds = data.map((row, idx) =>
          row[rowKey] !== undefined ? row[rowKey] : idx
        );
        setSelectedIds(allIds);
      } else {
        setSelectedIds([]);
      }
    },
    [data, rowKey]
  );

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // Export handlers
  const exportCsv = useCallback(
    (customFilename) => {
      exportTableToCsv(visibleColumns, data, customFilename || exportFilename);
    },
    [visibleColumns, data, exportFilename]
  );

  const exportJson = useCallback(
    (customFilename) => {
      exportTableToJson(data, customFilename || exportFilename);
    },
    [data, exportFilename]
  );

  return {
    data,
    loading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    sortBy,
    sortOrder,
    handleSort,
    pagination,
    selectedIds,
    handleSelectRow,
    handleSelectAll,
    clearSelection,
    visibleColumns,
    hiddenColumnKeys,
    toggleColumnVisibility,
    refetch: loadData,
    exportCsv,
    exportJson,
  };
}
