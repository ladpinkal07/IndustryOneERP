import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found | IndustryOne ERP</title>
        <meta name="description" content="The requested page could not be found." />
      </Head>

      <div className="card border-0 shadow-sm p-5 text-center my-4">
        <div className="display-1 fw-bold text-primary opacity-50 mb-2">404</div>
        <h2 className="fw-bold mb-2">Page Not Found</h2>
        <p className="text-muted fs-5 mb-4 mx-auto" style={{ maxWidth: '480px' }}>
          The enterprise resource or page you requested does not exist, has been moved, or you lack access permissions.
        </p>

        <div className="d-flex justify-content-center gap-2">
          <Link href="/" className="btn btn-primary px-4 py-2">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}
