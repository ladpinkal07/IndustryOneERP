# Enterprise ERP: Modal & Drawer System Architecture

This document defines the modal dialog, slide-out drawer, programmatic confirmation trigger, scroll locking, and accessibility patterns for the ERP user interface.

---

## 1. Architectural Model & Global Context

The system supports both declarative JSX rendering and global programmatic invocation via `ModalContext` (`useModal`):

```mermaid
graph TD
    App[App Tree / Components] --> useModal[useModal Hook / Context]
    useModal -->|openModal(Component, props)| ModalRenderer[Global Modal Renderer]
    useModal -->|openDrawer(Component, props)| DrawerRenderer[Global Drawer Renderer]
    useModal -->|confirm(options)| ConfirmRenderer[Global ConfirmDialog Renderer]
    
    ModalRenderer --> Modal[Modal.jsx Component]
    DrawerRenderer --> Drawer[Drawer.jsx Component]
    ConfirmRenderer --> ConfirmDialog[ConfirmDialog.jsx Component]
```

---

## 2. Component Reference

### 1. Slide-Out Drawer (`Drawer.jsx`)
Used for quick inspection, master record sub-views, and creation forms without navigating away from data tables:
- **Placement**: `right` (default) or `left`.
- **Sizes**: `sm` (`360px`), `md` (`480px`), `lg` (`640px`), `xl` (`820px`), `full` (`100vw`).
- **Features**: Smooth CSS slide transition, scroll locking on `document.body`, customizable header, scrollable body, and action footer.

### 2. Modal Dialog (`Modal.jsx`)
Used for wizard steps, complex entity editors, and structured forms:
- **Sizes**: `sm`, `md`, `lg`, `xl`, and responsive `fullscreen` modes (`true`, `sm-down`, `md-down`).
- **Features**: Header icon & subtitle slots, scrollable body (`scrollable = true`), backdrop dismiss, `ESC` keyboard capture, and scroll locking.

### 3. Confirmation Dialog (`ConfirmDialog.jsx`)
Specialized alert dialog for destructive or irreversible actions (e.g. Delete, Void, Reset):
- Configurable variants (`danger`, `warning`, `primary`), async loading spinner on confirm, and cancel action.

---

## 3. Programmatic Invocation API (`useModal`)

```jsx
import { useModal } from '@/hooks';

export default function TransactionView() {
  const { confirm, openDrawer, openModal } = useModal();

  const handleDelete = () => {
    confirm({
      title: 'Delete Ledger Account?',
      message: 'This will permanently remove account 1010-CASH. Continue?',
      confirmText: 'Delete Account',
      confirmVariant: 'danger',
      onConfirm: async () => {
        await financeService.deleteAccount('1010-CASH');
      },
    });
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```
