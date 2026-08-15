export default function Badge({
  variant = 'secondary',
  children,
  pill = false,
  className = '',
}) {
  const pillClass = pill ? 'rounded-pill' : 'rounded';
  return (
    <span className={`badge bg-${variant} ${pillClass} ${className} px-2 py-1`}>
      {children}
    </span>
  );
}
