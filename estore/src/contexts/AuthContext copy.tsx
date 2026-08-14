// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // بررسی توکن در اول کار
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  // شبیه‌سازی API
  const fakeAPI = {
    login: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@store.com' && password === '123456') {
        return {
          token: 'fake-jwt-token-admin-123',
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@store.com',
            full_name: 'مدیر سیستم',
            phone: '09123456789',
            role: 'admin',
            is_active: true
          }
        };
      }
      
      if (email === 'john.doe@email.com' && password === '123456') {
        return {
          token: 'fake-jwt-token-customer-123',
          user: {
            id: 4,
            username: 'john_doe',
            email: 'john.doe@email.com',
            full_name: 'جان دو',
            phone: '09125556677',
            role: 'customer',
            is_active: true
          }
        };
      }
      
      throw new Error('ایمیل یا رمز عبور اشتباه است');
    },
    
    register: async (userData: RegisterData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        token: 'fake-jwt-token-new-user-123',
        user: {
          id: Math.floor(Math.random() * 1000) + 100,
          username: userData.username,
          email: userData.email,
          full_name: userData.full_name || null,
          phone: userData.phone || null,
          role: 'customer',
          is_active: true
        }
      };
    },
    
    changePassword: async (oldPassword: string, newPassword: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (oldPassword !== '123456') {
        throw new Error('رمز عبور فعلی اشتباه است');
      }
      
      return { success: true };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fakeAPI.login(email, password);
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Check for saved redirect URL
      const savedRedirect = localStorage.getItem('cart_redirect') || 
                           localStorage.getItem('redirect_after_login');
      
      if (savedRedirect) {
        localStorage.removeItem('cart_redirect');
        localStorage.removeItem('redirect_after_login');
        navigate(savedRedirect);
      } else {
        navigate('/');
      }
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await fakeAPI.register(userData);
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      navigate('/');
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart_redirect');
    localStorage.removeItem('redirect_after_login');
    navigate('/auth/login');
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      const response = await fakeAPI.changePassword(oldPassword, newPassword);
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated: !!token,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};