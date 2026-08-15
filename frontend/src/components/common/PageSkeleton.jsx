import React from 'react';
import Skeleton from './Skeleton';
import CardSkeleton from './CardSkeleton';
import TableSkeleton from './TableSkeleton';

export default function PageSkeleton({ className = '' }) {
  return (
    <div className={`page-skeleton-container ${className}`}>
      {/* Page Header Skeleton */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <Skeleton variant="text" width="220px" height="28px" className="mb-2" />
          <Skeleton variant="text" width="360px" height="16px" />
        </div>
        <div className="d-flex gap-2">
          <Skeleton variant="rounded" width="100px" height="38px" />
          <Skeleton variant="rounded" width="120px" height="38px" />
        </div>
      </div>

      {/* KPI Cards Row Skeleton */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <CardSkeleton />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <CardSkeleton />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <CardSkeleton />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <CardSkeleton />
        </div>
      </div>

      {/* Main Table Skeleton */}
      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}
