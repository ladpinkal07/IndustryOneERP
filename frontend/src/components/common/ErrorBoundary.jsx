import React from 'react';
import ErrorState from './ErrorState';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught a render crash:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
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
        <ErrorState
          statusCode={500}
          title="Component Rendering Failure"
          message={
            this.state.error?.message ||
            'An unexpected error prevented this section from rendering properly.'
          }
          technicalDetails={
            this.state.error?.stack ||
            (this.state.errorInfo ? this.state.errorInfo.componentStack : null)
          }
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
