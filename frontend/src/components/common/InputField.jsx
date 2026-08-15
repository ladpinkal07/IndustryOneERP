import React from 'react';

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  startAddon = null,
  endAddon = null,
  className = '',
  id,
  ...rest
}) {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label small fw-semibold text-dark mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="input-group">
        {startAddon && <span className="input-group-text bg-light-subtle text-muted small">{startAddon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value !== undefined && value !== null ? value : ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          {...rest}
        />
        {endAddon && <span className="input-group-text bg-light-subtle text-muted small">{endAddon}</span>}
      </div>

      {error ? (
        <div className="invalid-feedback d-block small mt-1">{error}</div>
      ) : helperText ? (
        <div className="form-text small text-muted mt-1">{helperText}</div>
      ) : null}
    </div>
  );
}
