/**
 * Centralized Sidebar & Module Navigation Configuration
 * Supports RBAC permissions, nested sub-menus, search keywords, and badges.
 */

export const NAVIGATION_CONFIG = [
  {
    category: 'OVERVIEW',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: '📊',
        keywords: ['home', 'overview', 'metrics', 'analytics', 'telemetry'],
      },
    ],
  },
  {
    category: 'MANUFACTURING & SUPPLY',
    items: [
      {
        id: 'mdm',
        label: 'Master Data (MDM)',
        path: '/mdm',
        icon: '📦',
        badge: 'Core',
        badgeVariant: 'primary',
        keywords: ['materials', 'items', 'bom', 'vendors', 'products', 'sku'],
        children: [
          { label: 'Item Master', path: '/mdm/items', icon: '📄' },
          { label: 'Bills of Materials (BOM)', path: '/mdm/bom', icon: '📑' },
          { label: 'Suppliers & Vendors', path: '/mdm/vendors', icon: '🤝' },
        ],
      },
      {
        id: 'production',
        label: 'Production Orders',
        path: '/production',
        icon: '🏭',
        keywords: ['work orders', 'shop floor', 'operations', 'routing', 'schedule'],
        children: [
          { label: 'Work Orders', path: '/production/work-orders', icon: '📝' },
          { label: 'Routing & Centers', path: '/production/routings', icon: '🔄' },
          { label: 'Job Dispatching', path: '/production/dispatch', icon: '⚡' },
        ],
      },
      {
        id: 'inventory',
        label: 'Inventory Control',
        path: '/inventory',
        icon: '🏷️',
        keywords: ['stock', 'warehouse', 'lots', 'serials', 'bins', 'transfer'],
        children: [
          { label: 'Stock Valuation', path: '/inventory/stock', icon: '📈' },
          { label: 'Warehouse Bins', path: '/inventory/bins', icon: '🏢' },
          { label: 'Stock Transfers', path: '/inventory/transfers', icon: '🚚' },
        ],
      },
    ],
  },
  {
    category: 'FINANCE & CONTROL',
    items: [
      {
        id: 'finance',
        label: 'Financial Ledger',
        path: '/finance',
        icon: '💳',
        keywords: ['accounts', 'gl', 'ledger', 'journal', 'invoices', 'fiscal'],
        children: [
          { label: 'Chart of Accounts', path: '/finance/accounts', icon: '📋' },
          { label: 'Journal Entries', path: '/finance/journal', icon: '🖋️' },
          { label: 'Trial Balance', path: '/finance/trial-balance', icon: '⚖️' },
        ],
      },
    ],
  },
  {
    category: 'ADMINISTRATION',
    items: [
      {
        id: 'settings',
        label: 'System Settings',
        path: '/settings',
        icon: '⚙️',
        permission: 'settings:read',
        keywords: ['config', 'parameters', 'system', 'preferences', 'tenant'],
      },
    ],
  },
];

/**
 * Filter navigation items based on user RBAC permissions and roles
 */
export function getFilteredNavigation(hasPermission, hasRole) {
  return NAVIGATION_CONFIG.map((group) => {
    const filteredItems = group.items.filter((item) => {
      if (item.permission && hasPermission && !hasPermission(item.permission)) {
        return false;
      }
      if (item.role && hasRole && !hasRole(item.role)) {
        return false;
      }
      return true;
    });

    return {
      ...group,
      items: filteredItems,
    };
  }).filter((group) => group.items.length > 0);
}

/**
 * Search navigation menu items by search term across labels and keywords
 */
export function searchNavigation(menuGroups, query) {
  if (!query || !query.trim()) return menuGroups;
  const q = query.toLowerCase().trim();

  return menuGroups
    .map((group) => {
      const matchedItems = group.items.filter((item) => {
        const matchLabel = item.label.toLowerCase().includes(q);
        const matchKeywords = (item.keywords || []).some((kw) => kw.toLowerCase().includes(q));
        const matchChildren = (item.children || []).some((child) =>
          child.label.toLowerCase().includes(q)
        );
        return matchLabel || matchKeywords || matchChildren;
      });

      return {
        ...group,
        items: matchedItems,
      };
    })
    .filter((group) => group.items.length > 0);
}
