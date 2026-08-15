import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MENU_GROUPS = [
  {
    category: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/', icon: '📊' },
    ],
  },
  {
    category: 'MANUFACTURING & SUPPLY',
    items: [
      { label: 'Master Data (MDM)', path: '/mdm', icon: '📦' },
      { label: 'Production Orders', path: '/production', icon: '🏭' },
      { label: 'Inventory Control', path: '/inventory', icon: '🏷️' },
    ],
  },
  {
    category: 'FINANCE & CONTROL',
    items: [
      { label: 'Financial Ledger', path: '/finance', icon: '💳' },
    ],
  },
  {
    category: 'ADMINISTRATION',
    items: [
      { label: 'System Settings', path: '/settings', icon: '⚙️' },
    ],
  },
];

export default function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }) {
  const router = useRouter();

  const sidebarContent = (
    <div className="d-flex flex-column h-100 py-3">
      {/* Navigation menu items grouped by module category */}
      <div className="flex-grow-1 overflow-y-auto px-2">
        {MENU_GROUPS.map((group, gIdx) => (
          <div key={group.category} className={gIdx > 0 ? 'mt-3 pt-2 border-top' : ''}>
            {!isCollapsed && (
              <div className="sidebar-heading px-3 mb-2 text-uppercase text-secondary fw-bold" style={{ fontSize: '10px', letterSpacing: '0.8px' }}>
                {group.category}
              </div>
            )}
            <ul className="nav nav-pills flex-column gap-1">
              {group.items.map((item) => {
                const isActive = router.pathname === item.path;
                return (
                  <li key={item.path} className="nav-item">
                    <Link
                      href={item.path}
                      onClick={onCloseMobile}
                      className={`nav-link d-flex align-items-center gap-3 py-2 px-3 ${
                        isActive ? 'active shadow-sm' : 'text-secondary'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className="fs-5 lh-1">{item.icon}</span>
                      {!isCollapsed && <span className="small fw-medium">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Status */}
      {!isCollapsed && (
        <div className="px-3 pt-3 border-top mt-auto small text-muted d-flex align-items-center justify-content-between">
          <span>Mode: Multi-Tenant</span>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
            Live
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`sidebar d-none d-lg-block ${isCollapsed ? 'collapsed' : ''}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Offcanvas Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="modal-backdrop fade show d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Offcanvas Drawer */}
      <div
        className={`offcanvas offcanvas-start d-lg-none ${isMobileOpen ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: isMobileOpen ? 'visible' : 'hidden', zIndex: 1045, width: '280px' }}
      >
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title fw-bold text-primary">IndustryOne ERP</h5>
          <button type="button" className="btn-close" onClick={onCloseMobile} aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
