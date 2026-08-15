import React from 'react';

export default function NumberField({
  label,
  name,
  value,
  onChange,
  min = null,
  max = null,
  step = '1',
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  prefix = null,
  suffix = null,
  className = '',
  id,
  ...rest
}) {
  const inputId = id || name || `number-${Math.random().toString(36).substr(2, 9)}`;

  const handleNumericChange = (e) => {
    const val = e.target.value;
    onChange(val === '' ? '' : Number(val));
  };

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label small fw-semibold text-dark mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="input-group">
        {prefix && <span className="input-group-text bg-light-subtle text-muted small">{prefix}</span>}
        <input
          id={inputId}
          name={name}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value !== undefined && value !== null ? value : ''}
          onChange={handleNumericChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          {...rest}
        />
        {suffix && <span className="input-group-text bg-light-subtle text-muted small">{suffix}</span>}
      </div>

      {error ? (
        <div className="invalid-feedback d-block small mt-1">{error}</div>
      ) : helperText ? (
        <div className="form-text small text-muted mt-1">{helperText}</div>
      ) : null}
    </div>
  );
}
