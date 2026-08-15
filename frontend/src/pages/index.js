import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../utils/constants';

export default function Home() {
  const { activeTenantId, activeBranchId } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  // Query Backend Health on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setHealthData(data.data);
        } else {
          setHealthData({ status: 'UNHEALTHY', version: '1.0.0', database: 'UNREACHABLE' });
        }
      })
      .catch(() => {
        setHealthData({ status: 'OFFLINE', version: '1.0.0', database: 'OFFLINE' });
      })
      .finally(() => {
        setHealthLoading(false);
      });
  }, []);

  return (
    <Layout>
      <Head>
        <title>Dashboard | {APP_CONFIG.NAME}</title>
        <meta name="description" content="SaaS Enterprise Resource Planning & Manufacturing Control" />
      </Head>

      <PageHeader
        title="Operations Dashboard"
        subtitle="Real-time multi-tenant manufacturing, ledger, and integration telemetry."
        icon="📊"
        badge={<Badge variant="primary" pill>Live Overview</Badge>}
        actions={
          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Metrics
          </button>
        }
      />

      {/* Tenant Context Notification */}
      <div className="alert alert-primary border-0 shadow-sm d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-5">🏢</span>
          <div>
            <span className="fw-semibold">Active Tenant Context:</span>{' '}
            <span className="font-monospace">{activeTenantId || 'demo-corp'}</span>
            {activeBranchId && (
              <span className="ms-2 badge bg-primary text-white">
                Branch: {activeBranchId}
              </span>
            )}
          </div>
        </div>
        <Badge variant="success" pill>Tenant Isolated</Badge>
      </div>

      {/* Integration Telemetry Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-4">
          <div className="card shadow-sm h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium text-uppercase">FastAPI Core API</span>
              <Badge variant={healthData?.status === 'HEALTHY' ? 'success' : 'danger'} pill>
                {healthLoading ? 'Checking...' : healthData?.status || 'OFFLINE'}
              </Badge>
            </div>
            <div className="h4 fw-bold text-dark mb-1">Port 8000</div>
            <div className="text-muted small">
              API Version: {healthData?.version || '1.0.0'} &bull; Base: <code>/api/v1</code>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-4">
          <div className="card shadow-sm h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium text-uppercase">Database Connection</span>
              <Badge variant={healthData?.database === 'CONNECTED' ? 'success' : 'warning'} pill>
                {healthLoading ? 'Pinging...' : healthData?.database || 'UNKNOWN'}
              </Badge>
            </div>
            <div className="h4 fw-bold text-dark mb-1">MySQL 8.0</div>
            <div className="text-muted small">
              Pool: 20 conns &bull; Schema: <code>industryone_erp</code>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-xl-4">
          <div className="card shadow-sm h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium text-uppercase">Next.js Client Shell</span>
              <Badge variant="success" pill>Active</Badge>
            </div>
            <div className="h4 fw-bold text-dark mb-1">Port 3000</div>
            <div className="text-muted small">
              Layout: Enterprise Shell &bull; Router: Pages Router
            </div>
          </div>
        </div>
      </div>

      {/* Module Overview Grid */}
      <div className="card shadow-sm p-4">
        <h5 className="fw-bold mb-3">Enterprise Core Modules</h5>
        <div className="row g-3">
          <div className="col-sm-6 col-lg-3">
            <div className="p-3 border rounded h-100 bg-body-tertiary">
              <div className="fs-3 mb-2">📦</div>
              <h6 className="fw-bold mb-1">Master Data (MDM)</h6>
              <p className="text-muted small mb-0">Part numbers, bills of materials, and vendor records.</p>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="p-3 border rounded h-100 bg-body-tertiary">
              <div className="fs-3 mb-2">🏭</div>
              <h6 className="fw-bold mb-1">Production Control</h6>
              <p className="text-muted small mb-0">Shop-floor routing, work centers, and scheduling.</p>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="p-3 border rounded h-100 bg-body-tertiary">
              <div className="fs-3 mb-2">🏷️</div>
              <h6 className="fw-bold mb-1">Inventory Management</h6>
              <p className="text-muted small mb-0">Lot tracking, warehouse bins, and reorder levels.</p>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="p-3 border rounded h-100 bg-body-tertiary">
              <div className="fs-3 mb-2">💳</div>
              <h6 className="fw-bold mb-1">Financial Ledger</h6>
              <p className="text-muted small mb-0">Chart of accounts, general ledger, and journal vouchers.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
