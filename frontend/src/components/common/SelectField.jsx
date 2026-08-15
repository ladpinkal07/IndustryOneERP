import React from 'react';

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  id,
  ...rest
}) {
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label small fw-semibold text-dark mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        value={value !== undefined && value !== null ? value : ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const isObj = typeof opt === 'object' && opt !== null;
          const optValue = isObj ? opt.value : opt;
          const optLabel = isObj ? opt.label : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>

      {error ? (
        <div className="invalid-feedback d-block small mt-1">{error}</div>
      ) : helperText ? (
        <div className="form-text small text-muted mt-1">{helperText}</div>
      ) : null}
    </div>
  );
}
