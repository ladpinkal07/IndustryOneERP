# Enterprise ERP: Reusable UI Component Library Architecture

This document defines the atomic, responsive, accessible UI component library built for the ERP Next.js frontend.

---

## 1. Component Library Directory & Barrel Export

All components reside in `frontend/src/components/common/` and are exposed via a central barrel export `index.js`:

```javascript
import {
  Button,
  DataTable,
  Modal,
  ConfirmDialog,
  StatCard,
  InputField,
  SelectField,
  SearchInput,
  Alert,
  Badge,
  LoadingSpinner,
  Pagination,
  ErrorBoundary
} from '@/components/common';
```

---

## 2. Component Catalog Reference

### 1. Data Display & Analytics

| Component | Props | Description |
| :--- | :--- | :--- |
| `DataTable.jsx` | `columns`, `data`, `loading`, `sortBy`, `sortOrder`, `onSort`, `selectable`, `selectedIds`, `onSelectRow`, `onSelectAll`, `onRowClick`, `emptyMessage` | Advanced responsive data table with sortable columns, checkboxes, custom cell renderers, and loading overlay. |
| `StatCard.jsx` | `title`, `value`, `subtitle`, `icon`, `trend` (`{ value, isPositive }`), `variant`, `loading` | Metric and KPI card with percentage trend indicator, icon badge, and skeleton loading state. |
| `Badge.jsx` | `variant`, `pill`, `children` | Status badge indicator for statuses, permissions, and entity labels. |

### 2. Form Controls & Inputs

| Component | Props | Description |
| :--- | :--- | :--- |
| `Button.jsx` | `variant`, `size`, `type`, `loading`, `disabled`, `startIcon`, `endIcon`, `onClick` | Action button with embedded spinner state, icon slots, and outline variants. |
| `InputField.jsx` | `label`, `name`, `type`, `value`, `onChange`, `error`, `helperText`, `required`, `startAddon`, `endAddon` | Form text input with label, addon slots, required indicator, and validation error messages. |
| `SelectField.jsx` | `label`, `name`, `value`, `onChange`, `options` (array of primitives or `{ value, label }`), `placeholder`, `error` | Form dropdown select with option normalization and validation feedback. |
| `SearchInput.jsx` | `value`, `onChange`, `onClear`, `placeholder`, `size`, `autoFocus` | Quick search input with leading search icon and instant clear button. |

### 3. Feedback & Overlays

| Component | Props | Description |
| :--- | :--- | :--- |
| `Modal.jsx` | `isOpen`, `onClose`, `title`, `children`, `footer`, `size` (`sm`/`md`/`lg`/`xl`), `backdrop`, `closeOnEsc` | Accessible modal dialog with backdrop, `ESC` keyboard dismissal, and flexible action footers. |
| `ConfirmDialog.jsx` | `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText`, `confirmVariant`, `loading`, `icon` | Confirmation modal for destructive actions (Delete, Void, Post) with danger styling. |
| `Alert.jsx` | `variant` (`info`/`success`/`warning`/`danger`), `title`, `children`, `icon`, `customIcon`, `dismissible`, `onDismiss` | Alert notification banner with severity icons and dismiss action. |
| `LoadingSpinner.jsx` | `size` (`sm`/`md`/`lg`), `message`, `fullPage` | Activity spinner with optional full-screen glassmorphism backdrop. |
| `ErrorBoundary.jsx` | `children`, `fallback`, `onReset` | React class Error Boundary capturing rendering crashes safely with recovery trigger. |

---

## 3. Usage Example: Data Management View

```jsx
import { useState } from 'react';
import { DataTable, Button, SearchInput, Modal, ConfirmDialog, StatCard } from '../components/common';

export default function MaterialsList() {
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const columns = [
    { key: 'sku', label: 'SKU / Part #', sortable: true },
    { key: 'name', label: 'Item Description', sortable: true },
    { key: 'stock', label: 'On Hand', align: 'right', render: (val) => <strong>{val}</strong> },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <SearchInput value={search} onChange={setSearch} />
        <Button variant="primary" startIcon={<span>➕</span>}>New Item</Button>
      </div>

      <DataTable
        columns={columns}
        data={[{ id: 1, sku: 'SKU-1001', name: 'Alloy Valve', stock: 120 }]}
        selectable
      />

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {/* delete */}}
        title="Delete Item"
        message="Are you sure you want to delete this part number?"
      />
    </div>
  );
}
```
