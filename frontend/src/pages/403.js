import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ErrorState from '../components/common/ErrorState';
import { APP_CONFIG } from '../utils/constants';

export default function Custom403() {
  return (
    <Layout>
      <Head>
        <title>403 - Access Forbidden | {APP_CONFIG.NAME}</title>
        <meta name="description" content="Access to this resource is forbidden." />
      </Head>

      <ErrorState
        statusCode={403}
        title="Access Forbidden"
        message="Your role does not have the required permissions to access this ERP resource in the current tenant isolation partition. Please contact your organization administrator."
        showHomeButton
      />
    </Layout>
  );
}
