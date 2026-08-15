import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function Custom500() {
  return (
    <Layout>
      <Head>
        <title>500 - Internal Server Error | IndustryOne ERP</title>
        <meta name="description" content="An unexpected server error occurred." />
      </Head>

      <div className="card border-0 shadow-sm p-5 text-center my-4">
        <div className="display-1 fw-bold text-danger opacity-50 mb-2">500</div>
        <h2 className="fw-bold mb-2">Internal Server Error</h2>
        <p className="text-muted fs-5 mb-4 mx-auto" style={{ maxWidth: '480px' }}>
          An unexpected error occurred on the ERP server. The issue has been recorded in the central audit logs.
        </p>

        <div className="d-flex justify-content-center gap-2">
          <Link href="/" className="btn btn-primary px-4 py-2">
            Return to Dashboard
          </Link>
          <button
            className="btn btn-outline-secondary px-4 py-2"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      </div>
    </Layout>
  );
}
