import React, { useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';
import { resolveBreadcrumbs, generateBreadcrumbJsonLd } from '../../utils/breadcrumbResolver';

export default function Breadcrumbs({ customCrumbs = null, maxVisible = 4 }) {
  const router = useRouter();
  const context = useBreadcrumbs();

  // Determine active crumbs: prop > context > auto-resolved
  const crumbs = useMemo(() => {
    if (customCrumbs && Array.isArray(customCrumbs)) {
      return customCrumbs;
    }
    if (context.customCrumbs && Array.isArray(context.customCrumbs)) {
      return context.customCrumbs;
    }
    return resolveBreadcrumbs(router.pathname);
  }, [customCrumbs, context.customCrumbs, router.pathname]);

  // Schema.org structured data
  const jsonLd = useMemo(() => {
    if (crumbs.length === 0) return null;
    return generateBreadcrumbJsonLd(crumbs);
  }, [crumbs]);

  if (crumbs.length === 0) {
    return null;
  }

  // Handle truncation if crumbs trail is very deep
  const renderCrumbsList = () => {
    if (crumbs.length <= maxVisible) {
      return crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <li
            key={crumb.label + idx}
            className={`breadcrumb-item ${isLast ? 'active text-primary fw-semibold' : ''}`}
            aria-current={isLast ? 'page' : undefined}
          >
            {isLast || !crumb.href ? (
              <span className="d-inline-flex align-items-center gap-1">
                {crumb.icon && <span className="small">{crumb.icon}</span>}
                <span>{crumb.label}</span>
              </span>
            ) : (
              <Link href={crumb.href} className="text-decoration-none text-muted d-inline-flex align-items-center gap-1">
                {crumb.icon && <span className="small">{crumb.icon}</span>}
                <span>{crumb.label}</span>
              </Link>
            )}
          </li>
        );
      });
    }

    // Truncate intermediate crumbs
    const firstCrumb = crumbs[0];
    const lastCrumbs = crumbs.slice(-2);

    return (
      <>
        <li className="breadcrumb-item">
          {firstCrumb.href ? (
            <Link href={firstCrumb.href} className="text-decoration-none text-muted">
              {firstCrumb.label}
            </Link>
          ) : (
            <span>{firstCrumb.label}</span>
          )}
        </li>
        <li className="breadcrumb-item text-muted" title="Intermediate navigation paths">
          <span>&hellip;</span>
        </li>
        {lastCrumbs.map((crumb, idx) => {
          const isLast = idx === lastCrumbs.length - 1;
          return (
            <li
              key={crumb.label + idx}
              className={`breadcrumb-item ${isLast ? 'active text-primary fw-semibold' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast || !crumb.href ? (
                <span>{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-decoration-none text-muted">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </>
    );
  };

  return (
    <>
      {jsonLd && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </Head>
      )}

      <nav aria-label="breadcrumb" className="breadcrumbs-wrapper py-1">
        <ol className="breadcrumb mb-0 small align-items-center">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1">
              <span>🏠</span>
              <span>Dashboard</span>
            </Link>
          </li>
          {renderCrumbsList()}
        </ol>
      </nav>
    </>
  );
}
