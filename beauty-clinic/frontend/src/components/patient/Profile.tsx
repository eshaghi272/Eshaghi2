// Path: frontend/src/components/patient/Profile.tsx
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaSave, FaEdit, FaKey } from 'react-icons/fa'

export default function Profile() {
  const { user, logout, refreshUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    nationalCode: ''
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  // بارگذاری اطلاعات کاربر
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    // ابتدا از Context استفاده کن
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        nationalCode: user.nationalCode || ''
      })
      setFetchLoading(false)
    }
    
    // سپس از API دریافت کن
    fetchUserData()
  }

  const fetchUserData = async () => {
    try {
      setFetchLoading(true)
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        // اگر توکن وجود ندارد، از اطلاعات موجود در localStorage استفاده کن
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setFormData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            nationalCode: userData.nationalCode || ''
          })
        }
        setFetchLoading(false)
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const response = await axios.get('/api/v1/users/me')
      const userData = response.data
      
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        nationalCode: userData.nationalCode || ''
      })
      
      // بروزرسانی localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
    } catch (error: any) {
      console.error('Error fetching user data:', error)
      
      if (error.response?.status === 401) {
        // اگر توکن نامعتبر است، از داده‌های localStorage استفاده کن
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setFormData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            nationalCode: userData.nationalCode || ''
          })
        } else {
          toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
          logout()
        }
      } else {
        toast.error('خطا در دریافت اطلاعات کاربر')
      }
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        toast.error('لطفاً وارد سیستم شوید')
        setLoading(false)
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // بروزرسانی اطلاعات کاربر
      const updateData: any = {
        fullName: formData.fullName
      }
      
      if (formData.email !== user?.email) {
        updateData.email = formData.email
      }

      await axios.put('/api/v1/users/me', updateData)
      toast.success('پروفایل با موفقیت به‌روزرسانی شد')
      
      // بروزرسانی اطلاعات کاربر
      await refreshUser()
      
      setEditMode(false)
      
    } catch (error: any) {
      console.error('Error updating profile:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        logout()
      } else {
        toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('رمز عبور جدید و تکرار آن مطابقت ندارند')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        toast.error('لطفاً وارد سیستم شوید')
        setLoading(false)
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      await axios.put('/api/v1/users/me', {
        password: passwordData.newPassword
      })
      
      toast.success('رمز عبور با موفقیت تغییر یافت')
      setShowPasswordChange(false)
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      console.error('Error changing password:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        logout()
      } else {
        toast.error(error.response?.data?.message || 'خطا در تغییر رمز عبور')
      }
    } finally {
      setLoading(false)
    }
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'مدیر',
      doctor: 'پزشک',
      patient: 'بیمار'
    }
    return roles[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      doctor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      patient: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  if (fetchLoading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
          </div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">پروفایل کاربری</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              مدیریت اطلاعات شخصی و تنظیمات حساب کاربری
            </p>
          </div>
          <div className="flex gap-2">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <FaEdit />
                ویرایش
              </button>
            )}
          </div>
        </div>

        {/* کارت پروفایل */}
        <div className="card dark:bg-gray-800 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 rounded-2xl bg-gold flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {formData.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-darkblue dark:text-white">
                {formData.fullName || 'کاربر'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData.mobile}
              </p>
              <span className={`inline-block mt-1 px-3 py-0.5 text-xs rounded-full ${getRoleColor(user?.role || 'patient')}`}>
                {getRoleLabel(user?.role || 'patient')}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* نام کامل */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaUser className="inline ml-1 text-gold" />
                نام کامل *
              </label>
              <input
                type="text"
                className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                disabled={!editMode || loading}
                required
              />
            </div>

            {/* کد ملی */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaIdCard className="inline ml-1 text-gold" />
                کد ملی
              </label>
              <input
                type="text"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 opacity-70 cursor-not-allowed"
                value={formData.nationalCode}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">🔒 قابل ویرایش نیست</p>
            </div>

            {/* شماره موبایل */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaPhone className="inline ml-1 text-gold" />
                شماره موبایل
              </label>
              <input
                type="text"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 opacity-70 cursor-not-allowed"
                value={formData.mobile}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">🔒 قابل ویرایش نیست</p>
            </div>

            {/* ایمیل */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaEnvelope className="inline ml-1 text-gold" />
                ایمیل
              </label>
              <input
                type="email"
                className={`input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!editMode || loading}
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>

            {/* دکمه ذخیره - فقط در حالت ویرایش */}
            {editMode && (
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      ذخیره تغییرات
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false)
                    // بازگردانی اطلاعات
                    loadUserData()
                  }}
                  className="btn-secondary flex items-center gap-2"
                  disabled={loading}
                >
                  انصراف
                </button>
              </div>
            )}
          </form>
        </div>

        {/* تغییر رمز عبور */}
        <div className="card dark:bg-gray-800">
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="w-full flex items-center justify-between text-darkblue dark:text-white"
          >
            <span className="flex items-center gap-2 font-semibold">
              <FaKey className="text-gold" />
              تغییر رمز عبور
            </span>
            <span className="text-gray-400">
              {showPasswordChange ? '▲' : '▼'}
            </span>
          </button>

          {showPasswordChange && (
            <form onSubmit={handlePasswordChange} className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  رمز عبور جدید *
                </label>
                <input
                  type="password"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="رمز عبور جدید را وارد کنید"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  تکرار رمز عبور جدید *
                </label>
                <input
                  type="password"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="رمز عبور جدید را مجدداً وارد کنید"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2 text-sm"
                  disabled={loading}
                >
                  {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false)
                    setPasswordData({
                      newPassword: '',
                      confirmPassword: ''
                    })
                  }}
                  className="btn-secondary text-sm"
                  disabled={loading}
                >
                  انصراف
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    
  )
}