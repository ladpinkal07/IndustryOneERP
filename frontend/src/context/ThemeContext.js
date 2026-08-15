import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ACCENT_PALETTES = {
  blue: {
    name: 'Enterprise Blue',
    primary: '#0d6efd',
    primaryHover: '#0b5ed7',
    primarySubtle: 'rgba(13, 110, 253, 0.1)',
  },
  indigo: {
    name: 'Royal Indigo',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primarySubtle: 'rgba(79, 70, 229, 0.1)',
  },
  emerald: {
    name: 'Manufacturing Green',
    primary: '#059669',
    primaryHover: '#047857',
    primarySubtle: 'rgba(5, 150, 105, 0.1)',
  },
  violet: {
    name: 'Deep Violet',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    primarySubtle: 'rgba(124, 58, 237, 0.1)',
  },
  amber: {
    name: 'Industrial Amber',
    primary: '#d97706',
    primaryHover: '#b45309',
    primarySubtle: 'rgba(217, 119, 6, 0.1)',
  },
};

export const DENSITY_PRESETS = {
  compact: {
    name: 'Compact (High Density)',
    tablePadding: '6px 10px',
    fontSize: '0.8125rem',
    btnPadding: '0.2rem 0.5rem',
  },
  comfortable: {
    name: 'Comfortable (Standard)',
    tablePadding: '10px 14px',
    fontSize: '0.875rem',
    btnPadding: '0.375rem 0.75rem',
  },
  spacious: {
    name: 'Spacious (Touch / Tablet)',
    tablePadding: '14px 18px',
    fontSize: '0.9375rem',
    btnPadding: '0.5rem 1rem',
  },
};

const STORAGE_KEY = 'industryone-ui-config';

const DEFAULT_CONFIG = {
  mode: 'light',          // 'light' | 'dark' | 'system'
  accent: 'blue',         // 'blue' | 'indigo' | 'emerald' | 'violet' | 'amber'
  density: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
  sidebarCollapsed: false,
};

export function ThemeProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Apply theme configuration to document DOM
  const applyThemeToDom = useCallback((uiConfig) => {
    if (typeof document === 'undefined') return;

    // Resolve system dark mode if mode === 'system'
    let effectiveMode = uiConfig.mode;
    if (effectiveMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveMode = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', effectiveMode);
    document.documentElement.setAttribute('data-density', uiConfig.density);

    // Apply primary accent color CSS variables
    const palette = ACCENT_PALETTES[uiConfig.accent] || ACCENT_PALETTES.blue;
    document.documentElement.style.setProperty('--primary-color', palette.primary);
    document.documentElement.style.setProperty('--primary-hover', palette.primaryHover);
    document.documentElement.style.setProperty('--primary-subtle', palette.primarySubtle);

    // Apply density tokens
    const density = DENSITY_PRESETS[uiConfig.density] || DENSITY_PRESETS.comfortable;
    document.documentElement.style.setProperty('--density-table-padding', density.tablePadding);
    document.documentElement.style.setProperty('--density-font-size', density.fontSize);
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...DEFAULT_CONFIG, ...parsed };
        setConfig(merged);
        applyThemeToDom(merged);
        return;
      }
    } catch {
      // fallback
    }
    applyThemeToDom(DEFAULT_CONFIG);
  }, [applyThemeToDom]);

  // Update theme mode
  const setMode = useCallback((mode) => {
    setConfig((prev) => {
      const next = { ...prev, mode };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyThemeToDom(next);
      return next;
    });
  }, [applyThemeToDom]);

  // Update accent color
  const setAccent = useCallback((accent) => {
    setConfig((prev) => {
      const next = { ...prev, accent };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyThemeToDom(next);
      return next;
    });
  }, [applyThemeToDom]);

  // Update density mode
  const setDensity = useCallback((density) => {
    setConfig((prev) => {
      const next = { ...prev, density };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyThemeToDom(next);
      return next;
    });
  }, [applyThemeToDom]);

  // Quick toggle mode (light <-> dark)
  const toggleMode = useCallback(() => {
    setMode(config.mode === 'light' ? 'dark' : 'light');
  }, [config.mode, setMode]);

  // Reset to system defaults
  const resetDefaults = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
    applyThemeToDom(DEFAULT_CONFIG);
  }, [applyThemeToDom]);

  const value = {
    mode: config.mode,
    accent: config.accent,
    density: config.density,
    sidebarCollapsed: config.sidebarCollapsed,
    setMode,
    setAccent,
    setDensity,
    toggleMode,
    resetDefaults,
    isCustomizerOpen,
    openCustomizer: () => setIsCustomizerOpen(true),
    closeCustomizer: () => setIsCustomizerOpen(false),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
