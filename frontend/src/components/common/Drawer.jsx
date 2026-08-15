import React, { useEffect } from 'react';

const DRAWER_WIDTHS = {
  sm: '360px',
  md: '480px',
  lg: '640px',
  xl: '820px',
  full: '100vw',
};

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle = null,
  icon = null,
  children,
  footer = null,
  placement = 'right', // 'right' | 'left'
  size = 'md',        // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  backdrop = true,
  closeOnEsc = true,
  className = '',
}) {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const width = DRAWER_WIDTHS[size] || DRAWER_WIDTHS.md;
  const isRight = placement === 'right';

  return (
    <>
      {/* Backdrop */}
      {backdrop && (
        <div
          className="modal-backdrop fade show"
          style={{
            zIndex: 1060,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)',
          }}
          onClick={onClose}
        />
      )}

      {/* Drawer Container Panel */}
      <div
        className={`drawer-panel position-fixed top-0 ${isRight ? 'end-0' : 'start-0'} h-100 bg-white shadow-lg d-flex flex-column z-3 ${className}`}
        style={{
          width: width,
          maxWidth: '100vw',
          zIndex: 1065,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="drawer-header border-bottom py-3 px-4 d-flex justify-content-between align-items-center bg-body-tertiary">
          <div className="d-flex align-items-center gap-2">
            {icon && <span className="fs-5">{icon}</span>}
            <div>
              <h5 className="modal-title fw-bold text-dark mb-0">{title}</h5>
              {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close drawer"
          />
        </div>

        {/* Scrollable Body */}
        <div className="drawer-body p-4 flex-grow-1 overflow-y-auto">
          {children}
        </div>

        {/* Action Footer */}
        {footer && (
          <div className="drawer-footer border-top py-3 px-4 bg-body-tertiary d-flex justify-content-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
