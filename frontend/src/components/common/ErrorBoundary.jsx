import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught a render crash:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="card border-danger border-opacity-25 bg-danger bg-opacity-10 p-4 my-3 text-center">
          <div className="fs-1 text-danger mb-2">⚠️</div>
          <h5 className="fw-bold text-danger">An unexpected interface error occurred</h5>
          <p className="text-muted small mb-3">
            {this.state.error?.message || 'A client-side component crash was caught safely.'}
          </p>
          <div>
            <button className="btn btn-outline-danger btn-sm" onClick={this.handleReset}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
