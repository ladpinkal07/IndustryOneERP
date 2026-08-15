import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { APP_CONFIG } from '../../utils/constants';

export default function Footer() {
  const { activeTenantId, activeBranchId } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer border-top py-3 px-4 bg-body-tertiary">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-muted">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold text-dark">{APP_CONFIG.NAME}</span>
          <span>v{APP_CONFIG.VERSION}</span>
          <span className="text-secondary">&bull;</span>
          <span>&copy; {currentYear} IndustryOne Enterprise. All rights reserved.</span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="d-flex align-items-center gap-1">
            <span className="badge bg-success rounded-circle p-1" style={{ width: '8px', height: '8px' }}></span>
            <span>Connected</span>
          </span>
          <span className="text-secondary">&bull;</span>
          <span>
            Tenant: <strong className="text-dark">{activeTenantId || 'demo-corp'}</strong>
            {activeBranchId && ` (${activeBranchId})`}
          </span>
        </div>
      </div>
    </footer>
  );
}
