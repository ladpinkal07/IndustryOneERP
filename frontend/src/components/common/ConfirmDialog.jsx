import React from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This operation cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
  icon = '⚠️',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="d-flex align-items-start gap-3">
        {icon && <div className="fs-3">{icon}</div>}
        <div className="small text-muted">{message}</div>
      </div>
    </Modal>
  );
}
