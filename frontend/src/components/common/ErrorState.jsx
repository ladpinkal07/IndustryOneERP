import React, { useState } from 'react';
import Link from 'next/link';
import Button from './Button';
import Badge from './Badge';

export default function ErrorState({
  statusCode = 500,
  title = 'An unexpected system error occurred',
  message = 'The application encountered an error while processing your request. Please try again or contact support.',
  requestId = null,
  technicalDetails = null,
  onRetry = null,
  showHomeButton = true,
  className = '',
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyRequestId = () => {
    if (requestId) {
      navigator.clipboard.writeText(requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = () => {
    if (statusCode === 403) return <Badge variant="warning" pill>HTTP 403 — Forbidden</Badge>;
    if (statusCode === 404) return <Badge variant="secondary" pill>HTTP 404 — Not Found</Badge>;
    if (statusCode >= 500) return <Badge variant="danger" pill>HTTP {statusCode} — Server Error</Badge>;
    return <Badge variant="danger" pill>HTTP {statusCode}</Badge>;
  };

  const getStatusIcon = () => {
    if (statusCode === 403) return '🔒';
    if (statusCode === 404) return '🔍';
    if (statusCode >= 500) return '💥';
    return '⚠️';
  };

  return (
    <div className={`card border-0 shadow-sm p-4 p-md-5 text-center my-3 ${className}`}>
      <div className="mb-2">{getStatusBadge()}</div>

      <div className="display-4 mb-3 user-select-none opacity-75">{getStatusIcon()}</div>

      <h3 className="fw-bold text-dark mb-2">{title}</h3>

      <p className="text-muted fs-6 mb-4 mx-auto" style={{ maxWidth: '520px', lineHeight: '1.6' }}>
        {message}
      </p>

      {/* Request ID Traceability */}
      {requestId && (
        <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
          <span className="small text-muted">Request ID:</span>
          <code className="bg-light px-2 py-1 rounded small border">{requestId}</code>
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none p-0 text-secondary"
            onClick={copyRequestId}
            title="Copy Request ID for support logs"
          >
            {copied ? '✓ Copied' : '📋'}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-3">
        {onRetry && (
          <Button variant="primary" onClick={onRetry} startIcon={<span>🔄</span>}>
            Try Again
          </Button>
        )}

        {showHomeButton && (
          <Link href="/" className="btn btn-outline-secondary">
            Back to Dashboard
          </Link>
        )}

        {technicalDetails && (
          <Button
            variant="light"
            className="border"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? 'Hide Diagnostics' : 'Show Diagnostics'}
          </Button>
        )}
      </div>

      {/* Technical Diagnostics / Stack Trace Drawer */}
      {technicalDetails && showDetails && (
        <div className="mt-3 text-start bg-dark text-light p-3 rounded small font-monospace overflow-x-auto border">
          <div className="text-secondary mb-1 fw-bold">Stack Trace / Server Diagnostics:</div>
          <pre className="mb-0 text-white" style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {typeof technicalDetails === 'object'
              ? JSON.stringify(technicalDetails, null, 2)
              : String(technicalDetails)}
          </pre>
        </div>
      )}
    </div>
  );
}
