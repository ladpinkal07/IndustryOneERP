import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
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
      <ThemeProvider>
        <AuthProvider>
          <BreadcrumbProvider>
            <ModalProvider>
              <NotificationProvider>
                <Component {...pageProps} />
              </NotificationProvider>
            </ModalProvider>
          </BreadcrumbProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
