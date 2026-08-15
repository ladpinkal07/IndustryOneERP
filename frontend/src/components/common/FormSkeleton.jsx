import React from 'react';
import Skeleton from './Skeleton';

export default function FormSkeleton({ fields = 4, className = '' }) {
  return (
    <div className={`card shadow-sm border p-4 ${className}`}>
      <div className="mb-4 pb-2 border-bottom">
        <Skeleton variant="text" width="40%" height="20px" className="mb-1" />
        <Skeleton variant="text" width="60%" height="14px" />
      </div>

      <div className="d-flex flex-column gap-3">
        {Array.from({ length: fields }).map((_, idx) => (
          <div key={idx}>
            <Skeleton variant="text" width="30%" height="14px" className="mb-1" />
            <Skeleton variant="rounded" width="100%" height="38px" />
          </div>
        ))}

        <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-2">
          <Skeleton variant="rounded" width="80px" height="34px" />
          <Skeleton variant="rounded" width="110px" height="34px" />
        </div>
      </div>
    </div>
  );
}
