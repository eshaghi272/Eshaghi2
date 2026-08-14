// Path: frontend/src/components/auth/Register.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    nationalCode: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  // ===== اعتبارسنجی فرم =====
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // نام کامل
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'نام کامل باید حداقل ۳ کاراکتر باشد'
    } else if (formData.fullName.trim().length > 50) {
      newErrors.fullName = 'نام کامل نباید بیشتر از ۵۰ کاراکتر باشد'
    }

    // کد ملی
    if (!formData.nationalCode) {
      newErrors.nationalCode = 'کد ملی الزامی است'
    } else if (!/^\d{10}$/.test(formData.nationalCode)) {
      newErrors.nationalCode = 'کد ملی باید ۱۰ رقم و فقط شامل اعداد باشد'
    }

    // شماره موبایل
    if (!formData.mobile) {
      newErrors.mobile = 'شماره موبایل الزامی است'
    } else if (!/^09\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'
    }

    // ایمیل (اختیاری)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل نامعتبر است'
    }

    // رمز عبور
    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است'
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    } else if (formData.password.length > 20) {
      newErrors.password = 'رمز عبور نباید بیشتر از ۲۰ کاراکتر باشد'
    }

    // تکرار رمز عبور
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تکرار رمز عبور الزامی است'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    
    if (!validateForm()) {
      toast.error('لطفاً خطاهای فرم را اصلاح کنید')
      return
    }

    setLoading(true)
    
    try {
      // ارسال درخواست ثبت‌نام به API
      const response = await axios.post('/api/v1/auth/register', {
        fullName: formData.fullName.trim(),
        nationalCode: formData.nationalCode,
        mobile: formData.mobile,
        email: formData.email?.trim() || null,
        password: formData.password
      })

      // ثبت‌نام موفق
      toast.success('ثبت‌نام با موفقیت انجام شد')
      
      // اگر API توکن برگرداند، کاربر را لاگین کن
      if (response.data?.token) {
        // ذخیره توکن و اطلاعات کاربر
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // هدایت به داشبورد مناسب
        const userRole = response.data.user?.role || 'patient'
        navigate(getDashboardPath(userRole))
      } else {
        // اگر توکن برنگرداند، به صفحه ورود هدایت شود
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      }
      
    } catch (error: any) {
      console.error('Register error:', error)
      
      // مدیریت خطاهای مختلف
      if (error.response?.status === 400) {
        const message = error.response.data?.message || 'اطلاعات وارد شده صحیح نیست'
        toast.error(message)
        
        // نمایش خطاهای خاص فیلدها
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors)
        }
      } else if (error.response?.status === 409) {
        toast.error('کاربر با این کد ملی یا شماره موبایل قبلاً ثبت شده است')
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('سرور در دسترس نیست. لطفاً بعداً تلاش کنید.')
      } else {
        toast.error(error.response?.data?.message || 'خطا در ثبت‌نام')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value
    
    // محدودیت‌های ورودی
    if (name === 'nationalCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10)
    } else if (name === 'mobile') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11)
    } else if (name === 'fullName') {
      // فقط حروف و فاصله
      formattedValue = value.replace(/[^آ-یa-zA-Z\s]/g, '')
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }))
    
    // پاک کردن خطای مربوط به فیلد
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900 py-8 px-4">
      <div className="card w-full max-w-md dark:bg-gray-800">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💎</div>
          <h2 className="text-3xl font-bold text-darkblue dark:text-white">ثبت‌نام</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            عضو جدید کلینیک زیبایی شوید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* نام کامل */}
          <div>
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              <FaUser className="inline ml-1 text-gold" />
              نام کامل *
            </label>
            <input
              type="text"
              name="fullName"
              className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.fullName ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="نام و نام خانوادگی"
              required
              disabled={loading}
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* کد ملی */}
          <div>
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              <FaIdCard className="inline ml-1 text-gold" />
              کد ملی *
            </label>
            <input
              type="text"
              name="nationalCode"
              className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.nationalCode ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              value={formData.nationalCode}
              onChange={handleChange}
              placeholder="کد ملی ۱۰ رقمی"
              maxLength={10}
              required
              disabled={loading}
              autoComplete="off"
            />
            {errors.nationalCode && (
              <p className="text-xs text-red-500 mt-1">{errors.nationalCode}</p>
            )}
          </div>

          {/* شماره موبایل */}
          <div>
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              <FaPhone className="inline ml-1 text-gold" />
              شماره موبایل *
            </label>
            <input
              type="text"
              name="mobile"
              className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.mobile ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              value={formData.mobile}
              onChange={handleChange}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              maxLength={11}
              required
              disabled={loading}
              autoComplete="tel"
            />
            {errors.mobile && (
              <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* ایمیل */}
          <div>
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              <FaEnvelope className="inline ml-1 text-gold" />
              ایمیل (اختیاری)
            </label>
            <input
              type="email"
              name="email"
              className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* رمز عبور */}
          <div>
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              <FaLock className="inline ml-1 text-gold" />
              رمز عبور *
            </label>
            <input
              type="password"
              name="password"
              className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              value={formData.password}
              onChange={handleChange}
              placeholder="حداقل ۶ کاراکتر"
              required
              minLength={6}
              maxLength={20}
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* تکرار رمز عبور */}
          <div>
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              <FaLock className="inline ml-1 text-gold" />
              تکرار رمز عبور *
            </label>
            <input
              type="password"
              name="confirmPassword"
              className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="رمز عبور را مجدداً وارد کنید"
              required
              minLength={6}
              maxLength={20}
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* دکمه ثبت‌نام */}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                در حال ثبت‌نام...
              </>
            ) : (
              <>
                <FaUserPlus />
                ثبت‌نام
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link to="/login" className="text-gold hover:underline font-medium">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}