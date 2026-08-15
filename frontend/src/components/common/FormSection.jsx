import React from 'react';

export default function FormSection({
  title,
  subtitle,
  icon,
  children,
  action = null,
  className = '',
}) {
  return (
    <div className={`card shadow-sm border mb-4 ${className}`}>
      {(title || subtitle || action) && (
        <div className="card-header bg-transparent py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <div className="d-flex align-items-center gap-2">
            {icon && <span className="fs-5">{icon}</span>}
            <div>
              {title && <h6 className="fw-bold text-dark mb-0">{title}</h6>}
              {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="card-body p-4">{children}</div>
    </div>
  );
}
