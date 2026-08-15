import React from 'react';

export default function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength = null,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  id,
  ...rest
}) {
  const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const currentLength = value ? String(value).length : 0;

  return (
    <div className={`mb-3 ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        {label && (
          <label htmlFor={textareaId} className="form-label small fw-semibold text-dark mb-0">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="small text-muted">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        maxLength={maxLength}
        value={value !== undefined && value !== null ? value : ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...rest}
      />

      {error ? (
        <div className="invalid-feedback d-block small mt-1">{error}</div>
      ) : helperText ? (
        <div className="form-text small text-muted mt-1">{helperText}</div>
      ) : null}
    </div>
  );
}
