import React from 'react';

export default function CheckboxField({
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
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-check mb-3 ${className}`}>
      <input
        id={checkboxId}
        name={name}
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        disabled={disabled}
        className={`form-check-input ${error ? 'is-invalid' : ''}`}
        {...rest}
      />
      <label htmlFor={checkboxId} className="form-check-label small fw-semibold text-dark user-select-none">
        {label}
      </label>
      {description && <div className="text-muted small mt-1">{description}</div>}
      {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
    </div>
  );
}
