import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState('Checking...');
  const [theme, setTheme] = useState('light');

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

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className={`min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Head>
        <title>IndustryOne ERP - Dashboard</title>
        <meta name="description" content="SaaS Enterprise Manufacturing ERP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container-fluid py-4">
        <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
          <div className="d-flex align-items-center">
            <span className="fs-4 fw-bold text-primary">IndustryOne ERP</span>
            <span className="badge bg-secondary ms-2">Enterprise SaaS</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            <button className="btn btn-primary btn-sm">Sign In</button>
          </div>
        </header>

        <main className="row g-4">
          <section className="col-md-3">
            <div className="card h-100 shadow-sm border-0 p-3 bg-body-tertiary">
              <h5 className="card-title border-bottom pb-2">Active Tenant</h5>
              <div className="mb-3">
                <select className="form-select form-select-sm" defaultValue="demo-corp">
                  <option value="demo-corp">Demo Corporation</option>
                  <option value="multinat-corp">Multinational Logistics</option>
                </select>
              </div>
              <ul className="nav nav-pills flex-column gap-1">
                <li className="nav-item">
                  <a className="nav-link active" href="#">🏠 Dashboard</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">📦 Master Data (MDM)</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">🏭 Production Planning</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">📊 Financial Ledgers</a>
                </li>
              </ul>
            </div>
          </section>

          <section className="col-md-9">
            <div className="card border-0 shadow-sm p-4 h-100">
              <h1 className="display-6 fw-bold">Welcome to IndustryOne ERP</h1>
              <p className="fs-5 text-muted">
                Your enterprise development environment is configured and ready. Build the modules following the task roadmap.
              </p>

              <hr className="my-4" />

              <h4 className="fw-semibold">System Diagnostics</h4>
              <div className="row g-3 mt-1">
                <div className="col-sm-6">
                  <div className="p-3 border rounded bg-light-subtle">
                    <div className="text-secondary small">FastAPI Backend Status</div>
                    <div className="fs-5 fw-medium text-info">{healthStatus}</div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 border rounded bg-light-subtle">
                    <div className="text-secondary small">Next.js Client Status</div>
                    <div className="fs-5 fw-medium text-success">ONLINE (Port 3000)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
