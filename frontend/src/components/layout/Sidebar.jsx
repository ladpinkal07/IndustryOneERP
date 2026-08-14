import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar({ isCollapsed, onToggle }) {
  const router = useRouter();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '🏠' },
    { label: 'Master Data (MDM)', path: '/mdm', icon: '📦' },
    { label: 'Production Work Orders', path: '/production', icon: '🏭' },
    { label: 'Inventory Control', path: '/inventory', icon: '📦' },
    { label: 'Financial Ledger', path: '/finance', icon: '📊' },
  ];

  return (
    <aside className={`sidebar d-flex flex-column p-3 ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        {!isCollapsed && <span className="fw-bold text-secondary">MAIN MENU</span>}
        <button className="btn btn-sm btn-outline-secondary border-0" onClick={onToggle}>
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <ul className="nav nav-pills flex-column gap-1">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.path;
          return (
            <li key={item.path} className="nav-item">
              <Link href={item.path} className={`nav-link d-flex align-items-center gap-3 py-2 ${isActive ? 'active' : ''}`}>
                <span className="fs-5">{item.icon}</span>
                {!isCollapsed && <span className="small fw-medium">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
