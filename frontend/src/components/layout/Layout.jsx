import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <Header />

      <div className="d-flex flex-grow-1">
        {/* Navigation Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content Workspace Panel */}
        <main className="flex-grow-1 p-4 bg-light-subtle">
          <div className="container-fluid p-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
