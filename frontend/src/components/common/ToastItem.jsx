import React, { useEffect, useState } from 'react';

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  danger: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  primary: '🔔',
};

const TOAST_VARIANTS = {
  success: 'success',
  error: 'danger',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
  primary: 'primary',
};

export default function ToastItem({
  id,
  type = 'info',
  title = null,
  message,
  duration = 4000,
  onDismiss,
}) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (duration <= 0) return;

    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= step) {
            clearInterval(timer);
            onDismiss(id);
            return 0;
          }
          return prev - step;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [id, duration, isPaused, onDismiss]);

  const variant = TOAST_VARIANTS[type] || 'info';
  const icon = TOAST_ICONS[type] || 'ℹ️';

  return (
    <div
      className={`toast show border-0 shadow-lg mb-2 overflow-hidden bg-white`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        borderRadius: '10px',
        minWidth: '300px',
        maxWidth: '420px',
        animation: 'slideIn 0.2s ease forwards',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`d-flex align-items-start p-3 border-start border-4 border-${variant}`}>
        <span className="fs-5 me-3 lh-1">{icon}</span>

        <div className="flex-grow-1 me-2">
          {title && <div className="fw-bold small text-dark mb-0.5">{title}</div>}
          <div className="text-secondary small" style={{ wordBreak: 'break-word' }}>
            {message}
          </div>
        </div>

        <button
          type="button"
          className="btn-close btn-close-sm ms-auto"
          style={{ width: '8px', height: '8px' }}
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
        />
      </div>

      {/* Progress bar countdown indicator */}
      {duration > 0 && (
        <div
          className={`bg-${variant}`}
          style={{
            height: '3px',
            width: `${progress}%`,
            transition: 'width 50ms linear',
          }}
        />
      )}
    </div>
  );
}
