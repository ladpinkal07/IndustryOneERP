import React from 'react';

export default function DatePickerField({
  label,
  name,
  value,
  onChange,
  minDate = null,
  maxDate = null,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  id,
  ...rest
}) {
  const dateId = id || name || `date-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={dateId} className="form-label small fw-semibold text-dark mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="input-group">
        <span className="input-group-text bg-light-subtle text-muted small">📅</span>
        <input
          id={dateId}
          name={name}
          type="date"
          min={minDate}
          max={maxDate}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          {...rest}
        />
      </div>

      {error ? (
        <div className="invalid-feedback d-block small mt-1">{error}</div>
      ) : helperText ? (
        <div className="form-text small text-muted mt-1">{helperText}</div>
      ) : null}
    </div>
  );
}
