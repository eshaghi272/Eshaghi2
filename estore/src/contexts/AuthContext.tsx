// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  avatar?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  role: 'customer' | 'admin';
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
  switchUser: (userType: 'admin' | 'customer1' | 'customer2' | 'customer3') => void;
  validateNationalCode: (code: string) => boolean;
  switchToGuest: () => void;
  clearAuthData: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

// لیست کاربران مختلف برای تست
const SAMPLE_USERS = {
  admin: {
    id: 1,
    username: 'admin',
    email: 'admin@estore.com',
    full_name: 'مدیر فروشگاه',
    phone: '09120000001',
    role: 'admin' as const,
    is_active: true,
    created_at: '2024-01-01'
  },
  customer1: {
    id: 2,
    username: 'ali_mohammadi',
    email: 'ali@example.com',
    full_name: 'علی محمدی',
    phone: '09121234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali',
    role: 'customer' as const,
    is_active: true,
    created_at: '2024-02-15'
  },
  customer2: {
    id: 3,
    username: 'fatemeh_k',
    email: 'fatemeh@example.com',
    full_name: 'فاطمه کریمی',
    phone: '09351234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatemeh',
    role: 'customer' as const,
    is_active: true,
    created_at: '2024-03-10'
  },
  customer3: {
    id: 4,
    username: 'reza_ahmadi',
    email: 'reza@example.com',
    full_name: 'رضا احمدی',
    phone: '09101234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reza',
    role: 'customer' as const,
    is_active: true,
    created_at: '2024-04-20'
  },
  customer4: {
    id: 5,
    username: 'sara_j',
    email: 'sara@example.com',
    full_name: 'سارا جعفری',
    phone: '09111234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
    role: 'customer' as const,
    is_active: true,
    created_at: '2024-05-05'
  }
};

// تابع اعتبارسنجی کد ملی
export const validateNationalCode = (code: string): boolean => {
  if (!code || code.length !== 10 || !/^\d{10}$/.test(code)) {
    return false;
  }
  
  // الگوریتم اعتبارسنجی کد ملی ایران
  const check = parseInt(code[9]);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]) * (10 - i);
  }
  
  const remainder = sum % 11;
  const isValid = (remainder < 2 && check === remainder) || 
                  (remainder >= 2 && check === 11 - remainder);
  
  return isValid;
};

// تابع اعتبارسنجی شماره موبایل
export const validatePhoneNumber = (phone: string): boolean => {
  // اعتبارسنجی شماره موبایل ایران
  const regex = /^09[0-9]{9}$/;
  return regex.test(phone);
};

// تابع اعتبارسنجی کد تایید
export const validateVerificationCode = (code: string): boolean => {
  // کد تایید باید ۴ تا ۶ رقم باشد
  return /^\d{4,6}$/.test(code);
};

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
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // بررسی توکن و بارگذاری اطلاعات کاربر
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  // شبیه‌سازی API
  const simulateAPI = {
    login: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // کاربران از پیش تعریف شده
      const user = Object.values(SAMPLE_USERS).find(u => u.email === email);
      
      if (user && password === '123456') {
        return {
          success: true,
          token: `fake-jwt-token-${user.id}`,
          user
        };
      }
      
      // اگر کاربر جدید بود، با اطلاعات جدید بساز
      if (password === '123456') {
        const newUser: User = {
          id: Math.floor(Math.random() * 10000) + 100,
          username: email.split('@')[0],
          email,
          full_name: email.split('@')[0],
          phone: '0912' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
          role: 'customer',
          is_active: true,
          created_at: new Date().toISOString()
        };
        
        return {
          success: true,
          token: `fake-jwt-token-${newUser.id}`,
          user: newUser
        };
      }
      
      return {
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است'
      };
    },
    
    register: async (userData: RegisterData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بررسی وجود کاربر
      const existingUser = Object.values(SAMPLE_USERS).find(u => 
        u.email === userData.email || u.username === userData.username
      );
      
      if (existingUser) {
        return {
          success: false,
          message: 'این ایمیل یا نام کاربری قبلاً ثبت شده است'
        };
      }
      
      const newUser: User = {
        id: Math.floor(Math.random() * 10000) + 1000,
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        role: 'customer',
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      return {
        success: true,
        token: `fake-jwt-token-${newUser.id}`,
        user: newUser
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await simulateAPI.login(email, password);
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        
        // ذخیره اطلاعات کاربر در localStorage برای نمایش در سبد خرید
        localStorage.setItem('current_user', response.user.full_name);
        
        // انتقال سبد خرید مهمان به کاربر
        transferGuestCart(response.user.id);
        
        // بررسی ریدایرکت
        const savedRedirect = localStorage.getItem('cart_redirect') || '/';
        localStorage.removeItem('cart_redirect');
        
        navigate(savedRedirect);
        
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'خطا در ارتباط با سرور'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await simulateAPI.register(userData);
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        localStorage.setItem('current_user', userData.full_name);
        
        navigate('/');
        
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'خطا در ارتباط با سرور'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // ذخیره سبد خرید کاربر قبل از خروج
    if (user) {
      saveUserCart(user.id);
    }
    
    setToken(null);
    setUser(null);
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('current_user');
    localStorage.removeItem('guest_cart');
    
    navigate('/auth/login');
  };

  const clearAuthData = () => {
    // پاک کردن اطلاعات کاربر قبلی
    setToken(null);
    setUser(null);
    
    // پاک کردن از localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const switchToGuest = () => {
    // پاک کردن اطلاعات احراز هویت
    clearAuthData();
    
    // ذخیره سبد خرید فعلی برای مهمان
    const currentCart = localStorage.getItem('cart');
    if (currentCart) {
      localStorage.setItem('guest_cart_backup', currentCart);
      localStorage.setItem('cart_backup_time', new Date().toISOString());
    }
    
    // ریست کردن نام کاربر
    localStorage.setItem('current_user', 'مهمان');
    
    // پاک کردن ریدایرکت‌های قبلی
    localStorage.removeItem('cart_redirect');
    
    // هدایت به صفحه ورود
    navigate('/auth/login');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        localStorage.setItem('current_user', updatedUser.full_name);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (oldPassword !== '123456') {
        return { success: false, message: 'رمز عبور فعلی اشتباه است' };
      }
      
      return { success: true, message: 'رمز عبور با موفقیت تغییر کرد' };
    } finally {
      setIsLoading(false);
    }
  };

  // تابع برای تغییر سریع کاربر (مخصوص دمو و تست)
  const switchUser = (userType: 'admin' | 'customer1' | 'customer2' | 'customer3') => {
    const selectedUser = SAMPLE_USERS[userType];
    
    const fakeToken = `fake-jwt-token-${selectedUser.id}`;
    
    setToken(fakeToken);
    setUser(selectedUser);
    
    localStorage.setItem('auth_token', fakeToken);
    localStorage.setItem('auth_user', JSON.stringify(selectedUser));
    localStorage.setItem('current_user', selectedUser.full_name);
    
    // انتقال سبد خرید
    transferGuestCart(selectedUser.id);
    
    navigate('/');
  };

  // تابع اعتبارسنجی کد ملی (نسخه context)
  const validateNationalCodeContext = (code: string): boolean => {
    return validateNationalCode(code);
  };

  // انتقال سبد خرید مهمان به کاربر
  const transferGuestCart = (userId: number) => {
    try {
      const guestCart = localStorage.getItem('guest_cart');
      const cart = localStorage.getItem('cart');
      
      if (guestCart || cart) {
        // در حالت واقعی، اینجا به API ارسال می‌شود
        console.log(`Transferring cart for user ${userId}`, { guestCart, cart });
        
        // ذخیره سبد خرید برای کاربر
        localStorage.setItem(`user_cart_${userId}`, guestCart || cart || '[]');
        
        // پاک کردن سبد خرید مهمان
        localStorage.removeItem('guest_cart');
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error transferring cart:', error);
    }
  };

  // ذخیره سبد خرید کاربر
  const saveUserCart = (userId: number) => {
    try {
      const cart = localStorage.getItem('cart');
      if (cart) {
        localStorage.setItem(`user_cart_${userId}`, cart);
      }
    } catch (error) {
      console.error('Error saving user cart:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!token && !!user,
    isLoading,
    switchUser,
    validateNationalCode: validateNationalCodeContext,
    switchToGuest,
    clearAuthData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// هوک کمکی برای دریافت اطلاعات کاربر جاری
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

// هوک کمکی برای بررسی نقش کاربر
export const useUserRole = () => {
  const { user } = useAuth();
  return user?.role || 'guest';
};

// هوک کمکی برای بررسی آیا کاربر ادمین است
export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};