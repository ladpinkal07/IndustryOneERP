import React from 'react';

export default function RadioGroupField({
  label,
  name,
  value,
  onChange,
  options = [],
  inline = false,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <div className="form-label small fw-semibold text-dark mb-2">
          {label} {required && <span className="text-danger">*</span>}
        </div>
      )}

      <div className={`d-flex ${inline ? 'flex-row flex-wrap gap-4' : 'flex-column gap-2'}`}>
        {options.map((opt) => {
          const isObj = typeof opt === 'object' && opt !== null;
          const optVal = isObj ? opt.value : opt;
          const optLabel = isObj ? opt.label : opt;
          const optDesc = isObj ? opt.description : null;
          const radioId = `radio-${name}-${optVal}`;
          const isChecked = String(value) === String(optVal);

          return (
            <div key={optVal} className="form-check">
              <input
                id={radioId}
                name={name}
                type="radio"
                value={optVal}
                checked={isChecked}
                onChange={onChange}
                disabled={disabled}
                className={`form-check-input ${error ? 'is-invalid' : ''}`}
              />
              <label htmlFor={radioId} className="form-check-label small text-dark user-select-none">
                <span className="fw-medium">{optLabel}</span>
                {optDesc && <div className="text-muted small mt-0.5">{optDesc}</div>}
              </label>
            </div>
          );
        })}
      </div>

      {error ? (
        <div className="invalid-feedback d-block small mt-1">{error}</div>
      ) : helperText ? (
        <div className="form-text small text-muted mt-1">{helperText}</div>
      ) : null}
    </div>
  );
}
