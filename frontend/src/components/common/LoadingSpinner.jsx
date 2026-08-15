export default function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  fullPage = false,
}) {
  const spinnerSizeClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'p-3' : '';

  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center gap-2 py-4">
      <div className={`spinner-border text-primary ${spinnerSizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <div className="text-secondary small fw-medium">{message}</div>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75 z-3"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {content}
      </div>
    );
  }

  return content;
}
