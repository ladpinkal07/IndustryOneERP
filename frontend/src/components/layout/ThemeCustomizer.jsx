import React from 'react';
import Drawer from '../common/Drawer';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useTheme, ACCENT_PALETTES, DENSITY_PRESETS } from '../../context/ThemeContext';

export default function ThemeCustomizer() {
  const {
    mode,
    accent,
    density,
    setMode,
    setAccent,
    setDensity,
    resetDefaults,
    isCustomizerOpen,
    closeCustomizer,
  } = useTheme();

  return (
    <Drawer
      isOpen={isCustomizerOpen}
      onClose={closeCustomizer}
      title="UI Theme & Appearance"
      subtitle="Customize ERP interface display preferences"
      icon="🎨"
      size="sm"
      footer={
        <div className="d-flex justify-content-between align-items-center w-100">
          <Button variant="outline-secondary" size="sm" onClick={resetDefaults}>
            Reset Defaults
          </Button>
          <Button variant="primary" size="sm" onClick={closeCustomizer}>
            Done
          </Button>
        </div>
      }
    >
      <div className="d-flex flex-column gap-4">
        {/* 1. Color Scheme Mode */}
        <div>
          <label className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-2">
            Theme Mode
          </label>
          <div className="row g-2">
            {[
              { id: 'light', label: 'Light', icon: '☀️' },
              { id: 'dark', label: 'Dark', icon: '🌙' },
              { id: 'system', label: 'System', icon: '💻' },
            ].map((item) => (
              <div key={item.id} className="col-4">
                <button
                  type="button"
                  className={`btn btn-sm w-100 p-2 d-flex flex-column align-items-center gap-1 border ${
                    mode === item.id ? 'btn-primary text-white border-primary shadow-sm' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setMode(item.id)}
                >
                  <span className="fs-5">{item.icon}</span>
                  <span className="small fw-semibold">{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Brand Accent Palette */}
        <div>
          <label className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-2">
            Accent Palette
          </label>
          <div className="d-flex flex-column gap-2">
            {Object.entries(ACCENT_PALETTES).map(([key, palette]) => {
              const isSelected = accent === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`btn btn-sm text-start p-2 d-flex align-items-center justify-content-between border ${
                    isSelected ? 'border-primary bg-primary-subtle' : 'bg-light-subtle'
                  }`}
                  onClick={() => setAccent(key)}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle shadow-sm"
                      style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor: palette.primary,
                        display: 'inline-block',
                      }}
                    />
                    <span className="small fw-semibold text-dark">{palette.name}</span>
                  </div>
                  {isSelected && <Badge variant="primary" pill>Active</Badge>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Layout Density */}
        <div>
          <label className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-2">
            Layout Density
          </label>
          <div className="d-flex flex-column gap-2">
            {Object.entries(DENSITY_PRESETS).map(([key, item]) => {
              const isSelected = density === key;
              return (
                <div
                  key={key}
                  className={`p-2 border rounded cursor-pointer ${
                    isSelected ? 'border-primary bg-primary-subtle' : 'bg-light-subtle'
                  }`}
                  onClick={() => setDensity(key)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-semibold text-dark">{item.name}</span>
                    {isSelected && <Badge variant="primary" pill>Selected</Badge>}
                  </div>
                  <div className="text-muted small" style={{ fontSize: '11px' }}>
                    Table Row Spacing: {item.tablePadding}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
