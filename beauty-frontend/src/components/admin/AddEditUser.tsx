// Path: frontend/src/components/admin/AddEditUser.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaIdCard, 
  FaLock, 
  FaSave, 
  FaTimes,
  FaUserMd,
  FaUserGraduate
  
} from 'react-icons/fa'

interface UserFormData {
  fullName: string
  nationalCode: string
  mobile: string
  email: string
  password: string
  role: string
  isActive: boolean
}

export default function AddEditUser() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    nationalCode: '',
    mobile: '',
    email: '',
    password: '',
    role: 'patient',
    isActive: true
  })

  const roles = [
    { value: 'admin', label: 'مدیر', icon: <FaUserGraduate /> },
    { value: 'doctor', label: 'پزشک', icon: <FaUserMd /> },
    { value: 'receptionist', label: 'منشی', icon: <FaUser /> },
    { value: 'patient', label: 'بیمار', icon: <FaUser /> }
  ]

  useEffect(() => {
    if (isEdit) {
      fetchUserData()
    }
  }, [id])

  const fetchUserData = async () => {
    try {
      setFetchLoading(true)
      const response = await axios.get(`/api/v1/users/${id}`)
      const data = response.data
      setFormData({
        fullName: data.fullName || '',
        nationalCode: data.nationalCode || '',
        mobile: data.mobile || '',
        email: data.email || '',
        password: '',
        role: data.role || 'patient',
        isActive: data.isActive === 1
      })
    } catch (error: any) {
      console.error('Error fetching user:', error)
      toast.error('خطا در دریافت اطلاعات کاربر')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // اعتبارسنجی
      if (!formData.fullName.trim()) {
        toast.error('نام کامل الزامی است')
        setLoading(false)
        return
      }

      if (!formData.nationalCode || formData.nationalCode.length !== 10) {
        toast.error('کد ملی باید ۱۰ رقم باشد')
        setLoading(false)
        return
      }

      if (!formData.mobile || formData.mobile.length !== 11) {
        toast.error('شماره موبایل باید ۱۱ رقم باشد')
        setLoading(false)
        return
      }

      if (!isEdit && !formData.password) {
        toast.error('رمز عبور الزامی است')
        setLoading(false)
        return
      }

      if (!isEdit && formData.password.length < 6) {
        toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد')
        setLoading(false)
        return
      }

      const submitData = {
        fullName: formData.fullName,
        nationalCode: formData.nationalCode,
        mobile: formData.mobile,
        email: formData.email || null,
        role: formData.role,
        isActive: formData.isActive ? 1 : 0
      }

      if (!isEdit) {
        await axios.post('/api/v1/users', {
          ...submitData,
          password: formData.password
        })
        toast.success('کاربر با موفقیت ایجاد شد')
      } else {
        await axios.put(`/api/v1/users/${id}`, submitData)
        toast.success('کاربر با موفقیت بروزرسانی شد')
      }

      navigate('/admin/users')
    } catch (error: any) {
      console.error('Error saving user:', error)
      
      if (error.response?.status === 409) {
        toast.error('کاربر با این کد ملی یا موبایل قبلاً ثبت شده است')
      } else {
        toast.error(error.response?.data?.message || 'خطا در ذخیره اطلاعات')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-darkblue dark:text-white">
            {isEdit ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
          </h1>
          <FaUser className="text-4xl text-gold" />
        </div>

        <div className="card dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* نام کامل */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaUser className="inline ml-1 text-gold" />
                نام کامل *
              </label>
              <input
                type="text"
                name="fullName"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="نام و نام خانوادگی"
              />
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
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.nationalCode}
                onChange={handleChange}
                required
                disabled={loading || isEdit}
                maxLength={10}
                placeholder="کد ملی ۱۰ رقمی"
              />
              {isEdit && (
                <p className="text-xs text-gray-400 mt-1">🔒 قابل ویرایش نیست</p>
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
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.mobile}
                onChange={handleChange}
                required
                disabled={loading || isEdit}
                maxLength={11}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
              {isEdit && (
                <p className="text-xs text-gray-400 mt-1">🔒 قابل ویرایش نیست</p>
              )}
            </div>

            {/* ایمیل */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaEnvelope className="inline ml-1 text-gold" />
                ایمیل
              </label>
              <input
                type="email"
                name="email"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="example@email.com"
              />
            </div>

            {/* رمز عبور */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaLock className="inline ml-1 text-gold" />
                {isEdit ? 'رمز عبور جدید (اختیاری)' : 'رمز عبور *'}
              </label>
              <input
                type="password"
                name="password"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.password}
                onChange={handleChange}
                required={!isEdit}
                minLength={6}
                disabled={loading}
                placeholder={isEdit ? 'برای تغییر رمز وارد کنید' : 'حداقل ۶ کاراکتر'}
              />
            </div>

            {/* نقش */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                نقش *
              </label>
              <select
                name="role"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* فعال/غیرفعال */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={loading}
                className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-darkblue dark:text-white">
                کاربر فعال باشد
              </label>
            </div>

            {/* دکمه‌ها */}
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
                    {isEdit ? 'ذخیره تغییرات' : 'ایجاد کاربر'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <FaTimes />
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    
  )
}