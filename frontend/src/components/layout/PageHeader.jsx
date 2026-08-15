import React from 'react';
import Breadcrumbs from './Breadcrumbs';

export default function PageHeader({
  title,
  subtitle,
  icon,
  badge,
  actions,
  customCrumbs,
}) {
  return (
    <div className="page-header mb-4">
      <div className="mb-2">
        <Breadcrumbs customCrumbs={customCrumbs} />
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          {icon && <div className="fs-2">{icon}</div>}
          <div>
            <div className="d-flex align-items-center gap-2">
              <h1 className="h3 fw-bold mb-0 text-dark">{title}</h1>
              {badge && <span className="ms-2">{badge}</span>}
            </div>
            {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="d-flex align-items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
