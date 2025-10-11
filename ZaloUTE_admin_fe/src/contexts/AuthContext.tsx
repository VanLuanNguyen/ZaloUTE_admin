import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!admin;

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedAdmin = localStorage.getItem('admin');
      
      if (token && savedAdmin) {
        try {
          const adminData = JSON.parse(savedAdmin);
          setAdmin(adminData);
          
          // Verify token is still valid
          await apiService.getCurrentAdmin();
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ username, password });
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        setAdmin(response.data.admin);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      setAdmin(null);
    }
  };

  const refreshAdmin = async () => {
    try {
      const response = await apiService.getCurrentAdmin();
      if (response.success) {
        setAdmin(response.data);
        localStorage.setItem('admin', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Refresh admin error:', error);
    }
  };

  const value: AuthContextType = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
