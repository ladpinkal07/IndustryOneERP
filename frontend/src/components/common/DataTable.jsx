import React from 'react';
import LoadingSpinner from './LoadingSpinner';

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
  className = '',
}) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSort = (colKey, sortable) => {
    if (!sortable || !onSort) return;
    const newOrder = sortBy === colKey && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(colKey, newOrder);
  };

  return (
    <div className={`table-responsive border rounded bg-white position-relative overflow-hidden ${className}`}>
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-2"
          style={{ backdropFilter: 'blur(1px)' }}
        >
          <LoadingSpinner message="Updating table..." />
        </div>
      )}

      <table className="table table-hover erp-grid align-middle mb-0">
        <thead>
          <tr>
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
                  <div className={`d-inline-flex align-items-center gap-1 ${col.align === 'right' ? 'justify-content-end' : ''}`}>
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
                colSpan={columns.length + (selectable ? 1 : 0)}
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

              return (
                <tr
                  key={rowId}
                  className={isSelected ? 'table-primary bg-opacity-10' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
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

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render ? col.render(row[col.key], row) : (row[col.key] !== null && row[col.key] !== undefined ? String(row[col.key]) : '-')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
