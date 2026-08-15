# Enterprise ERP: Loading & Skeleton System Architecture

This document defines the skeleton loading primitives, composite layouts (`TableSkeleton`, `CardSkeleton`, `FormSkeleton`, `PageSkeleton`), shimmer animation keyframes, and zero Cumulative Layout Shift (CLS) design principles for the ERP frontend.

---

## 1. Zero Cumulative Layout Shift (CLS) Principle

Visual skeleton loaders reserve physical screen dimensions prior to asynchronous payload resolution, eliminating layout jumps and boosting perceived performance:

```mermaid
graph TD
    Mount[Component Mounts] --> Fetch[Initiate Async Data Query]
    Fetch --> ShowSkeleton[Render Skeleton Placeholder (Fixed Dimensions)]
    ShowSkeleton --> Shimmer[Animated CSS Shimmer Gradient]
    Fetch -->|Data Arrives| Populate[Populate Real Data Seamlessly]
```

---

## 2. Component Catalog Reference

### 1. `Skeleton.jsx` (Core Primitive)
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `string` | `'text'` | Visual shape: `'text'`, `'circular'`, `'rectangular'`, or `'rounded'`. |
| `width` | `string` / `number` | `'100%'` | Width of the placeholder element. |
| `height` | `string` / `number` | `null` | Explicit height (auto-calculated per variant if omitted). |
| `animation` | `string` | `'wave'` | Animation style: `'wave'`, `'pulse'`, or `'none'`. |

### 2. Composite Layout Skeletons

| Component | Path | Description |
| :--- | :--- | :--- |
| `TableSkeleton.jsx` | `components/common/` | Replicates `DataTable` structure with toolbar placeholders, header cells, customizable rows (`rows = 5`), and pagination footer. |
| `CardSkeleton.jsx` | `components/common/` | Replicates KPI metric cards (`StatCard`) with icon avatar, metric title, and value bar. |
| `FormSkeleton.jsx` | `components/common/` | Replicates structured multi-field form layouts with labels, input boxes, and action buttons. |
| `PageSkeleton.jsx` | `components/common/` | Full-page placeholder combining page header, 4-column KPI metric cards, and a data table skeleton. |

---

## 3. Usage Examples

```jsx
import { TableSkeleton, CardSkeleton, Skeleton } from '@/components/common';

// In Data Tables
if (loading && data.length === 0) {
  return <TableSkeleton rows={8} columns={6} />;
}

// In Individual Component Placeholders
<Skeleton variant="circular" width="48px" height="48px" />
<Skeleton variant="rounded" width="100%" height="40px" />
```
