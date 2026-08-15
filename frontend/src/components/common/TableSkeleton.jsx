import React from 'react';
import Skeleton from './Skeleton';

export default function TableSkeleton({
  rows = 5,
  columns = 4,
  showToolbar = true,
  className = '',
}) {
  return (
    <div className={`table-skeleton-container ${className}`}>
      {/* Toolbar Skeleton */}
      {showToolbar && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Skeleton variant="rounded" width="240px" height="36px" />
          <div className="d-flex gap-2">
            <Skeleton variant="rounded" width="80px" height="36px" />
            <Skeleton variant="rounded" width="90px" height="36px" />
          </div>
        </div>
      )}

      {/* Table Shell */}
      <div className="table-responsive border rounded bg-white overflow-hidden">
        <table className="table table-hover erp-grid align-middle mb-0">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, cIdx) => (
                <th key={cIdx} style={{ padding: '12px 16px' }}>
                  <Skeleton variant="text" width={`${50 + (cIdx % 3) * 20}%`} height="14px" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx}>
                {Array.from({ length: columns }).map((_, cIdx) => (
                  <td key={cIdx} style={{ padding: '12px 16px' }}>
                    <Skeleton
                      variant="text"
                      width={`${60 + ((rIdx + cIdx) % 4) * 10}%`}
                      height="16px"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="d-flex justify-content-between align-items-center mt-3 px-1">
        <Skeleton variant="text" width="140px" height="14px" />
        <Skeleton variant="rounded" width="200px" height="32px" />
      </div>
    </div>
  );
}
