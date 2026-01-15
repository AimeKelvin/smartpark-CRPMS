import React, { useEffect, useState, createContext, useContext } from 'react';
import api from '../services/api';
import { User } from '../types';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/check');
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);
  const login = (userData: User) => {
    setUser(userData);
  };
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return <AuthContext.Provider value={{
    user,
    loading,
    login,
    logout,
    checkAuth
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};