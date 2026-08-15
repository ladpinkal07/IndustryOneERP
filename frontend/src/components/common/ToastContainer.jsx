import React from 'react';
import ToastItem from './ToastItem';

const PLACEMENT_STYLES = {
  'top-right': { top: '20px', right: '20px' },
  'top-left': { top: '20px', left: '20px' },
  'bottom-right': { bottom: '20px', right: '20px' },
  'bottom-left': { bottom: '20px', left: '20px' },
  'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
};

export default function ToastContainer({
  toasts = [],
  onDismiss,
  placement = 'top-right',
}) {
  if (toasts.length === 0) return null;

  const positionStyle = PLACEMENT_STYLES[placement] || PLACEMENT_STYLES['top-right'];

  return (
    <div
      className="toast-container position-fixed d-flex flex-column gap-2"
      style={{
        zIndex: 1080,
        pointerEvents: 'none',
        ...positionStyle,
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  );
}
