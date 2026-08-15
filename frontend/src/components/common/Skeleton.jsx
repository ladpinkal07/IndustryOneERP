import React from 'react';

export default function Skeleton({
  variant = 'text', // 'text' | 'circular' | 'rectangular' | 'rounded'
  width = '100%',
  height = null,
  animation = 'wave', // 'wave' | 'pulse' | 'none'
  className = '',
  style = {},
}) {
  const getDefaultHeight = () => {
    if (height) return height;
    if (variant === 'text') return '1rem';
    if (variant === 'circular') return width || '40px';
    if (variant === 'rounded' || variant === 'rectangular') return '100px';
    return '1rem';
  };

  const getBorderRadius = () => {
    if (variant === 'circular') return '50%';
    if (variant === 'rounded') return '8px';
    if (variant === 'text') return '4px';
    return '0px';
  };

  const computedHeight = getDefaultHeight();
  const computedWidth = variant === 'circular' && !width ? computedHeight : width;

  return (
    <div
      className={`erp-skeleton erp-skeleton-${animation} ${className}`}
      style={{
        width: computedWidth,
        height: computedHeight,
        borderRadius: getBorderRadius(),
        display: variant === 'text' ? 'inline-block' : 'block',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
