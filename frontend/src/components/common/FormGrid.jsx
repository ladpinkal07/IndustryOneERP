import React from 'react';

export default function FormGrid({
  children,
  cols = 2, // 1, 2, 3, 4
  gap = 3,
  className = '',
}) {
  return (
    <div className={`row g-${gap} ${className}`}>
      {React.Children.map(children, (child) => {
        if (!child) return null;

        // If the child specifies its own colSpan or colClass, respect it
        const colClass =
          child.props && child.props.colSpan
            ? `col-12 col-md-${Math.min(12, child.props.colSpan * (12 / cols))}`
            : cols === 1
            ? 'col-12'
            : cols === 2
            ? 'col-12 col-md-6'
            : cols === 3
            ? 'col-12 col-md-6 col-lg-4'
            : 'col-12 col-sm-6 col-lg-3';

        return <div className={colClass}>{child}</div>;
      })}
    </div>
  );
}
