import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { activeTenantId, switchTenant, logout } = useAuth();
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

  return (
    <nav className="navbar navbar-expand-lg border-bottom px-4 py-2 bg-body-tertiary">
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4 fw-bold text-primary">IndustryOne ERP</span>
          <span className="badge bg-secondary ms-2">v1.0.0</span>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Active Tenant switcher dropdown */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-secondary fw-medium d-none d-sm-inline">Organization:</span>
            <select
              className="form-select form-select-sm"
              value={activeTenantId || 'demo-corp'}
              onChange={(e) => switchTenant(e.target.value)}
            >
              <option value="demo-corp">Demo Corp (US Branch)</option>
              <option value="multinat-corp">Multinational Dev (EU Branch)</option>
            </select>
          </div>

          {/* Theme switcher */}
          <button className="btn btn-sm btn-outline-secondary" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User actions */}
          <div className="dropdown">
            <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              👤 Profile
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li><a className="dropdown-item" href="#">Account Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger" onClick={logout}>Sign Out</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
