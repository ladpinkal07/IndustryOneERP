import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  // Initialize Bootstrap JS components (modals, dropdowns) on client-side
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
