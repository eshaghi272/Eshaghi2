// Path: frontend/src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config/api'

interface User {
  id: number
  fullName: string
  nationalCode: string
  mobile: string
  email: string | null
  role: string
  isActive: boolean
  createdAt?: string
  clinicId?: number
  specialty?: string
  consultationFee?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { username: string; password: string }) => Promise<any>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: () => {},
  refreshUser: async () => {}
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  // ===== بررسی وضعیت احراز هویت در شروع =====
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      const savedUser = localStorage.getItem('user')
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // تایید اعتبار توکن با درخواست به سرور
          try {
            const response = await axios.get(`${API_URL}/api/v1/users/me`)
            // بروزرسانی اطلاعات کاربر از سرور
            if (response.data) {
              const updatedUser = { ...userData, ...response.data }
              setUser(updatedUser)
              localStorage.setItem('user', JSON.stringify(updatedUser))
            }
          } catch (error: any) {
            // اگر توکن منقضی شده بود، خارج شوید
            if (error.response?.status === 401) {
              console.log('Token expired, logging out')
              localStorage.removeItem('access_token')
              localStorage.removeItem('user')
              delete axios.defaults.headers.common['Authorization']
              setUser(null)
            }
          }
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          delete axios.defaults.headers.common['Authorization']
          setUser(null)
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])
  
  // ===== لاگین =====
  const login = async (credentials: { username: string; password: string }) => {
    try {
      // ارسال درخواست به API با استفاده از API_URL
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
        username: credentials.username,
        password: credentials.password
      })
      
      // پشتیبانی از هر دو فرمت پاسخ (accessToken یا token)
      const accessToken = response.data.accessToken || response.data.token
      const userData = response.data.user || response.data.userData
      
      if (!accessToken || !userData) {
        throw new Error('اطلاعات ورود ناقص است')
      }
      
      // ذخیره در localStorage
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // تنظیم هدر Authorization
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      // به‌روزرسانی state
      setUser(userData)
      
      return response
    } catch (error: any) {
      console.error('Login error:', error)
      
      // اگر خطای 401 بود، پیام مناسب نمایش دهید
      if (error.response?.status === 401) {
        throw new Error('نام کاربری یا رمز عبور اشتباه است')
      }
      
      // اگر خطای شبکه بود
      if (error.code === 'ERR_NETWORK') {
        throw new Error('سرور در دسترس نیست. لطفاً بعداً تلاش کنید.')
      }
      
      throw new Error(error.response?.data?.message || 'خطا در ورود به سیستم')
    }
  }
  
  // ===== خروج =====
  const logout = () => {
    // پاک کردن اطلاعات از localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    
    // پاک کردن هدر Authorization
    delete axios.defaults.headers.common['Authorization']
    
    // پاک کردن state
    setUser(null)
    
    // هدایت به صفحه ورود
    navigate('/login')
  }
  
  // ===== بروزرسانی اطلاعات کاربر =====
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('توکن وجود ندارد')
      }
      
      // تنظیم هدر Authorization
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // دریافت اطلاعات کاربر از سرور با استفاده از API_URL
      const response = await axios.get(`${API_URL}/api/v1/users/me`)
      const userData = response.data
      
      if (!userData) {
        throw new Error('اطلاعات کاربر دریافت نشد')
      }
      
      // بروزرسانی اطلاعات در localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
      // بروزرسانی state
      setUser(userData)
      
    } catch (error: any) {
      console.error('Error refreshing user:', error)
      
      // اگر توکن نامعتبر بود، کاربر را خارج کنید
      if (error.response?.status === 401) {
        logout()
        throw new Error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
      }
      
      throw new Error('خطا در دریافت اطلاعات کاربر')
    }
  }
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}