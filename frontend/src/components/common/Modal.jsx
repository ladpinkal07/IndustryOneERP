import React, { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle = null,
  icon = null,
  children,
  footer = null,
  size = 'md',
  backdrop = true,
  closeOnEsc = true,
  scrollable = true,
  fullscreen = false,
  className = '',
}) {
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

  // Lock body scroll
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

  const sizeClass = size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : size === 'xl' ? 'modal-xl' : '';
  const fullscreenClass = fullscreen === true ? 'modal-fullscreen' : fullscreen ? `modal-fullscreen-${fullscreen}` : '';

  return (
    <>
      <div
        className={`modal fade show d-block ${className}`}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1055 }}
        onClick={backdrop ? onClose : undefined}
      >
        <div
          className={`modal-dialog modal-dialog-centered ${sizeClass} ${fullscreenClass} ${
            scrollable ? 'modal-dialog-scrollable' : ''
          }`}
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
            {/* Header */}
            <div className="modal-header border-bottom py-3 px-4 d-flex justify-content-between align-items-center bg-body-tertiary">
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
                aria-label="Close modal"
              />
            </div>

            {/* Body */}
            <div className="modal-body p-4">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="modal-footer border-top py-2 px-4 bg-body-tertiary">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {backdrop && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1050, backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
      )}
    </>
  );
}
