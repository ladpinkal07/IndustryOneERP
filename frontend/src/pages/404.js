import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ErrorState from '../components/common/ErrorState';
import { APP_CONFIG } from '../utils/constants';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found | {APP_CONFIG.NAME}</title>
        <meta name="description" content="The requested page could not be found." />
      </Head>

      <ErrorState
        statusCode={404}
        title="Page Not Found"
        message="The enterprise resource or route you requested does not exist, has been moved, or is temporarily unavailable."
        showHomeButton
      />
    </Layout>
  );
}
