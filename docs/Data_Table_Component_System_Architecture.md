# Enterprise ERP: Data Table Component System Architecture

This document defines the schema, sorting, search, selection, expandable detail rows, column customization, export capabilities, and hook lifecycle (`useDataTable`) for the ERP Data Table system.

---

## 1. Architecture Flow & Lifecycle (`useDataTable`)

```mermaid
graph TD
    UserAction[User: Search / Sort / Page / Select] --> Hook[useDataTable Hook]
    Hook --> Params[Bundles { page, page_size, search, sort_by, sort_order, filters }]
    Params --> Service[API Service e.g. settingsService.listSettings]
    Service --> Backend[FastAPI Pagination & Filtering Engine]
    Backend --> Envelope[APIResponse Envelope: data + ResponseMetadata]
    Envelope --> Hook
    Hook --> Table[DataTable Component]
    Hook --> Toolbar[DataTableToolbar Component]
    Hook --> Pagination[Pagination Component]
```

---

## 2. Component Reference

### 1. `DataTable.jsx`
Main table container supporting:
- **Sortable Columns**: Clickable header cells that toggle `asc` / `desc` sorting indicators.
- **Row Selection**: Checkboxes with header "Select All" (including indeterminate state).
- **Expandable Rows**: Nested accordion row detail view (`expandedRowRender`).
- **Sticky Headers**: Fixed header row when scrolling large datasets (`stickyHeader`).
- **Loading Overlay**: Glassmorphism activity overlay during async data fetches.

### 2. `DataTableToolbar.jsx`
Integrated action bar featuring:
- Debounced search box.
- Bulk selection counter and bulk action button triggers.
- Column visibility toggler dropdown (checkbox list).
- CSV and JSON file exports (`exportTableToCsv`, `exportTableToJson`).
- Refresh data button.

### 3. `useDataTable.js` (Hook API)
| Method / State | Type | Description |
| :--- | :--- | :--- |
| `data` | `Array` | Active page records array. |
| `loading` | `boolean` | Loading indicator state. |
| `search` / `setSearch` | `string` / `func` | Quick search term (debounced at 300ms). |
| `sortBy` / `sortOrder` | `string` | Active sort column and direction (`asc`/`desc`). |
| `handleSort` | `function` | Column sort trigger function. |
| `selectedIds` | `Array` | Array of currently selected row keys/IDs. |
| `handleSelectRow` | `function` | Select/deselect a specific row. |
| `handleSelectAll` | `function` | Select/deselect all visible rows. |
| `clearSelection` | `function` | Deselects all chosen rows. |
| `visibleColumns` | `Array` | Array of column objects excluding hidden columns. |
| `toggleColumnVisibility` | `function` | Shows or hides a specific column by key. |
| `exportCsv(filename)` | `function` | Triggers download of visible rows as a `.csv` file. |
| `exportJson(filename)` | `function` | Triggers download of visible rows as a `.json` file. |
| `refetch` | `function` | Re-executes the data query. |

---

## 3. Column Definition Schema

```javascript
const columns = [
  {
    key: 'setting_key',
    label: 'Setting Key',
    sortable: true,
    width: '25%',
    align: 'left', // 'left' | 'center' | 'right'
    render: (val, row) => <code>{val}</code>,
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (val) => <Badge variant="secondary">{val}</Badge>,
  },
];
```
