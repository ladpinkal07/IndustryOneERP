import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { APP_CONFIG } from '../../utils/constants';
import CommandPalette from './CommandPalette';
import NotificationDropdown from './NotificationDropdown';
import ThemeCustomizer from './ThemeCustomizer';

export default function Header({ onMobileSidebarToggle, isSidebarCollapsed, onToggleSidebar }) {
  const { user, activeTenantId, activeBranchId, switchTenant, switchBranch, logout } = useAuth();
  const { mode, toggleMode, openCustomizer } = useTheme();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Listen for Ctrl+K or Cmd+K global shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const displayName = user?.name || user?.username || 'System Administrator';
  const displayRole = user?.role || 'Enterprise Admin';

  return (
    <>
      <header className="navbar navbar-expand-lg border-bottom px-3 px-lg-4 py-2 bg-body-tertiary sticky-top">
        <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
          {/* Left: Brand & Sidebar Collapse Toggles */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
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
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small d-none d-sm-inline">
                v{APP_CONFIG.VERSION}
              </span>
            </Link>
          </div>

          {/* Center: Interactive Global Command Search Trigger */}
          <div
            className="d-none d-md-flex align-items-center mx-3 flex-grow-1"
            style={{ maxWidth: '420px', cursor: 'pointer' }}
            onClick={() => setIsCommandPaletteOpen(true)}
          >
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0 text-muted">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 border-end-0 bg-transparent"
                placeholder="Search modules, commands, settings..."
                readOnly
                style={{ cursor: 'pointer' }}
                aria-label="Search"
              />
              <span className="input-group-text bg-transparent border-start-0 text-muted small">
                <kbd className="bg-light border text-dark px-1" style={{ fontSize: '10px' }}>
                  Ctrl+K
                </kbd>
              </span>
            </div>
          </div>

          {/* Right: Tenant, Branch, Notifications, Theme, Profile */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* Quick Search trigger for mobile */}
            <button
              className="btn btn-sm btn-outline-secondary d-md-none border-0 rounded-circle p-2"
              onClick={() => setIsCommandPaletteOpen(true)}
              title="Search"
            >
              🔍
            </button>

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

            {/* Notification Center */}
            <NotificationDropdown />

            {/* Theme Customizer Trigger */}
            <button
              className="btn btn-sm btn-outline-secondary border-0 rounded-circle p-2"
              onClick={openCustomizer}
              title="Customize Theme & Appearance"
              aria-label="Theme Customizer"
            >
              🎨
            </button>

            {/* Dark / Light Theme Quick Toggle */}
            <button
              className="btn btn-sm btn-outline-secondary border-0 rounded-circle p-2"
              onClick={toggleMode}
              title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle color theme"
            >
              {mode === 'dark' ? '🌙' : '☀️'}
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
                  <Link href="/settings" className="dropdown-item small py-2">
                    System Settings
                  </Link>
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

      {/* Global Command Palette Search Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Theme Customizer Drawer */}
      <ThemeCustomizer />
    </>
  );
}
