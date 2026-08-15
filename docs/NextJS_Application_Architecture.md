# Enterprise ERP: Next.js Application Architecture

This document defines the client-side architecture, directory structure, custom hooks, reusable components, and API service patterns for the Next.js React frontend.

---

## 1. Directory Structure

```text
frontend/src/
├── components/
│   ├── common/             # Atomic, reusable UI elements
│   │   ├── Badge.jsx       # Status and label badge component
│   │   ├── ErrorBoundary.jsx # Client error boundary container
│   │   ├── LoadingSpinner.jsx # Activity indicator
│   │   └── Pagination.jsx  # Paginated data table navigation
│   └── layout/             # Application shell and navigation
│       ├── Header.jsx      # Top bar with tenant/user badges
│       ├── Layout.jsx      # Master layout container
│       └── Sidebar.jsx     # Navigation sidebar
├── context/                # Global React context state providers
│   └── AuthContext.js      # Multi-tenant auth & branch state
├── hooks/                  # Custom reusable React hooks
│   ├── useApi.js           # Async API execution with loading/error state
│   ├── useDebounce.js      # Input debounce for search & filters
│   └── usePagination.js    # Client-side pagination state controller
├── pages/                  # Next.js Pages router endpoints
│   ├── _app.js             # Root application wrapper with ErrorBoundary
│   ├── _document.js        # HTML shell with Inter typography
│   ├── 404.js              # Custom Not Found error page
│   ├── 500.js              # Custom Server Error page
│   └── index.js            # Main dashboard
├── services/               # HTTP client & API service endpoints
│   ├── apiClient.js        # Axios instance with auth/tenant interceptors
│   └── settingsService.js  # Settings CRUD & advanced search client
├── styles/                 # Global styles and design system variables
│   ├── custom.css          # Theme overrides & layout rules
│   └── variables.css       # Design tokens & color palettes
└── utils/                  # Utility functions and constant maps
    ├── constants.js        # Routes, storage keys, and config values
    ├── errorHandler.js     # API envelope error parsing
    └── formatters.js       # Currency, date, time, and number formatters
```

---

## 2. Core Architectural Patterns

### 1. Multi-Tenant Context Propagation (`apiClient.js`)
All outbound HTTP requests automatically inject the active JWT authorization and tenant isolation header:
- `Authorization: Bearer <token>`
- `X-Tenant-ID: <active_tenant_id>`

### 2. Error Boundary & Error Normalization
- Root component tree is protected by `ErrorBoundary` in `_app.js`.
- API error responses (from backend `APIErrorResponse` envelopes) are normalized through `extractErrorMessage(error)` to present readable validation details.

### 3. Custom Hooks
| Hook | Description |
| :--- | :--- |
| `useApi(apiFunc, options)` | Manages `loading`, `error`, `data`, and execution lifecycle for any promise-based service call. |
| `usePagination(initialPage, pageSize)` | Maintains page numbers, limits, total counts, and next/previous page navigation. |
| `useDebounce(value, delay)` | Debounces rapid input changes before triggering filter or search queries. |

### 4. Service Layer (`services/`)
Separates UI components from API details. Components interact strictly with service modules:

```javascript
import settingsService from '../services/settingsService';

// List settings with pagination & filters
const response = await settingsService.listSettings({
  page: 1,
  page_size: 20,
  search: 'tax',
  category: 'FINANCE'
});

// Advanced operator-based search
const searchResults = await settingsService.searchSettings({
  criteria: [{ field: 'category', operator: 'eq', value: 'FINANCE' }],
  page: 1,
  page_size: 20
});
```

---

## 3. Production Build & Deployment

- Framework: **Next.js 14.x (Pages Router)**
- Styling: **Bootstrap 5.3 + Vanilla CSS design tokens**
- Typography: **Google Fonts (Inter)**
- Production Build: `npm run build`
- Dev Server: `npm run dev` (Port 3000)
