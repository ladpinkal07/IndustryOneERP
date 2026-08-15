import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { BreadcrumbProvider } from '../context/BreadcrumbContext';
import { ModalProvider } from '../context/ModalContext';
import { NotificationProvider } from '../context/NotificationContext';
import ErrorBoundary from '../components/common/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  // Initialize Bootstrap JS components (modals, dropdowns) on client-side
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BreadcrumbProvider>
          <ModalProvider>
            <NotificationProvider>
              <Component {...pageProps} />
            </NotificationProvider>
          </ModalProvider>
        </BreadcrumbProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
