// Path: frontend/src/components/doctor/Patients.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  FaPhone, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaSearch,
  FaSpinner,
  FaUserMd,
  FaHistory,
  FaUsers,
  FaUserCheck,
  FaUserCircle
} from 'react-icons/fa'

interface Patient {
  id: number
  fullName: string
  nationalCode: string
  mobile: string
  email: string | null
  appointmentCount: number
  lastVisit: string | null
  lastVisitDate?: string | null
}

export default function DoctorPatients() {
  const { user, logout } = useContext(AuthContext)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // بررسی نقش کاربر
    if (user && user.role !== 'doctor') {
      toast.error('دسترسی غیرمجاز - فقط پزشکان')
      window.location.href = '/dashboard'
      return
    }
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
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

      // ===== استفاده از مسیر اختصاصی پزشک =====
      const response = await axios.get('/api/v1/doctors/patients')
      
      const patientsData = response.data || []
      
      // اضافه کردن lastVisitDate به داده‌ها
      const patientsWithDate = patientsData.map((p: Patient) => ({
        ...p,
        lastVisitDate: p.lastVisit ? formatPersianDate(p.lastVisit) : null
      }))

      setPatients(patientsWithDate)

    } catch (error: any) {
      console.error('Error fetching patients:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        logout()
        return
      }
      
      if (error.response?.status === 403) {
        setError('شما دسترسی به لیست بیماران ندارید. لطفاً با مدیر سیستم تماس بگیرید.')
        toast.error('دسترسی غیرمجاز')
        return
      }
      
      if (error.response?.status === 404) {
        setError('هیچ بیماری یافت نشد')
        return
      }
      
      setError('خطا در دریافت لیست بیماران')
      toast.error('خطا در دریافت اطلاعات')
      
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(p =>
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.mobile?.includes(searchTerm) ||
    p.nationalCode?.includes(searchTerm) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری لیست بیماران...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-darkblue dark:text-white flex items-center gap-3">
            <FaUserMd className="text-gold" />
            بیماران من
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <FaUsers className="text-gold text-xs" />
            {patients.length} بیمار
            {patients.length > 0 && (
              <span className="text-xs text-green-500 mr-2">
                | {patients.filter(p => p.appointmentCount > 0).length} بیمار فعال
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={fetchPatients}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : '🔄'}
            بروزرسانی
          </button>
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="جستجوی بیمار..."
              className="input-field pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchPatients}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {patients.length === 0 ? (
        <div className="card dark:bg-gray-800 text-center py-16">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchTerm ? 'بیماری با این مشخصات یافت نشد' : 'هیچ بیماری برای شما ثبت نشده است'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {searchTerm ? 'با جستجوی دیگری امتحان کنید' : 'پس از اولین ویزیت، بیماران در اینجا نمایش داده می‌شوند'}
          </p>
        </div>
      ) : (
        <>
          {/* ===== آمار سریع ===== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card dark:bg-gray-800 bg-blue-50 dark:bg-blue-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">تعداد کل بیماران</p>
                  <p className="text-2xl font-bold text-blue-500">{patients.length}</p>
                </div>
                <FaUserCircle className="text-blue-500 text-2xl" />
              </div>
            </div>
            <div className="card dark:bg-gray-800 bg-green-50 dark:bg-green-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">بیماران فعال</p>
                  <p className="text-2xl font-bold text-green-500">
                    {patients.filter(p => p.appointmentCount > 0).length}
                  </p>
                </div>
                <FaUserCheck className="text-green-500 text-2xl" />
              </div>
            </div>
            <div className="card dark:bg-gray-800 bg-purple-50 dark:bg-purple-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">کل نوبت‌ها</p>
                  <p className="text-2xl font-bold text-purple-500">
                    {patients.reduce((sum, p) => sum + p.appointmentCount, 0)}
                  </p>
                </div>
                <FaCalendarAlt className="text-purple-500 text-2xl" />
              </div>
            </div>
            <div className="card dark:bg-gray-800 bg-gold-light/10 dark:bg-gold-dark/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">میانگین نوبت</p>
                  <p className="text-2xl font-bold text-gold">
                    {patients.length > 0 
                      ? (patients.reduce((sum, p) => sum + p.appointmentCount, 0) / patients.length).toFixed(1)
                      : '۰'
                    }
                  </p>
                </div>
                <FaHistory className="text-gold text-2xl" />
              </div>
            </div>
          </div>

          {/* ===== لیست بیماران ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="card dark:bg-gray-800 hover:shadow-medium transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold flex items-center justify-center text-white text-xl font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                    {patient.fullName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-darkblue dark:text-white truncate">
                      {patient.fullName}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <FaPhone className="text-gold text-xs flex-shrink-0" />
                        <span className="truncate">{patient.mobile}</span>
                      </p>
                      {patient.email && (
                        <p className="flex items-center gap-2">
                          <FaEnvelope className="text-gold text-xs flex-shrink-0" />
                          <span className="truncate">{patient.email}</span>
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                          <FaCalendarAlt className="text-gold text-xs" />
                          تعداد نوبت‌ها: {patient.appointmentCount || 0}
                        </span>
                        {patient.lastVisitDate && (
                          <span className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            <FaHistory className="text-gold text-xs" />
                            آخرین ویزیت: {patient.lastVisitDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* ===== تعداد کل ===== */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            نمایش {filteredPatients.length} از {patients.length} بیمار
          </div>
        </>
      )}
    </div>
  )
}

// ===== تابع کمکی برای فرمت تاریخ شمسی =====
function formatPersianDate(date: string): string {
  if (!date || date.length !== 8) return 'ندارد'
  
  const year = date.substring(0, 4)
  const month = parseInt(date.substring(4, 6))
  const day = parseInt(date.substring(6, 8))
  
  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 
    'مرداد', 'شهریور', 'مهر', 'آبان', 
    'آذر', 'دی', 'بهمن', 'اسفند'
  ]
  
  if (month < 1 || month > 12) return date
  
  return `${day} ${monthNames[month - 1]} ${year}`
}