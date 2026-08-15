import React from 'react';
import Button from './Button';

const PRESET_CONFIGS = {
  'no-data': {
    icon: '📂',
    title: 'No records available',
    description: 'No data exists in this view yet. Start by creating a new entry.',
  },
  'no-search-results': {
    icon: '🔍',
    title: 'No matching records found',
    description: 'Try adjusting your search criteria, clearing filters, or checking for typos.',
  },
  'no-access': {
    icon: '🔒',
    title: 'Access Restricted',
    description: 'You do not have the required permissions to view this dataset in the current tenant scope.',
  },
  'network-error': {
    icon: '📡',
    title: 'Unable to connect to server',
    description: 'There was a problem reaching the ERP backend service. Please check your network connection.',
  },
};

export default function EmptyState({
  preset = null, // 'no-data' | 'no-search-results' | 'no-access' | 'network-error'
  icon = null,
  title = null,
  description = null,
  actionText = null,
  onAction = null,
  actionIcon = null,
  secondaryActionText = null,
  onSecondaryAction = null,
  children = null,
  compact = false,
  className = '',
}) {
  const presetConfig = preset ? PRESET_CONFIGS[preset] || {} : {};

  const resolvedIcon = icon || presetConfig.icon || '📂';
  const resolvedTitle = title || presetConfig.title || 'No data found';
  const resolvedDescription = description || presetConfig.description || 'There are no items to display at this time.';

  return (
    <div
      className={`empty-state text-center d-flex flex-column align-items-center justify-content-center ${
        compact ? 'py-4 px-3' : 'py-5 px-4'
      } ${className}`}
    >
      <div className={`${compact ? 'fs-2 mb-2' : 'display-5 mb-3'} opacity-75 user-select-none`}>
        {resolvedIcon}
      </div>

      <h5 className={`fw-bold text-dark mb-2 ${compact ? 'fs-6' : ''}`}>
        {resolvedTitle}
      </h5>

      <p
        className="text-muted small mb-3 mx-auto"
        style={{ maxWidth: compact ? '320px' : '420px', lineHeight: '1.5' }}
      >
        {resolvedDescription}
      </p>

      {(onAction || onSecondaryAction || children) && (
        <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
          {onAction && actionText && (
            <Button
              variant="primary"
              size={compact ? 'sm' : 'md'}
              onClick={onAction}
              startIcon={actionIcon ? <span>{actionIcon}</span> : null}
            >
              {actionText}
            </Button>
          )}

          {onSecondaryAction && secondaryActionText && (
            <Button
              variant="outline-secondary"
              size={compact ? 'sm' : 'md'}
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </Button>
          )}

          {children}
        </div>
      )}
    </div>
  );
}
