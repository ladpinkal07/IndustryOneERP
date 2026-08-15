# Enterprise ERP: Responsive Design System Architecture

This document defines the 6-tier viewport breakpoint hierarchy, reactive breakpoint hook (`useBreakpoint`), conditional visibility components (`ShowOn`, `HideOn`), mobile touch target optimizations, and ERP print stylesheet standards.

---

## 1. Breakpoint Grid Tiers

| Tier | Prefix | Viewport Range | Target Devices & Form Factors |
| :--- | :--- | :--- | :--- |
| **Extra Small** | `xs` | `< 576px` | Mobile phones in portrait mode. |
| **Small** | `sm` | `576px – 767px` | Large phones & phablets in landscape. |
| **Medium** | `md` | `768px – 991px` | Tablets in portrait (iPad, Galaxy Tab). |
| **Large** | `lg` | `992px – 1199px` | Tablet landscape & laptops. |
| **Extra Large** | `xl` | `1200px – 1399px` | Desktop monitors (1080p). |
| **Extra Extra Large** | `xxl` | `≥ 1400px` | Ultrawide, 2K, and 4K displays. |

---

## 2. Reactive Breakpoint Hook (`useBreakpoint`)

```javascript
import { useBreakpoint } from '@/hooks';

export default function MyResponsiveView() {
  const { isMobile, isTablet, isDesktop, breakpoint, windowWidth } = useBreakpoint();

  return (
    <div>
      {isMobile ? <MobileCardView /> : <FullDataTable />}
    </div>
  );
}
```

### Hook Return Values
| Property | Type | Description |
| :--- | :--- | :--- |
| `breakpoint` | `string` | Active breakpoint name (`'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'`). |
| `isMobile` | `boolean` | `true` when viewport width is `< 768px`. |
| `isTablet` | `boolean` | `true` when viewport width is between `768px` and `991px`. |
| `isDesktop` | `boolean` | `true` when viewport width is `≥ 992px`. |
| `isWide` | `boolean` | `true` when viewport width is `≥ 1200px`. |
| `windowWidth` | `number` | Real-time viewport width in pixels. |
| `windowHeight` | `number` | Real-time viewport height in pixels. |

---

## 3. Declarative Conditional Components (`ShowOn`, `HideOn`)

```jsx
import { ShowOn, HideOn } from '@/components/common';

// Render elements conditionally by device class
<ShowOn at="mobile">
  <button className="btn btn-primary w-100">Mobile Quick Action</button>
</ShowOn>

<HideOn at="mobile">
  <DataTableToolbar columns={columns} />
</HideOn>
```

---

## 4. Mobile & Print Adaptations

- **Touch Target Sizing**: All interactive inputs, buttons, and select dropdowns maintain a minimum height of `40px` on mobile viewports.
- **Side Drawers**: Automatically expand to full width (`100vw`) on screens `< 576px`.
- **Print Optimization (`@media print`)**: Hides sidebars, headers, footers, toolbars, and floating toast elements while enforcing black-and-white print-safe table borders for invoice vouchers, work orders, and BOM printouts.
