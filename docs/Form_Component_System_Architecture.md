# Enterprise ERP: Form Component System Architecture

This document defines the schema validation rules, form state lifecycle (`useForm`), responsive layout grids, and specialized input controls for transactional data entry across the ERP application.

---

## 1. Form Lifecycle & State Management (`useForm`)

The `useForm` hook encapsulates form values, schema validation, touch tracking, dirty state detection, and async submission handling:

```javascript
import { useForm } from '@/hooks';

const form = useForm({
  initialValues: {
    sku: '',
    unit_cost: 0,
    category: 'RAW_MATERIAL',
    is_active: true,
  },
  validationRules: {
    sku: {
      required: 'SKU is required',
      minLength: 3,
      pattern: { regex: /^[A-Z0-9-]+$/, message: 'Alphanumeric and hyphens only' },
    },
    unit_cost: {
      required: 'Cost is required',
      min: 0,
    },
  },
  onSubmit: async (values) => {
    await itemsService.createItem(values);
  },
});
```

### Hook State & Methods Reference
| Attribute / Method | Type | Description |
| :--- | :--- | :--- |
| `values` | `object` | Current key-value form state. |
| `errors` | `object` | Validation error messages mapped by field name. |
| `touched` | `object` | Boolean flags indicating fields blurred by the user. |
| `isDirty` | `boolean` | Flag indicating whether any field was modified from `initialValues`. |
| `isSubmitting` | `boolean` | Async execution state indicator during `onSubmit`. |
| `handleChange` | `function` | Event/direct value handler updating state & revalidating if touched. |
| `handleBlur` | `function` | On-blur event handler marking field as touched and validating. |
| `handleSubmit` | `function` | Form submission handler validating all fields before calling `onSubmit`. |
| `resetForm` | `function` | Reverts form state to initial values, clearing errors and dirty status. |

---

## 2. Form Layout & Grid Components

| Component | Props | Description |
| :--- | :--- | :--- |
| `FormSection.jsx` | `title`, `subtitle`, `icon`, `action`, `children` | Card-based grouping container for related form fields. |
| `FormGrid.jsx` | `cols` (`1`, `2`, `3`, `4`), `gap`, `children` | Responsive grid row distributing child fields cleanly across breakpoints. |

---

## 3. Specialized Form Input Controls

| Component | Path | Key Props | Description |
| :--- | :--- | :--- | :--- |
| `InputField.jsx` | `components/common/` | `label`, `name`, `type`, `startAddon`, `endAddon`, `required`, `error` | Standard text, email, password input with addons. |
| `SelectField.jsx` | `components/common/` | `label`, `name`, `options` (`[]` or `[{value, label}]`), `placeholder` | Dropdown select with normalized options. |
| `TextareaField.jsx` | `components/common/` | `label`, `name`, `rows`, `maxLength`, `error` | Multiline text area with character counter. |
| `CheckboxField.jsx` | `components/common/` | `label`, `name`, `checked`, `description` | Standard checkbox with subtext description. |
| `SwitchField.jsx` | `components/common/` | `label`, `name`, `checked`, `description` | Toggle switch for boolean configurations. |
| `RadioGroupField.jsx` | `components/common/` | `label`, `name`, `options`, `inline`, `error` | Group of radio buttons with optional descriptions. |
| `NumberField.jsx` | `components/common/` | `label`, `name`, `min`, `max`, `step`, `prefix`, `suffix` | Numeric field with bounds and currency/unit prefixes. |
| `DatePickerField.jsx` | `components/common/` | `label`, `name`, `minDate`, `maxDate` | Native date picker with calendar addon. |

---

## 4. Live Production Reference: System Settings (`pages/settings.js`)

The `/settings` view demonstrates full bidirectional integration:
1. Real-time form validation for `setting_key`, `setting_value`, and `category`.
2. Asynchronous upsert submission to FastAPI `/api/v1/settings`.
3. Instant update of the paginated `DataTable` with search and pagination controls.
