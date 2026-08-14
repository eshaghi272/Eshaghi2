// Path: frontend/src/components/auth/Login.tsx
import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  
  // ===== تابع دریافت مسیر داشبورد بر اساس نقش =====
  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'doctor':
        return '/doctor/dashboard'
      case 'receptionist':
        return '/receptionist/dashboard'
      case 'patient':
        return '/patient/dashboard'
      default:
        return '/dashboard'
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // اعتبارسنجی ساده
    if (!formData.username.trim()) {
      setErrors({ username: 'شماره موبایل یا کد ملی را وارد کنید' })
      return
    }
    if (!formData.password.trim()) {
      setErrors({ password: 'رمز عبور را وارد کنید' })
      return
    }
    
    setLoading(true)
    setErrors({})
    
    try {
      // لاگین کاربر
      await login(formData)
      toast.success('ورود موفقیت‌آمیز بود')
      
      // دریافت اطلاعات کاربر از localStorage
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        // هدایت به داشبورد مناسب بر اساس نقش
        navigate(getDashboardPath(user.role))
      } else {
        // اگر اطلاعات کاربر در localStorage نبود، به صفحه اصلی هدایت شود
        navigate('/')
      }
    } catch (error: any) {
      // مدیریت خطاها
      if (error.response?.status === 401) {
        toast.error('نام کاربری یا رمز عبور اشتباه است')
      } else if (error.response?.status === 404) {
        toast.error('کاربری با این اطلاعات یافت نشد')
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('سرور در دسترس نیست. لطفاً بعداً تلاش کنید.')
      } else {
        toast.error(error.message || 'خطا در ورود')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // پاک کردن خطای مربوط به فیلد
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900 px-4">
      <div className="card w-full max-w-md dark:bg-gray-800">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💎</div>
          <h2 className="text-3xl font-bold text-darkblue dark:text-white">ورود</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            برای ورود به حساب کاربری، اطلاعات خود را وارد کنید
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* شماره موبایل یا کد ملی */}
          <div>
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              <FaUser className="inline ml-1 text-gold" />
              شماره موبایل یا کد ملی
            </label>
            <input
              type="text"
              name="username"
              className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.username ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              value={formData.username}
              onChange={handleChange}
              placeholder="مثال: 09120000001 یا 1234567890"
              required
              disabled={loading}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>
          
          {/* رمز عبور */}
          <div>
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              <FaLock className="inline ml-1 text-gold" />
              رمز عبور
            </label>
            <input
              type="password"
              name="password"
              className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              value={formData.password}
              onChange={handleChange}
              placeholder="رمز عبور خود را وارد کنید"
              required
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
          
          {/* دکمه ورود */}
          <button 
            type="submit" 
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                در حال ورود...
              </>
            ) : (
              <>
                <FaSignInAlt />
                ورود
              </>
            )}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            حساب کاربری ندارید؟{' '}
            <Link to="/register" className="text-gold hover:underline font-medium">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}