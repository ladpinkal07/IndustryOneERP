import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100 bg-body">
      {/* Top Application Navbar */}
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onMobileSidebarToggle={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      <div className="d-flex flex-grow-1 position-relative">
        {/* Navigation Sidebar (Desktop + Mobile offcanvas) */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Workspace Main Area */}
        <div className="d-flex flex-column flex-grow-1 min-vw-0">
          <main className="flex-grow-1 p-3 p-md-4 bg-light-subtle">
            <div className="container-fluid p-0">
              {children}
            </div>
          </main>

          {/* Persistent Enterprise Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
