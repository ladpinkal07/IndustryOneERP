import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import { Badge, StatCard, Button, Alert } from '../components/common';
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
          <Button
            variant="outline-primary"
            size="sm"
            startIcon={<span>🔄</span>}
            onClick={() => window.location.reload()}
          >
            Refresh Metrics
          </Button>
        }
      />

      {/* Tenant Context Alert Banner */}
      <Alert
        variant="primary"
        icon={false}
        customIcon="🏢"
        className="mb-4"
      >
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <span className="fw-semibold">Active Tenant Isolation Scope:</span>{' '}
            <span className="font-monospace fw-bold">{activeTenantId || 'demo-corp'}</span>
            {activeBranchId && (
              <span className="ms-2 badge bg-primary text-white">
                Facility: {activeBranchId}
              </span>
            )}
          </div>
          <Badge variant="success" pill>Encrypted Partition</Badge>
        </div>
      </Alert>

      {/* KPI & Telemetry StatCards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-4">
          <StatCard
            title="FastAPI REST Engine"
            value="Port 8000"
            subtitle={`API v${healthData?.version || '1.0.0'} • Status: ${healthData?.status || 'OFFLINE'}`}
            icon="⚡"
            variant="primary"
            trend={{ value: 'Healthy', isPositive: healthData?.status === 'HEALTHY' }}
            loading={healthLoading}
          />
        </div>

        <div className="col-md-6 col-xl-4">
          <StatCard
            title="Database Connection"
            value="MySQL 8.0"
            subtitle={`Pool: 20 conns • Status: ${healthData?.database || 'UNKNOWN'}`}
            icon="🗄️"
            variant="success"
            trend={{ value: 'Connected', isPositive: healthData?.database === 'CONNECTED' }}
            loading={healthLoading}
          />
        </div>

        <div className="col-md-12 col-xl-4">
          <StatCard
            title="Next.js Client Shell"
            value="Port 3000"
            subtitle="Reusable UI Component System Active"
            icon="⚛️"
            variant="info"
            trend={{ value: 'Live', isPositive: true }}
          />
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
