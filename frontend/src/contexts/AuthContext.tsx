import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '@/services/authService';

// User type definition
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount and fetch user data
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Fetch user data with stored token
          const userData = await authService.getUser(storedToken);
          setUser(userData);
        } catch (error) {
          // Token is invalid, clear it
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('auth_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Computed property for authentication status
  const isAuthenticated = !!user && !!token;

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const response = await authService.register(name, email, password, passwordConfirmation);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
