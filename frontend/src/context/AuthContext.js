import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTenantId, setActiveTenantId] = useState(null);
  const [activeBranchId, setActiveBranchId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with LocalStorage on client mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_profile');
    const savedTenant = localStorage.getItem('active_tenant_id');
    const savedBranch = localStorage.getItem('active_branch_id');

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTenant) setActiveTenantId(savedTenant);
    if (savedBranch) setActiveBranchId(savedBranch);
    
    setIsLoading(false);
  }, []);

  const login = async (authToken, userProfile, tenantId) => {
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
    localStorage.setItem('active_tenant_id', tenantId);

    setToken(authToken);
    setUser(userProfile);
    setActiveTenantId(tenantId);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('active_tenant_id');
    localStorage.removeItem('active_branch_id');

    setToken(null);
    setUser(null);
    setActiveTenantId(null);
    setActiveBranchId(null);
  };

  const switchTenant = (tenantId) => {
    localStorage.setItem('active_tenant_id', tenantId);
    setActiveTenantId(tenantId);
  };

  const switchBranch = (branchId) => {
    localStorage.setItem('active_branch_id', branchId);
    setActiveBranchId(branchId);
  };

  const value = {
    user,
    token,
    activeTenantId,
    activeBranchId,
    isLoading,
    login,
    logout,
    switchTenant,
    switchBranch
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
