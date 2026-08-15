import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ErrorState from '../components/common/ErrorState';
import { APP_CONFIG } from '../utils/constants';

export default function Custom500() {
  return (
    <Layout>
      <Head>
        <title>500 - Internal Server Error | {APP_CONFIG.NAME}</title>
        <meta name="description" content="An unexpected server error occurred." />
      </Head>

      <ErrorState
        statusCode={500}
        title="Internal Server Error"
        message="An unexpected server error occurred while executing the transaction. The incident has been recorded in the central ERP audit log."
        onRetry={() => window.location.reload()}
        showHomeButton
      />
    </Layout>
  );
}
