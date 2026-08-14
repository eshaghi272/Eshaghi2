// Path: frontend/src/components/admin/ClinicManagement.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  FaHospital, 
  FaSave, 
  FaTimes, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaSpinner,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface Clinic {
  id: number
  clinicName: string
  clinicCode: string
  address: string
  phone: string
  mobile: string
  email: string
  website: string
  managerName: string
  managerPhone: string
  logo: string
  description: string
  isActive: number
  createdAt: string
  updatedAt: string
}

export default function ClinicManagement() {
  const { user, logout } = useContext(AuthContext)
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Clinic>>({
    clinicName: '',
    clinicCode: '',
    address: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    managerName: '',
    managerPhone: '',
    description: '',
    isActive: 1
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // بررسی نقش کاربر
    if (user && user.role !== 'admin') {
      toast.error('دسترسی غیرمجاز - فقط ادمین')
      window.location.href = '/dashboard'
      return
    }
    fetchClinics()
  }, [])

  const fetchClinics = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('access_token')
      if (!token) {
        toast.error('لطفاً وارد سیستم شوید')
        logout()
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const response = await axios.get('/api/v1/clinics')
      setClinics(response.data || [])

    } catch (error: any) {
      console.error('Error fetching clinics:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        logout()
        return
      }
      
      setError('خطا در دریافت لیست کلینیک‌ها')
      toast.error('خطا در دریافت اطلاعات')
      
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('access_token')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      if (editingClinic) {
        // بروزرسانی
        await axios.put(`/api/v1/clinics/${editingClinic.id}`, formData)
        toast.success('اطلاعات کلینیک با موفقیت بروزرسانی شد')
      } else {
        // ایجاد جدید
        await axios.post('/api/v1/clinics', formData)
        toast.success('کلینیک با موفقیت ایجاد شد')
      }

      setShowForm(false)
      setEditingClinic(null)
      setFormData({
        clinicName: '',
        clinicCode: '',
        address: '',
        phone: '',
        mobile: '',
        email: '',
        website: '',
        managerName: '',
        managerPhone: '',
        description: '',
        isActive: 1
      })
      fetchClinics()

    } catch (error: any) {
      console.error('Error saving clinic:', error)
      toast.error(error.response?.data?.message || 'خطا در ذخیره اطلاعات')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic)
    setFormData({
      clinicName: clinic.clinicName,
      clinicCode: clinic.clinicCode,
      address: clinic.address,
      phone: clinic.phone,
      mobile: clinic.mobile,
      email: clinic.email,
      website: clinic.website,
      managerName: clinic.managerName,
      managerPhone: clinic.managerPhone,
      description: clinic.description,
      isActive: clinic.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این کلینیک اطمینان دارید؟')) return

    try {
      const token = localStorage.getItem('access_token')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      await axios.delete(`/api/v1/clinics/${id}`)
      toast.success('کلینیک با موفقیت حذف شد')
      fetchClinics()

    } catch (error: any) {
      console.error('Error deleting clinic:', error)
      toast.error(error.response?.data?.message || 'خطا در حذف کلینیک')
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1
      const token = localStorage.getItem('access_token')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      await axios.put(`/api/v1/clinics/${id}`, { isActive: newStatus })
      toast.success(newStatus === 1 ? 'کلینیک فعال شد' : 'کلینیک غیرفعال شد')
      fetchClinics()

    } catch (error: any) {
      console.error('Error toggling clinic status:', error)
      toast.error('خطا در تغییر وضعیت کلینیک')
    }
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    try {
      return new Date(date).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return date
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری اطلاعات کلینیک‌ها...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-darkblue dark:text-white flex items-center gap-3">
            <FaHospital className="text-gold" />
            مدیریت کلینیک‌ها
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            مدیریت و تنظیمات کلینیک‌ها
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchClinics}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : '🔄'}
            بروزرسانی
          </button>
          <button
            onClick={() => {
              setEditingClinic(null)
              setFormData({
                clinicName: '',
                clinicCode: '',
                address: '',
                phone: '',
                mobile: '',
                email: '',
                website: '',
                managerName: '',
                managerPhone: '',
                description: '',
                isActive: 1
              })
              setShowForm(true)
            }}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            <FaPlus />
            کلینیک جدید
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchClinics}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* ===== لیست کلینیک‌ها ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gold flex items-center justify-center text-white text-2xl flex-shrink-0">
                  <FaHospital />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-darkblue dark:text-white">
                    {clinic.clinicName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    کد: {clinic.clinicCode || '-'}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                    clinic.isActive === 1 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {clinic.isActive === 1 ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(clinic.id, clinic.isActive)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={clinic.isActive === 1 ? 'غیرفعال کردن' : 'فعال کردن'}
                >
                  {clinic.isActive === 1 ? (
                    <FaTimesCircle className="text-red-500 text-lg" />
                  ) : (
                    <FaCheckCircle className="text-green-500 text-lg" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(clinic)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="ویرایش"
                >
                  <FaEdit className="text-blue-500 text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(clinic.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="حذف"
                >
                  <FaTrash className="text-red-500 text-lg" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              {clinic.address && (
                <p className="flex items-center gap-2 col-span-2">
                  <FaMapMarkerAlt className="text-gold text-xs" />
                  {clinic.address}
                </p>
              )}
              {clinic.phone && (
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gold text-xs" />
                  {clinic.phone}
                </p>
              )}
              {clinic.mobile && (
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gold text-xs" />
                  {clinic.mobile}
                </p>
              )}
              {clinic.email && (
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-gold text-xs" />
                  {clinic.email}
                </p>
              )}
              {clinic.website && (
                <p className="flex items-center gap-2">
                  <FaGlobe className="text-gold text-xs" />
                  {clinic.website}
                </p>
              )}
              {clinic.managerName && (
                <p className="flex items-center gap-2 col-span-2">
                  <FaUser className="text-gold text-xs" />
                  مدیر: {clinic.managerName} {clinic.managerPhone && `(${clinic.managerPhone})`}
                </p>
              )}
            </div>

            {clinic.description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                {clinic.description}
              </p>
            )}

            <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-2">
              <span>تاریخ ایجاد: {formatDate(clinic.createdAt)}</span>
              {clinic.updatedAt && clinic.updatedAt !== clinic.createdAt && (
                <span className="mr-3">| آخرین ویرایش: {formatDate(clinic.updatedAt)}</span>
              )}
            </div>
          </div>
        ))}

        {clinics.length === 0 && (
          <div className="col-span-2 card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">🏥</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ کلینیکی ثبت نشده است</p>
            <p className="text-sm text-gray-400 mt-2">برای افزودن کلینیک جدید، روی دکمه "کلینیک جدید" کلیک کنید</p>
          </div>
        )}
      </div>

      {/* ===== مودال فرم کلینیک ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-darkblue dark:text-white">
                {editingClinic ? 'ویرایش کلینیک' : 'کلینیک جدید'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingClinic(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500 text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    نام کلینیک *
                  </label>
                  <input
                    type="text"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.clinicName || ''}
                    onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                    required
                    placeholder="مثال: کلینیک زیبایی"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    کد کلینیک
                  </label>
                  <input
                    type="text"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.clinicCode || ''}
                    onChange={(e) => setFormData({...formData, clinicCode: e.target.value})}
                    placeholder="مثال: CLINIC001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  <FaMapMarkerAlt className="inline ml-1 text-gold" />
                  آدرس
                </label>
                <input
                  type="text"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="آدرس کامل کلینیک"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    <FaPhone className="inline ml-1 text-gold" />
                    تلفن
                  </label>
                  <input
                    type="text"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="مثال: ۰۲۱-۱۲۳۴۵۶۷۸"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    <FaPhone className="inline ml-1 text-gold" />
                    همراه
                  </label>
                  <input
                    type="text"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    <FaEnvelope className="inline ml-1 text-gold" />
                    ایمیل
                  </label>
                  <input
                    type="email"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="info@clinic.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    <FaGlobe className="inline ml-1 text-gold" />
                    وبسایت
                  </label>
                  <input
                    type="text"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="www.clinic.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    <FaUser className="inline ml-1 text-gold" />
                    نام مدیر
                  </label>
                  <input
                    type="text"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.managerName || ''}
                    onChange={(e) => setFormData({...formData, managerName: e.target.value})}
                    placeholder="نام مدیر کلینیک"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    <FaPhone className="inline ml-1 text-gold" />
                    تلفن مدیر
                  </label>
                  <input
                    type="text"
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formData.managerPhone || ''}
                    onChange={(e) => setFormData({...formData, managerPhone: e.target.value})}
                    placeholder="تلفن مدیر کلینیک"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  توضیحات
                </label>
                <textarea
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="توضیحات درباره کلینیک..."
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-darkblue dark:text-white">
                  وضعیت:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={formData.isActive === 1}
                      onChange={() => setFormData({...formData, isActive: 1})}
                    />
                    فعال
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={formData.isActive === 0}
                      onChange={() => setFormData({...formData, isActive: 0})}
                    />
                    غیرفعال
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {editingClinic ? 'بروزرسانی' : 'ایجاد'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingClinic(null)
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaTimes />
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}