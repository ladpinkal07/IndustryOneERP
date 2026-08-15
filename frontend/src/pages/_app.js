import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import ErrorBoundary from '../components/common/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  // Initialize Bootstrap JS components (modals, dropdowns) on client-side
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
