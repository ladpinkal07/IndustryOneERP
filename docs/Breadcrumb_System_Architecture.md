# Enterprise ERP: Breadcrumb System Architecture

This document defines the automated path-based route resolution, custom crumb overrides, React Context state management, and Schema.org JSON-LD structured data generation for the ERP breadcrumb navigation system.

---

## 1. Breadcrumb Architecture Flow

```mermaid
graph TD
    Router[Next.js Router: router.pathname] --> Resolver[breadcrumbResolver.js]
    NavConfig[config/navigation.js Route Index] --> Resolver
    Resolver --> AutoCrumbs[Auto-Resolved Route Breadcrumbs]
    
    Page[Active Page Component] -->|Optional setBreadcrumbs()| Context[BreadcrumbContext / useBreadcrumbs]
    Context --> CustomCrumbs[Dynamic Custom Crumb Trail]
    
    AutoCrumbs --> PriorityCheck{Custom Crumbs Present?}
    CustomCrumbs --> PriorityCheck
    
    PriorityCheck -->|Yes| ActiveCrumbs[Render Custom Crumbs]
    PriorityCheck -->|No| ActiveCrumbs[Render Auto-Resolved Crumbs]
    
    ActiveCrumbs --> UI[Breadcrumbs.jsx UI Component]
    ActiveCrumbs --> JSONLD[Schema.org BreadcrumbList JSON-LD Script]
```

---

## 2. Dynamic Route Resolution (`utils/breadcrumbResolver.js`)

- Builds an in-memory route lookup table from `config/navigation.js` matching full paths and sub-item routes.
- Automatically extracts category headers, parent module names, and module icons.
- If a route segment is not in navigation config (e.g. dynamic IDs), it formats the segment with `formatEnumLabel()`.

---

## 3. Dynamic Breadcrumb Injection (`useBreadcrumbs()`)

For nested entity screens (such as viewing a specific item `/mdm/items/item_123` or editing a setting), child pages can dynamically set human-readable breadcrumbs:

```jsx
import { useEffect } from 'react';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

export default function ItemDetailPage({ item }) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Master Data (MDM)', href: '/mdm', icon: '📦' },
      { label: 'Item Master', href: '/mdm/items', icon: '📄' },
      { label: `${item.sku} - ${item.name}` },
    ]);
    return () => resetBreadcrumbs();
  }, [item, setBreadcrumbs, resetBreadcrumbs]);

  return <div>Item details content</div>;
}
```

---

## 4. Semantic SEO & Accessibility (Schema.org JSON-LD)

The `Breadcrumbs` component automatically embeds Schema.org structured metadata in `<Head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Dashboard",
      "item": "https://industryone-erp.internal/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Master Data (MDM)",
      "item": "https://industryone-erp.internal/mdm"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Item Master"
    }
  ]
}
```

---

## 5. UI Features & Truncation Handling

- **Deep Trail Truncation**: When navigation trails exceed `maxVisible` (default 4), intermediate crumbs collapse to `…` with tooltip hints.
- **Home Anchor**: Always provides quick return to `🏠 Dashboard`.
- **Accessible Markup**: Uses standard HTML5 `<nav aria-label="breadcrumb">` and `aria-current="page"`.
