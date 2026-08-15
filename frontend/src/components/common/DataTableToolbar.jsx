import React from 'react';
import SearchInput from './SearchInput';
import Button from './Button';
import Badge from './Badge';

export default function DataTableToolbar({
  search = '',
  onSearchChange = null,
  searchPlaceholder = 'Search records...',
  selectedCount = 0,
  onClearSelection = null,
  bulkActions = null,
  columns = [],
  hiddenColumnKeys = [],
  onToggleColumnVisibility = null,
  onExportCsv = null,
  onExportJson = null,
  onRefresh = null,
  primaryAction = null,
  className = '',
}) {
  return (
    <div className={`data-table-toolbar mb-3 ${className}`}>
      {/* Bulk selection action bar */}
      {selectedCount > 0 ? (
        <div className="alert alert-primary border-0 shadow-sm py-2 px-3 mb-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <Badge variant="primary" pill>
              {selectedCount} selected
            </Badge>
            <span className="small text-dark">records chosen for bulk operation</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            {bulkActions}
            {onClearSelection && (
              <Button variant="outline-secondary" size="sm" onClick={onClearSelection}>
                Clear Selection
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Standard search and controls bar */
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          {/* Left: Search input */}
          <div className="flex-grow-1" style={{ maxWidth: '340px' }}>
            {onSearchChange && (
              <SearchInput
                value={search}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
              />
            )}
          </div>

          {/* Right: Actions, Column Toggler, Exports, Refresh */}
          <div className="d-flex align-items-center flex-wrap gap-2">
            {/* Column Visibility Dropdown */}
            {columns.length > 0 && onToggleColumnVisibility && (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  title="Customize Columns"
                >
                  <span>👁️</span>
                  <span className="d-none d-sm-inline">Columns</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm p-2" style={{ minWidth: '200px' }}>
                  <li className="dropdown-header small fw-bold px-2 py-1">Toggle Columns</li>
                  {columns.map((col) => {
                    const isVisible = !hiddenColumnKeys.includes(col.key);
                    return (
                      <li key={col.key} className="form-check px-3 py-1">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`col-toggle-${col.key}`}
                          checked={isVisible}
                          onChange={() => onToggleColumnVisibility(col.key)}
                        />
                        <label
                          htmlFor={`col-toggle-${col.key}`}
                          className="form-check-label small user-select-none text-dark ms-1"
                        >
                          {col.label}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Export Dropdown */}
            {(onExportCsv || onExportJson) && (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  title="Export Data"
                >
                  <span>📥</span>
                  <span className="d-none d-sm-inline">Export</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  {onExportCsv && (
                    <li>
                      <button className="dropdown-item small py-2 d-flex align-items-center gap-2" onClick={onExportCsv}>
                        <span>📄</span> Export to CSV
                      </button>
                    </li>
                  )}
                  {onExportJson && (
                    <li>
                      <button className="dropdown-item small py-2 d-flex align-items-center gap-2" onClick={onExportJson}>
                        <span>📜</span> Export to JSON
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Refresh Button */}
            {onRefresh && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onRefresh}
                title="Refresh Table"
                startIcon={<span>🔄</span>}
              />
            )}

            {/* Primary Action Slot */}
            {primaryAction}
          </div>
        </div>
      )}
    </div>
  );
}
