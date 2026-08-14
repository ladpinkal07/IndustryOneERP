import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { activeTenantId } = useAuth();
  const [healthStatus, setHealthStatus] = useState('Checking...');

  // Query Backend Health on load
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setHealthStatus(`${data.data.status} (v${data.data.version})`);
        } else {
          setHealthStatus('UNHEALTHY (API response fail)');
        }
      })
      .catch(() => {
        setHealthStatus('UNREACHABLE (Backend not running)');
      });
  }, []);

  return (
    <Layout>
      <Head>
        <title>IndustryOne ERP - Dashboard</title>
        <meta name="description" content="SaaS Enterprise Manufacturing ERP" />
      </Head>

      <div className="card border-0 shadow-sm p-4">
        <h1 className="display-6 fw-bold">Enterprise ERP System Dashboard</h1>
        <p className="fs-5 text-muted">
          Your Next.js React frontend architecture is initialized and fully bound to the active multi-tenant session parameters.
        </p>

        <div className="alert alert-info border-0 mt-3 d-flex align-items-center gap-2">
          <span>ℹ️</span>
          <span>
            Active Session context partitioned under tenant scope ID: <strong>{activeTenantId || 'demo-corp'}</strong>
          </span>
        </div>

        <hr className="my-4" />

        <h4 className="fw-semibold mb-3">System Integration Health Checks</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="p-3 border rounded bg-body-tertiary">
              <div className="text-secondary small fw-medium">FastAPI REST Server</div>
              <div className="fs-5 fw-bold text-info mt-1">{healthStatus}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 border rounded bg-body-tertiary">
              <div className="text-secondary small fw-medium">Next.js Client Server</div>
              <div className="fs-5 fw-bold text-success mt-1">ONLINE (Port 3000)</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
