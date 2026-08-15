import React, { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = 'md',
  backdrop = true,
  closeOnEsc = true,
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

  if (!isOpen) return null;

  const sizeClass = size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : size === 'xl' ? 'modal-xl' : '';

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1055 }}
        onClick={backdrop ? onClose : undefined}
      >
        <div
          className={`modal-dialog modal-dialog-centered ${sizeClass}`}
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
            {/* Header */}
            <div className="modal-header border-bottom py-3 px-4">
              <h5 className="modal-title fw-bold text-dark">{title}</h5>
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
