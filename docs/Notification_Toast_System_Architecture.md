# Enterprise ERP: Notification & Toast System Architecture

This document defines the floating toast notification engine, progress countdown animation, persistent notification center, and programmatic hook lifecycle (`useToast`, `useNotification`).

---

## 1. Notification Architecture Overview

```mermaid
graph TD
    Trigger[Component Action / API Response] --> useToast[useToast Hook]
    Trigger --> useNotification[useNotification Hook]
    
    useToast -->|toast.success / error / info| ToastQueue[Global Toast Queue]
    ToastQueue --> ToastContainer[ToastContainer (Position-Fixed Overlay)]
    ToastContainer --> ToastItem[ToastItem with Progress Animation]
    ToastItem -->|Auto-Dismiss Timer / Close Button| Dismiss[Dismiss Toast]

    useNotification -->|addNotification| NotifCenter[Persistent Notification Center]
    NotifCenter --> Bell[Header Notification Dropdown Bell]
    Bell --> UnreadBadge[Unread Counter & Dismiss Actions]
```

---

## 2. Toast Programmatic API (`useToast`)

```javascript
import { useToast } from '@/hooks';

export default function MyComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await apiCall();
      toast.success('Record updated successfully!', {
        title: 'Operation Complete',
        duration: 4000,
      });
    } catch (err) {
      toast.error('Failed to update record.', {
        title: 'Server Error',
        duration: 6000,
      });
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Toast Methods
| Method | Default Duration | Severity / Style | Description |
| :--- | :--- | :--- | :--- |
| `toast.success(msg, options)` | 4000ms | Green `✅` border | Positive confirmation of user/system actions. |
| `toast.error(msg, options)` | 5000ms | Red `❌` border | Error and validation failure alerts. |
| `toast.warning(msg, options)` | 4000ms | Amber `⚠️` border | Warning or cautionary messages. |
| `toast.info(msg, options)` | 4000ms | Blue `ℹ️` border | Neutral information or telemetry updates. |
| `toast.dismiss(id)` | Immediate | - | Manually dismisses a specific toast by ID. |
| `toast.setPlacement(pos)` | - | - | Changes toast container screen placement (`top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`). |

---

## 3. Toast Component Features

- **Progress Bar Countdown**: Real-time progress bar displaying remaining visibility time.
- **Hover Pause**: Hovering the cursor over any toast pauses the auto-dismiss timer.
- **Accessible & Non-Intrusive**: Positioned in fixed overlay with `pointer-events: none` on container and `pointer-events: auto` on items so users can continue interacting with the page.
- **Header Synchronization**: Persistent notifications remain accessible in the Top Navbar bell dropdown.
