import React, { useEffect, useState, createContext, useContext } from 'react';
import { User } from '../types';
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally decode token here to get user info if not stored separately
      // For now, we'll assume the user is authenticated if token exists
    }
    setIsLoading(false);
  }, []);
  const login = (newToken: string, newUser?: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    if (newUser) setUser(newUser);
  };
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  return <AuthContext.Provider value={{
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isLoading
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