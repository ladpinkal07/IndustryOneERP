# Enterprise ERP: Sidebar Navigation System Architecture

This document defines the declarative navigation model, role-based access control (RBAC) filtering, accordion sub-menus, search indexing, and state management for the ERP sidebar.

---

## 1. Declarative Navigation Schema (`config/navigation.js`)

Navigation menus are declared centrally with full metadata for modules, nested sub-items, permissions, badges, and search keywords:

```javascript
export const NAVIGATION_CONFIG = [
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
      // ...
    ],
  },
];
```

---

## 2. Key Capabilities

### 1. RBAC & Permission Filtering
- Menu items declare optional `permission: 'settings:read'` or `role: 'admin'`.
- `getFilteredNavigation(hasPermission, hasRole)` filters items against active user permissions before rendering.
- Hidden modules cannot be seen by unauthorized users in the sidebar tree.

### 2. Multi-Level Accordion Sub-Menus
- Parent modules with `children` render an expandable accordion.
- Active routes automatically expand the parent category.
- Sub-item links highlight when active.

### 3. Quick Keyword Search
- An embedded search bar filters menus and keywords in real-time.
- Supports indexing across module titles, child links, and ERP keyword synonyms (e.g. searching *"sku"* highlights *Master Data*).

### 4. Responsive Modes
- **Expanded Desktop (`260px`)**: Displays category headings, search input, labels, badges, and status footer.
- **Collapsed Desktop (`72px`)**: Compact icon-only view with module tooltips.
- **Mobile Offcanvas (`280px`)**: Slide-out overlay with drawer backdrop and close triggers.

---

## 3. Component Reference

| Module | Location | Purpose |
| :--- | :--- | :--- |
| `navigation.js` | `src/config/navigation.js` | Centralized schema, RBAC filter helper, and search engine. |
| `Sidebar.jsx` | `src/components/layout/Sidebar.jsx` | Reactive navigation UI with accordion submenus and search filtering. |
| `AuthContext.js` | `src/context/AuthContext.js` | Exposes `hasPermission()` and `hasRole()` for authorization gates. |
