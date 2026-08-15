import React from 'react';
import Skeleton from './Skeleton';

export default function CardSkeleton({ className = '' }) {
  return (
    <div className={`card shadow-sm border p-4 ${className}`}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="flex-grow-1 me-3">
          <Skeleton variant="text" width="60%" height="14px" className="mb-2" />
          <Skeleton variant="text" width="80%" height="28px" />
        </div>
        <Skeleton variant="circular" width="42px" height="42px" />
      </div>
      <div className="pt-2 border-top">
        <Skeleton variant="text" width="40%" height="12px" />
      </div>
    </div>
  );
}
