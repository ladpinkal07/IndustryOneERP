import React from 'react';

export default function SwitchField({
  label,
  name,
  checked = false,
  onChange,
  description,
  error,
  disabled = false,
  className = '',
  id,
  ...rest
}) {
  const switchId = id || name || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-check form-switch mb-3 ${className}`}>
      <input
        id={switchId}
        name={name}
        type="checkbox"
        role="switch"
        checked={!!checked}
        onChange={onChange}
        disabled={disabled}
        className={`form-check-input ${error ? 'is-invalid' : ''}`}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        {...rest}
      />
      <label
        htmlFor={switchId}
        className="form-check-label small fw-semibold text-dark user-select-none"
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {label}
      </label>
      {description && <div className="text-muted small mt-1">{description}</div>}
      {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
    </div>
  );
}
