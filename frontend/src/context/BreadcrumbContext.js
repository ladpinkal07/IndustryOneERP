import React, { createContext, useContext, useState, useCallback } from 'react';

const BreadcrumbContext = createContext(null);

export function BreadcrumbProvider({ children }) {
  const [customCrumbs, setCustomCrumbs] = useState(null);

  const setBreadcrumbs = useCallback((crumbs) => {
    setCustomCrumbs(crumbs);
  }, []);

  const resetBreadcrumbs = useCallback(() => {
    setCustomCrumbs(null);
  }, []);

  const value = {
    customCrumbs,
    setBreadcrumbs,
    resetBreadcrumbs,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
}
