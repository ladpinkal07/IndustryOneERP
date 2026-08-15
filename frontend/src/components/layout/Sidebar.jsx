import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { getFilteredNavigation, searchNavigation } from '../../config/navigation';
import Badge from '../common/Badge';

export default function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }) {
  const router = useRouter();
  const { hasPermission, hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenus, setExpandedMenus] = useState({});

  // Get RBAC-filtered navigation
  const filteredNav = useMemo(() => {
    return getFilteredNavigation(hasPermission, hasRole);
  }, [hasPermission, hasRole]);

  // Apply search query filter
  const displayNav = useMemo(() => {
    return searchNavigation(filteredNav, searchQuery);
  }, [filteredNav, searchQuery]);

  // Auto-expand parent menus if a child route is active
  useEffect(() => {
    const currentPath = router.pathname;
    const initialExpanded = {};

    filteredNav.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) => currentPath === child.path || currentPath.startsWith(child.path + '/')
          );
          if (hasActiveChild || currentPath === item.path) {
            initialExpanded[item.id] = true;
          }
        }
      });
    });

    setExpandedMenus((prev) => ({ ...prev, ...initialExpanded }));
  }, [router.pathname, filteredNav]);

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="d-flex flex-column h-100 py-3">
      {/* Quick Search inside Sidebar (only when expanded) */}
      {(!isCollapsed || isMobile) && (
        <div className="px-3 mb-3">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-transparent border-end-0 text-muted px-2">🔍</span>
            <input
              type="text"
              className="form-control border-start-0 bg-transparent ps-0"
              placeholder="Filter menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter navigation"
            />
            {searchQuery && (
              <button
                className="btn btn-sm btn-link text-muted border-0 p-0 pe-2"
                onClick={() => setSearchQuery('')}
                aria-label="Clear filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation menu groups */}
      <div className="flex-grow-1 overflow-y-auto px-2 sidebar-scroll">
        {displayNav.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            No modules match &quot;{searchQuery}&quot;
          </div>
        ) : (
          displayNav.map((group, gIdx) => (
            <div key={group.category} className={gIdx > 0 ? 'mt-3 pt-2 border-top' : ''}>
              {(!isCollapsed || isMobile) && (
                <div
                  className="sidebar-heading px-3 mb-2 text-uppercase text-secondary fw-bold"
                  style={{ fontSize: '10px', letterSpacing: '0.8px' }}
                >
                  {group.category}
                </div>
              )}
              <ul className="nav nav-pills flex-column gap-1">
                {group.items.map((item) => {
                  const isParentActive =
                    router.pathname === item.path ||
                    (item.children && item.children.some((c) => router.pathname === c.path));
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = !!expandedMenus[item.id];

                  return (
                    <li key={item.id || item.path} className="nav-item">
                      {hasChildren && (!isCollapsed || isMobile) ? (
                        <div>
                          {/* Parent menu header with accordion expand toggle */}
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(item.id)}
                            className={`nav-link w-100 text-start d-flex align-items-center justify-content-between py-2 px-3 border-0 bg-transparent ${
                              isParentActive ? 'text-primary fw-semibold' : 'text-secondary'
                            }`}
                            aria-expanded={isExpanded}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <span className="fs-5 lh-1">{item.icon}</span>
                              <span className="small fw-medium">{item.label}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              {item.badge && (
                                <Badge variant={item.badgeVariant || 'primary'} pill className="small">
                                  {item.badge}
                                </Badge>
                              )}
                              <span
                                className="small text-muted transition-transform"
                                style={{
                                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.15s ease',
                                }}
                              >
                                ›
                              </span>
                            </div>
                          </button>

                          {/* Submenu Accordion Items */}
                          {isExpanded && (
                            <ul className="nav flex-column ps-4 py-1 gap-1 border-start ms-4 my-1">
                              {item.children.map((child) => {
                                const isChildActive = router.pathname === child.path;
                                return (
                                  <li key={child.path} className="nav-item">
                                    <Link
                                      href={child.path}
                                      onClick={onCloseMobile}
                                      className={`nav-link py-1 px-2 small rounded ${
                                        isChildActive
                                          ? 'active bg-primary text-white fw-semibold'
                                          : 'text-secondary'
                                      }`}
                                    >
                                      <span className="me-2">{child.icon}</span>
                                      <span>{child.label}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      ) : (
                        /* Direct link item */
                        <Link
                          href={item.path}
                          onClick={onCloseMobile}
                          className={`nav-link d-flex align-items-center justify-content-between py-2 px-3 ${
                            isParentActive ? 'active shadow-sm' : 'text-secondary'
                          }`}
                          title={isCollapsed && !isMobile ? item.label : undefined}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <span className="fs-5 lh-1">{item.icon}</span>
                            {(!isCollapsed || isMobile) && (
                              <span className="small fw-medium">{item.label}</span>
                            )}
                          </div>
                          {(!isCollapsed || isMobile) && item.badge && (
                            <Badge variant={item.badgeVariant || 'primary'} pill className="small">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Sidebar Footer Status */}
      {(!isCollapsed || isMobile) && (
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
        {renderSidebarContent(false)}
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
          <button
            type="button"
            className="btn-close"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          {renderSidebarContent(true)}
        </div>
      </div>
    </>
  );
}
