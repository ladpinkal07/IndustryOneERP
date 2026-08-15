import React from 'react';

const ALERT_ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  danger: '⛔',
};

export default function Alert({
  variant = 'info',
  children,
  title = null,
  icon = true,
  customIcon = null,
  dismissible = false,
  onDismiss = null,
  className = '',
}) {
  const displayIcon = customIcon || (icon ? ALERT_ICONS[variant] || 'ℹ️' : null);

  return (
    <div
      className={`alert alert-${variant} border-0 shadow-sm d-flex align-items-start gap-2 ${
        dismissible ? 'alert-dismissible' : ''
      } ${className}`}
      role="alert"
    >
      {displayIcon && <span className="fs-5 lh-1 mt-1">{displayIcon}</span>}
      <div className="flex-grow-1">
        {title && <div className="fw-bold mb-1">{title}</div>}
        <div className="small">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="btn-close ms-auto"
          onClick={onDismiss}
          aria-label="Close alert"
        />
      )}
    </div>
  );
}
