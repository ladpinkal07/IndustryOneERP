import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatEnumLabel } from '../../utils/formatters';

const ROUTE_LABELS = {
  '': 'Home',
  'mdm': 'Master Data Management',
  'production': 'Production & Work Orders',
  'inventory': 'Inventory Control',
  'finance': 'Financial Ledger',
  'settings': 'System Settings',
  'audit': 'Audit Trail',
  'users': 'User Management',
};

export default function Breadcrumbs({ customCrumbs = null }) {
  const router = useRouter();

  if (customCrumbs) {
    return (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-0 small">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none text-muted">
              🏠 Dashboard
            </Link>
          </li>
          {customCrumbs.map((crumb, idx) => {
            const isLast = idx === customCrumbs.length - 1;
            return (
              <li
                key={idx}
                className={`breadcrumb-item ${isLast ? 'active text-primary fw-medium' : ''}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {isLast || !crumb.href ? (
                  crumb.label
                ) : (
                  <Link href={crumb.href} className="text-decoration-none text-muted">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  const pathSegments = router.asPath.split('?')[0].split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0 small">
        <li className="breadcrumb-item">
          <Link href="/" className="text-decoration-none text-muted">
            🏠 Dashboard
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const label = ROUTE_LABELS[segment] || formatEnumLabel(segment);

          return (
            <li
              key={href}
              className={`breadcrumb-item ${isLast ? 'active text-primary fw-medium' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? (
                label
              ) : (
                <Link href={href} className="text-decoration-none text-muted">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
