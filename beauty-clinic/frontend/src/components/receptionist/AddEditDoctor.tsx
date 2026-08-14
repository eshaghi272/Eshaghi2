// Path: frontend/src/components/receptionist/AddEditDoctor.tsx
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
  FaStethoscope, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaSave, 
  FaTimes,
  FaUserMd,
  FaStar
} from 'react-icons/fa'

interface DoctorFormData {
  fullName: string
  nationalCode: string
  mobile: string
  email: string
  password: string
  specialty: string
  biography: string
  experienceYears: number
  consultationFee: number
  isActive: boolean
}

export default function AddEditDoctor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: '',
    nationalCode: '',
    mobile: '',
    email: '',
    password: '',
    specialty: '',
    biography: '',
    experienceYears: 0,
    consultationFee: 0,
    isActive: true
  })

  useEffect(() => {
    if (isEdit) {
      fetchDoctorData()
    }
  }, [id])

  const fetchDoctorData = async () => {
    try {
      setFetchLoading(true)
      
      const response = await axios.get(`/api/v1/doctors/${id}`)
      const data = response.data
      
      setFormData({
        fullName: data.fullName || '',
        nationalCode: data.nationalCode || '',
        mobile: data.mobile || '',
        email: data.email || '',
        password: '',
        specialty: data.doctor?.specialty || '',
        biography: data.doctor?.biography || '',
        experienceYears: data.doctor?.experienceYears || 0,
        consultationFee: data.doctor?.consultationFee || 0,
        isActive: data.isActive === 1
      })
    } catch (error: any) {
      console.error('Error fetching doctor:', error)
      toast.error('خطا در دریافت اطلاعات پزشک')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        // بروزرسانی پزشک
        await axios.put(`/api/v1/doctors/${id}`, {
          specialty: formData.specialty,
          biography: formData.biography || null,
          experienceYears: formData.experienceYears,
          consultationFee: formData.consultationFee
        })
        
        // بروزرسانی وضعیت فعال بودن
        await axios.put(`/api/v1/users/${id}`, {
          isActive: formData.isActive
        })
        
        toast.success('اطلاعات پزشک با موفقیت بروزرسانی شد')
      } else {
        // 1. ثبت کاربر جدید
        const userRes = await axios.post('/api/v1/users', {
          fullName: formData.fullName,
          nationalCode: formData.nationalCode,
          mobile: formData.mobile,
          email: formData.email || null,
          password: formData.password,
          role: 'doctor'
        })
        
        const userId = userRes.data.user.id
        
        // 2. ثبت اطلاعات پزشک
        await axios.post('/api/v1/doctors', {
          userId: userId,
          specialty: formData.specialty,
          biography: formData.biography || null,
          experienceYears: formData.experienceYears,
          consultationFee: formData.consultationFee
        })
        
        toast.success('پزشک با موفقیت ثبت شد')
      }
      
      navigate('/receptionist/doctors')
    } catch (error: any) {
      console.error('Error saving doctor:', error)
      
      if (error.response?.status === 403) {
        toast.error('شما دسترسی لازم برای این عملیات را ندارید')
      } else if (error.response?.status === 409) {
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
            {isEdit ? 'ویرایش پزشک' : 'ثبت پزشک جدید'}
          </h1>
          <FaUserMd className="text-4xl text-gold" />
        </div>

        <div className="card dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اطلاعات کاربری */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-lg font-bold text-darkblue dark:text-white mb-4 flex items-center gap-2">
                <FaUser className="text-gold" />
                اطلاعات کاربری
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    نام کامل *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading || isEdit}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
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
                  />
                </div>
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
                  />
                </div>
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
                    disabled={loading || isEdit}
                  />
                </div>
                {!isEdit && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                      <FaLock className="inline ml-1 text-gold" />
                      رمز عبور *
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
                      placeholder="حداقل ۶ کاراکتر"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* اطلاعات پزشکی */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-lg font-bold text-darkblue dark:text-white mb-4 flex items-center gap-2">
                <FaStethoscope className="text-gold" />
                اطلاعات پزشکی
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    تخصص *
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="مثال: پوست و مو"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    <FaCalendarAlt className="inline ml-1 text-gold" />
                    سال‌های تجربه
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    disabled={loading}
                    min={0}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    <FaMoneyBillWave className="inline ml-1 text-gold" />
                    هزینه ویزیت (تومان) *
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    min={0}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    بیوگرافی
                  </label>
                  <textarea
                    name="biography"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.biography}
                    onChange={handleChange}
                    disabled={loading}
                    rows={3}
                    placeholder="توضیحات درباره پزشک..."
                  />
                </div>
              </div>
            </div>

            {/* وضعیت فعال/غیرفعال */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                disabled={loading}
                className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-darkblue dark:text-white">
                پزشک فعال باشد
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
                    {isEdit ? 'ذخیره تغییرات' : 'ثبت پزشک'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/receptionist/doctors')}
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