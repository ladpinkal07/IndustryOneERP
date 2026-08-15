# Enterprise ERP: Theme & UI Configuration System Architecture

This document defines the light/dark/system color mode engine, brand accent palette switching, table/card layout density scaling, DOM token injection, and user preference persistence.

---

## 1. System Architecture Overview

```mermaid
graph TD
    User[User / System Preference] --> ThemeContext[ThemeContext (useTheme)]
    ThemeContext --> Storage[localStorage: industryone-ui-config]
    ThemeContext --> DOM[DOM Token Injection: data-theme, data-density, CSS Variables]
    
    DOM --> CSSVars[CSS Variables: --primary-color, --primary-hover, --primary-subtle, --density-table-padding]
    DOM --> Components[Components: Header, Sidebar, Cards, Forms, DataTables, Drawers]
    
    Header[Header.jsx] -->|🎨 Palette Trigger| Drawer[ThemeCustomizer.jsx Drawer]
    Drawer --> ThemeContext
```

---

## 2. Configuration Options & Presets

### 1. Theme Modes
- **`light`**: High-contrast, clean enterprise theme.
- **`dark`**: Dark navy theme (`#0b0f19` background, `#151b2a` cards).
- **`system`**: Automatically follows OS color scheme via `matchMedia('(prefers-color-scheme: dark)')`.

### 2. Brand Accent Color Palettes
| Key | Name | Primary Hex | Hover Hex |
| :--- | :--- | :--- | :--- |
| `blue` | Enterprise Blue (Default) | `#0d6efd` | `#0b5ed7` |
| `indigo` | Royal Indigo | `#4f46e5` | `#4338ca` |
| `emerald` | Manufacturing Green | `#059669` | `#047857` |
| `violet` | Deep Violet | `#7c3aed` | `#6d28d9` |
| `amber` | Industrial Amber | `#d97706` | `#b45309` |

### 3. Layout Density Modes
| Density | Target Users | Table Padding | Font Size |
| :--- | :--- | :--- | :--- |
| `compact` | Power users, accountants, data entry specialists | `6px 10px` | `0.8125rem` |
| `comfortable` | Default operational workflows | `10px 14px` | `0.875rem` |
| `spacious` | Touchscreens, tablets, kiosks | `14px 18px` | `0.9375rem` |

---

## 3. Hook API Reference (`useTheme`)

```javascript
import { useTheme } from '@/hooks';

export default function MyComponent() {
  const {
    mode,          // 'light' | 'dark' | 'system'
    accent,        // 'blue' | 'indigo' | 'emerald' | 'violet' | 'amber'
    density,       // 'compact' | 'comfortable' | 'spacious'
    setMode,       // (mode) => void
    setAccent,     // (accent) => void
    setDensity,    // (density) => void
    toggleMode,    // () => void
    resetDefaults, // () => void
    openCustomizer // () => void
  } = useTheme();

  return <button onClick={toggleMode}>Toggle Theme ({mode})</button>;
}
```
