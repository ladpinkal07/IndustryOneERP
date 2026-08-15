/**
 * Error extraction and normalization utilities for API response envelopes
 */

export function extractErrorMessage(error, defaultMessage = 'An unexpected error occurred.') {
  if (!error) return defaultMessage;

  // If error is already a string
  if (typeof error === 'string') return error;

  // If backend returned standard APIErrorResponse envelope
  if (error.message) {
    if (error.meta && error.meta.errors && Array.isArray(error.meta.errors)) {
      const fieldErrors = error.meta.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join(', ');
      return `${error.message} (${fieldErrors})`;
    }
    return error.message;
  }

  // Axios response structure
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (data.message) return data.message;
    if (data.detail) return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
  }

  if (error.message) return error.message;

  return defaultMessage;
}
