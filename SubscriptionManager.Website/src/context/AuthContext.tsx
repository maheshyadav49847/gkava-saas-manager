import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userName: string | null;
  login: (token: string) => void;
  logout: () => void;
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('subscriber_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  useEffect(() => {
    setIsAuthenticated(!!token);
    if (token) {
      localStorage.setItem('subscriber_token', token);
    } else {
      localStorage.removeItem('subscriber_token');
    }
  }, [token]);

  const userName = useMemo(() => {
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    // ASP.NET Core uses the full URI for ClaimTypes.Name
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] 
      || payload['name'] 
      || payload['unique_name'] 
      || null;
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
