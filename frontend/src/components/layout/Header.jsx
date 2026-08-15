import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { APP_CONFIG } from '../../utils/constants';

export default function Header({ onMobileSidebarToggle, isSidebarCollapsed, onToggleSidebar }) {
  const { user, activeTenantId, activeBranchId, switchTenant, switchBranch, logout } = useAuth();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('app-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const displayName = user?.name || user?.username || 'System Administrator';
  const displayRole = user?.role || 'Enterprise Admin';

  return (
    <header className="navbar navbar-expand-lg border-bottom px-3 px-lg-4 py-2 bg-body-tertiary sticky-top">
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        {/* Left: Brand & Sidebar Collapse Toggle */}
        <div className="d-flex align-items-center gap-3">
          {/* Mobile hamburger toggle */}
          <button
            className="btn btn-sm btn-outline-secondary d-lg-none border-0 px-2"
            onClick={onMobileSidebarToggle}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="btn btn-sm btn-outline-secondary d-none d-lg-inline-block border-0 px-2 text-muted"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Collapse sidebar"
          >
            {isSidebarCollapsed ? '▶' : '◀'}
          </button>

          <Link href="/" className="text-decoration-none d-flex align-items-center gap-2">
            <span className="fs-4 fw-bold text-primary">{APP_CONFIG.NAME}</span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small">
              v{APP_CONFIG.VERSION}
            </span>
          </Link>
        </div>

        {/* Center: Global Quick Search */}
        <div className="d-none d-md-flex align-items-center mx-3 flex-grow-1" style={{ maxWidth: '380px' }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-transparent border-end-0 text-muted">🔍</span>
            <input
              type="text"
              className="form-control border-start-0 bg-transparent"
              placeholder="Search modules, records, settings... (Ctrl+K)"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right: Tenant, Branch, Notifications, Theme, Profile */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Organization / Tenant Switcher */}
          <div className="d-none d-sm-flex align-items-center gap-1">
            <select
              className="form-select form-select-sm text-truncate"
              style={{ maxWidth: '170px' }}
              value={activeTenantId || 'demo-corp'}
              onChange={(e) => switchTenant(e.target.value)}
              title="Active Multi-Tenant Organization"
            >
              <option value="demo-corp">🏢 Demo Corp (US)</option>
              <option value="multinat-corp">🌍 Global Mfg (EU)</option>
              <option value="apac-corp">🏭 APAC Plant (SG)</option>
            </select>
          </div>

          {/* Branch Switcher */}
          <div className="d-none d-md-flex align-items-center gap-1">
            <select
              className="form-select form-select-sm text-truncate"
              style={{ maxWidth: '130px' }}
              value={activeBranchId || 'main'}
              onChange={(e) => switchBranch(e.target.value)}
              title="Active Facility / Plant Branch"
            >
              <option value="main">📍 Plant 01</option>
              <option value="warehouse-a">📦 WH Central</option>
              <option value="rnd-lab">🧪 R&D Lab</option>
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary position-relative border-0 rounded-circle p-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Notifications"
            >
              🔔
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm py-2" style={{ minWidth: '280px' }}>
              <li className="dropdown-header fw-bold">Notifications</li>
              <li>
                <div className="dropdown-item small py-2">
                  <div className="fw-semibold">System Migration Complete</div>
                  <div className="text-muted">Alembic schema v1 applied</div>
                </div>
              </li>
              <li>
                <div className="dropdown-item small py-2">
                  <div className="fw-semibold">Health Ping Successful</div>
                  <div className="text-muted">Database connectivity verified</div>
                </div>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <a className="dropdown-item text-center small text-primary" href="#">
                  View all notifications
                </a>
              </li>
            </ul>
          </div>

          {/* Theme Switcher */}
          <button
            className="btn btn-sm btn-outline-secondary border-0 rounded-circle p-2"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Profile Menu */}
          <div className="dropdown">
            <button
              className="btn btn-sm btn-light border d-flex align-items-center gap-2 py-1 px-2 rounded-pill dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold small"
                style={{ width: '26px', height: '26px', fontSize: '12px' }}
              >
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="small fw-semibold d-none d-lg-inline text-truncate" style={{ maxWidth: '120px' }}>
                {displayName}
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li className="px-3 py-2 border-bottom">
                <div className="fw-bold small">{displayName}</div>
                <div className="text-muted small">{displayRole}</div>
              </li>
              <li>
                <Link href="/" className="dropdown-item small py-2">
                  Dashboard
                </Link>
              </li>
              <li>
                <a className="dropdown-item small py-2" href="#">
                  Security & Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider my-1" />
              </li>
              <li>
                <button className="dropdown-item small text-danger py-2" onClick={logout}>
                  🚪 Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
