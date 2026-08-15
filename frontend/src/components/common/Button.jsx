import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  startIcon = null,
  endIcon = null,
  className = '',
  onClick,
  ...rest
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = variant.startsWith('outline-') ? `btn-${variant}` : `btn-${variant}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className} d-inline-flex align-items-center justify-content-center gap-2`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span>{children || 'Loading...'}</span>
        </>
      ) : (
        <>
          {startIcon && <span className="d-inline-flex align-items-center">{startIcon}</span>}
          {children && <span>{children}</span>}
          {endIcon && <span className="d-inline-flex align-items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
}
