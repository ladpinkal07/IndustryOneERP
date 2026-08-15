import React from 'react';

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search records...',
  size = 'sm',
  className = '',
  autoFocus = false,
}) {
  const sizeClass = size === 'sm' ? 'input-group-sm' : size === 'lg' ? 'input-group-lg' : '';

  return (
    <div className={`input-group ${sizeClass} ${className}`}>
      <span className="input-group-text bg-transparent border-end-0 text-muted">🔍</span>
      <input
        type="text"
        className="form-control border-start-0 border-end-0 bg-transparent ps-1"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        aria-label="Search"
      />
      {value ? (
        <button
          type="button"
          className="btn btn-outline-secondary border-start-0 border text-muted"
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : (
        <span className="input-group-text bg-transparent border-start-0"></span>
      )}
    </div>
  );
}
