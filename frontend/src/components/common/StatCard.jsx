import React from 'react';
import Badge from './Badge';
import Skeleton from './Skeleton';

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend = null, // { value: '+12.5%', isPositive: true }
  variant = 'primary',
  className = '',
  loading = false,
}) {
  if (loading) {
    return (
      <div className={`card shadow-sm h-100 p-3 ${className}`}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Skeleton variant="text" width="50%" height="14px" />
          <Skeleton variant="circular" width="36px" height="36px" />
        </div>
        <Skeleton variant="text" width="70%" height="28px" className="my-2" />
        <Skeleton variant="text" width="40%" height="12px" className="mt-auto" />
      </div>
    );
  }

  return (
    <div className={`card shadow-sm h-100 p-3 ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <span
            className={`badge bg-${variant}-subtle text-${variant} rounded-circle p-2 fs-6`}
            style={{ width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="h3 fw-bold text-dark mb-1">{value}</div>

      {(subtitle || trend) && (
        <div className="d-flex align-items-center gap-2 mt-auto pt-1 small text-muted">
          {trend && (
            <Badge variant={trend.isPositive ? 'success' : 'danger'} pill className="small">
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </Badge>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
