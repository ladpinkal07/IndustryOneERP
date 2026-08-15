import { useState, useCallback } from 'react';
import { PAGINATION } from '../utils/constants';

export function usePagination(initialPage = PAGINATION.DEFAULT_PAGE, initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const setPaginationMeta = useCallback((meta) => {
    if (meta) {
      if (typeof meta.page === 'number') setPage(meta.page);
      if (typeof meta.page_size === 'number') setPageSize(meta.page_size);
      if (typeof meta.total_records === 'number') setTotalRecords(meta.total_records);
      if (typeof meta.total_pages === 'number') setTotalPages(meta.total_pages);
    }
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => (totalPages > 0 && prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const resetPagination = useCallback(() => {
    setPage(PAGINATION.DEFAULT_PAGE);
  }, []);

  return {
    page,
    pageSize,
    totalRecords,
    totalPages,
    setPage,
    setPageSize,
    setPaginationMeta,
    nextPage,
    prevPage,
    resetPagination,
    hasPrevPage: page > 1,
    hasNextPage: totalPages > 0 && page < totalPages,
  };
}
