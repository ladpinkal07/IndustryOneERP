import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';
import DataTableToolbar from './DataTableToolbar';
import TableSkeleton from './TableSkeleton';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  sortBy = null,
  sortOrder = 'asc',
  onSort = null,
  selectable = false,
  selectedIds = [],
  onSelectRow = null,
  onSelectAll = null,
  onRowClick = null,
  rowKey = 'id',
  pagination = null, // { page, pageSize, totalRecords, totalPages, onPageChange, onPageSizeChange }
  toolbar = null,    // { search, onSearchChange, onExportCsv, onExportJson, onRefresh, primaryAction, bulkActions, ... }
  expandable = false,
  expandedRowRender = null,
  stickyHeader = false,
  useSkeleton = true,
  skeletonRows = 5,
  className = '',
}) {
  const [expandedRows, setExpandedRows] = useState({});

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSort = (colKey, sortable) => {
    if (!sortable || !onSort) return;
    const newOrder = sortBy === colKey && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(colKey, newOrder);
  };

  const toggleRowExpand = (rowId, e) => {
    e.stopPropagation();
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // If initial load with no data and useSkeleton enabled, render TableSkeleton
  if (loading && data.length === 0 && useSkeleton) {
    return (
      <div className={`data-table-container ${className}`}>
        <TableSkeleton
          rows={skeletonRows}
          columns={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
          showToolbar={!!toolbar}
        />
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`}>
      {/* Optional integrated toolbar */}
      {toolbar && (
        <DataTableToolbar
          search={toolbar.search}
          onSearchChange={toolbar.onSearchChange}
          searchPlaceholder={toolbar.searchPlaceholder}
          selectedCount={selectedIds.length}
          onClearSelection={toolbar.onClearSelection}
          bulkActions={toolbar.bulkActions}
          columns={columns}
          hiddenColumnKeys={toolbar.hiddenColumnKeys}
          onToggleColumnVisibility={toolbar.onToggleColumnVisibility}
          onExportCsv={toolbar.onExportCsv}
          onExportJson={toolbar.onExportJson}
          onRefresh={toolbar.onRefresh}
          primaryAction={toolbar.primaryAction}
        />
      )}

      {/* Main Table Shell */}
      <div className="table-responsive border rounded bg-white position-relative overflow-hidden">
        {loading && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-2"
            style={{ backdropFilter: 'blur(1px)' }}
          >
            <LoadingSpinner message="Updating table..." />
          </div>
        )}

        <table className="table table-hover erp-grid align-middle mb-0">
          <thead className={stickyHeader ? 'sticky-top' : ''}>
            <tr>
              {/* Expandable toggle column */}
              {expandable && <th style={{ width: '36px' }} />}

              {/* Row selection checkbox column */}
              {selectable && (
                <th style={{ width: '40px' }} className="text-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                    aria-label="Select all rows"
                  />
                </th>
              )}

              {/* Data Columns */}
              {columns.map((col) => {
                const isSorted = sortBy === col.key;
                return (
                  <th
                    key={col.key}
                    style={{
                      width: col.width || 'auto',
                      textAlign: col.align || 'left',
                      cursor: col.sortable && onSort ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={() => handleSort(col.key, col.sortable)}
                  >
                    <div
                      className={`d-inline-flex align-items-center gap-1 ${
                        col.align === 'right'
                          ? 'justify-content-end'
                          : col.align === 'center'
                          ? 'justify-content-center'
                          : ''
                      }`}
                    >
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="small text-muted">
                          {isSorted ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
                  className="text-center py-5 text-muted small"
                >
                  <div className="fs-3 mb-2 opacity-50">📂</div>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => {
                const rowId = row[rowKey] !== undefined ? row[rowKey] : rIdx;
                const isSelected = selectedIds.includes(rowId);
                const isExpanded = !!expandedRows[rowId];

                return (
                  <React.Fragment key={rowId}>
                    <tr
                      className={`${isSelected ? 'table-primary bg-opacity-10' : ''} ${
                        isExpanded ? 'table-active' : ''
                      }`}
                      onClick={() => onRowClick && onRowClick(row)}
                      style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                      {/* Expandable toggle button */}
                      {expandable && (
                        <td className="text-center" onClick={(e) => toggleRowExpand(rowId, e)}>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-muted p-0 border-0 text-decoration-none"
                            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.15s ease',
                              }}
                            >
                              ›
                            </span>
                          </button>
                        </td>
                      )}

                      {/* Select row checkbox */}
                      {selectable && (
                        <td
                          className="text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={(e) => onSelectRow && onSelectRow(rowId, e.target.checked)}
                            aria-label={`Select row ${rowId}`}
                          />
                        </td>
                      )}

                      {/* Data Cells */}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          style={{ textAlign: col.align || 'left' }}
                        >
                          {col.render
                            ? col.render(row[col.key], row)
                            : row[col.key] !== null && row[col.key] !== undefined
                            ? String(row[col.key])
                            : '-'}
                        </td>
                      ))}
                    </tr>

                    {/* Expandable Row Details View */}
                    {expandable && isExpanded && expandedRowRender && (
                      <tr className="bg-light-subtle">
                        <td
                          colSpan={columns.length + (selectable ? 1 : 0) + 1}
                          className="p-3 border-bottom"
                        >
                          {expandedRowRender(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Optional Integrated Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalRecords={pagination.totalRecords}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions}
        />
      )}
    </div>
  );
}
