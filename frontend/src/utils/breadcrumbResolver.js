import { NAVIGATION_CONFIG } from '../config/navigation';
import { formatEnumLabel } from './formatters';

/**
 * Builds a path lookup map from NAVIGATION_CONFIG
 */
function buildRouteMap() {
  const map = {};
  NAVIGATION_CONFIG.forEach((group) => {
    group.items.forEach((item) => {
      map[item.path] = {
        label: item.label,
        icon: item.icon,
        category: group.category,
      };
      if (item.children) {
        item.children.forEach((child) => {
          map[child.path] = {
            label: child.label,
            icon: child.icon,
            parentPath: item.path,
            parentLabel: item.label,
            category: group.category,
          };
        });
      }
    });
  });
  return map;
}

const ROUTE_MAP = buildRouteMap();

/**
 * Resolves a URL path into an array of breadcrumb objects
 */
export function resolveBreadcrumbs(pathname) {
  if (!pathname || pathname === '/') {
    return [];
  }

  const cleanPath = pathname.split('?')[0];
  const segments = cleanPath.split('/').filter(Boolean);
  const crumbs = [];

  let accumulatedPath = '';
  segments.forEach((seg, idx) => {
    accumulatedPath += `/${seg}`;
    const isLast = idx === segments.length - 1;
    const matchedRoute = ROUTE_MAP[accumulatedPath];

    if (matchedRoute) {
      crumbs.push({
        label: matchedRoute.label,
        href: isLast ? null : accumulatedPath,
        icon: matchedRoute.icon,
      });
    } else {
      crumbs.push({
        label: formatEnumLabel(seg),
        href: isLast ? null : accumulatedPath,
      });
    }
  });

  return crumbs;
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD structured data
 */
export function generateBreadcrumbJsonLd(crumbs, baseUrl = 'https://industryone-erp.internal') {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Dashboard',
      item: `${baseUrl}/`,
    },
  ];

  crumbs.forEach((crumb, index) => {
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: crumb.label,
      ...(crumb.href ? { item: `${baseUrl}${crumb.href}` } : {}),
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}
