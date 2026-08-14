// Path: frontend/src/components/patient/PatientDashboard.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  FaCalendarCheck, 
  FaMoneyBillWave, 
  FaSyringe, 
  FaClock,
  FaSearch,
  FaCalendarAlt,
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaClock as FaClockIcon,
  FaSpinner,
  FaUserMd,
  FaHospital
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

// ===== انواع داده =====
interface PatientInfo {
  id: number
  fullName: string
  mobile: string
  email: string
  nationalCode: string
  gender: string
  birthDate: string
  bloodType: string
  address: string
  allergies: string
  createdAt: string
}

interface PatientAppointment {
  id: number
  doctorName: string
  doctorSpecialty: string
  serviceName: string
  servicePrice: number
  fdate: string
  appointmentTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
}

interface PatientTreatment {
  id: number
  serviceName: string
  doctorName: string
  treatmentDate: string
  price: number
  discountAmount: number
  finalPrice: number
  status: 'completed' | 'pending' | 'cancelled'
  description?: string
}

interface DashboardStats {
  totalAppointments: number
  upcomingAppointments: number
  completedAppointments: number
  totalTreatments: number
  totalSpent: number
  lastVisitDate: string
  pendingAppointments: number
}

export default function PatientDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [appointments, setAppointments] = useState<PatientAppointment[]>([])
  const [treatments, setTreatments] = useState<PatientTreatment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // بررسی نقش کاربر
    if (user && user.role !== 'patient') {
      toast.error('دسترسی غیرمجاز - فقط بیماران')
      window.location.href = '/dashboard'
      return
    }
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
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

      // ===== دریافت اطلاعات از APIهای جدید داشبورد =====
      const [profileRes, appointmentsRes, treatmentsRes, statsRes] = await Promise.all([
        axios.get('/api/v1/dashboard/patient/profile'),
        axios.get('/api/v1/dashboard/patient/appointments'),
        axios.get('/api/v1/dashboard/patient/treatments'),
        axios.get('/api/v1/dashboard/patient/stats')
      ])

      // اطلاعات پروفایل بیمار
      setPatientInfo(profileRes.data)

      // نوبت‌ها
      const appointmentsData = appointmentsRes.data || []
      setAppointments(appointmentsData)

      // درمان‌ها
      const treatmentsData = treatmentsRes.data || []
      setTreatments(treatmentsData)

      // آمار از سرور
      const statsData = statsRes.data
      setStats({
        totalAppointments: statsData.totalAppointments || 0,
        upcomingAppointments: statsData.upcomingAppointments || 0,
        completedAppointments: statsData.completedAppointments || 0,
        totalTreatments: statsData.totalTreatments || 0,
        totalSpent: statsData.totalSpent || 0,
        lastVisitDate: statsData.lastVisitDate || 'ندارد',
        pendingAppointments: statsData.pendingAppointments || 0
      })

    } catch (error: any) {
      console.error('Error fetching patient dashboard:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        logout()
        return
      }
      
      if (error.response?.status === 403) {
        toast.error('شما دسترسی به این بخش ندارید')
        logout()
        return
      }
      
      if (error.response?.status === 404) {
        setError('اطلاعات شما در سیستم یافت نشد. لطفاً با پشتیبانی تماس بگیرید.')
        toast.error('اطلاعات کاربری یافت نشد')
        return
      }
      
      setError('خطا در دریافت اطلاعات داشبورد')
      toast.error('خطا در دریافت اطلاعات')
      
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
      completed: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      cancelled: 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
    }
    const labels: Record<string, string> = {
      confirmed: '✅ تایید شده',
      pending: '⏳ در انتظار',
      completed: '✔️ انجام شده',
      cancelled: '❌ لغو شده'
    }
    return { 
      style: styles[status] || styles.pending, 
      label: labels[status] || status 
    }
  }

  const formatPrice = (price: number) => {
    if (!price && price !== 0) return '۰'
    return price.toLocaleString('fa-IR')
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    try {
      return new Date(date).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return date
    }
  }

  const filteredAppointments = appointments.filter(app =>
    app.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری اطلاعات شما...</p>
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
            <FaUserCircle className="text-gold" />
            داشبورد بیمار
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <FaClock className="text-gold text-xs" />
            خوش آمدید، {patientInfo?.fullName || user?.fullName || 'کاربر گرامی'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchDashboardData}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : '🔄'}
            بروزرسانی
          </button>
          <Link to="/patient/book-appointment" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <FaCalendarAlt />
            رزرو نوبت جدید
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* ===== پروفایل بیمار ===== */}
      {patientInfo && (
        <div className="card dark:bg-gray-800 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {patientInfo.fullName?.charAt(0) || 'P'}
            </div>
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-2xl font-bold text-darkblue dark:text-white">
                {patientInfo.fullName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm">
                {patientInfo.nationalCode && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaIdCard className="text-gold text-xs" />
                    کد ملی: {patientInfo.nationalCode}
                  </p>
                )}
                {patientInfo.mobile && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaPhone className="text-gold text-xs" />
                    {patientInfo.mobile}
                  </p>
                )}
                {patientInfo.email && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaEnvelope className="text-gold text-xs" />
                    {patientInfo.email}
                  </p>
                )}
                {patientInfo.gender && (
                  <p className="text-gray-600 dark:text-gray-400">
                    جنسیت: {patientInfo.gender === 'male' ? 'آقا' : 'خانم'}
                  </p>
                )}
                {patientInfo.birthDate && (
                  <p className="text-gray-600 dark:text-gray-400">
                    تاریخ تولد: {formatDate(patientInfo.birthDate)}
                  </p>
                )}
                {patientInfo.bloodType && (
                  <p className="text-gray-600 dark:text-gray-400">
                    گروه خونی: {patientInfo.bloodType}
                  </p>
                )}
              </div>
              {patientInfo.allergies && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
                  <span className="font-medium text-yellow-700 dark:text-yellow-400">⚠️ حساسیت‌ها: </span>
                  <span className="text-gray-600 dark:text-gray-300">{patientInfo.allergies}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== کارت‌های آمار ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">تعداد نوبت‌ها</p>
              <p className="text-2xl font-bold text-darkblue dark:text-white">
                {stats?.totalAppointments || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FaCalendarCheck className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">نوبت‌های آینده</p>
              <p className="text-2xl font-bold text-green-500">
                {stats?.upcomingAppointments || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FaClockIcon className="text-green-500 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">درمان‌های انجام شده</p>
              <p className="text-2xl font-bold text-purple-500">
                {stats?.completedAppointments || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <FaSyringe className="text-purple-500 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">مجموع هزینه</p>
              <p className="text-xl font-bold text-gold">
                {formatPrice(stats?.totalSpent || 0)} تومان
              </p>
            </div>
            <div className="p-3 bg-gold-light dark:bg-gold-dark/20 rounded-xl">
              <FaMoneyBillWave className="text-gold text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== اطلاعات تکمیلی ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-gray-800 bg-yellow-50 dark:bg-yellow-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">⏳ در انتظار تایید</p>
          <p className="text-2xl font-bold text-yellow-500">{stats?.pendingAppointments || 0}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-green-50 dark:bg-green-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">✅ نوبت‌های تکمیل شده</p>
          <p className="text-2xl font-bold text-green-500">{stats?.completedAppointments || 0}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-purple-50 dark:bg-purple-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">🏥 تعداد درمان‌ها</p>
          <p className="text-2xl font-bold text-purple-500">{stats?.totalTreatments || 0}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-gold-light/10 dark:bg-gold-dark/5">
          <p className="text-sm text-gray-500 dark:text-gray-400">📅 آخرین مراجعه</p>
          <p className="text-lg font-bold text-gold">{stats?.lastVisitDate || 'ندارد'}</p>
        </div>
      </div>

      {/* ===== نوبت‌های اخیر ===== */}
      <div className="card dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="text-lg font-bold text-darkblue dark:text-white flex items-center gap-2">
            <FaCalendarAlt className="text-gold" />
            نوبت‌های من
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="جستجو..."
                className="input-field text-sm py-1 px-3 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            </div>
            <Link to="/patient/appointments" className="text-gold hover:underline text-sm whitespace-nowrap">
              مشاهده همه
            </Link>
          </div>
        </div>
        
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-500 dark:text-gray-400">هیچ نوبتی ثبت نشده است</p>
            <Link to="/patient/book-appointment" className="text-gold hover:underline text-sm mt-2 inline-block">
              رزرو نوبت جدید
            </Link>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredAppointments.slice(0, 5).map((app) => {
              const { style, label } = getStatusBadge(app.status)
              return (
                <div key={app.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b dark:border-gray-700 last:border-0">
                  <div className="flex-1 min-w-[150px]">
                    <p className="font-medium text-darkblue dark:text-white">{app.serviceName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {app.doctorName} - {app.doctorSpecialty}
                    </p>
                    <p className="text-xs text-gray-400">
                      📅 {formatDate(app.fdate)} ⏰ {app.appointmentTime}
                    </p>
                    {app.servicePrice > 0 && (
                      <p className="text-xs text-gold">
                        💰 {formatPrice(app.servicePrice)} تومان
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${style}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ===== درمان‌های اخیر ===== */}
      {treatments.length > 0 && (
        <div className="card dark:bg-gray-800 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-darkblue dark:text-white flex items-center gap-2">
              <FaSyringe className="text-gold" />
              درمان‌های انجام شده
            </h3>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {treatments.slice(0, 5).map((treatment) => {
              const { style, label } = getStatusBadge(treatment.status)
              return (
                <div key={treatment.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b dark:border-gray-700 last:border-0">
                  <div className="flex-1 min-w-[150px]">
                    <p className="font-medium text-darkblue dark:text-white">{treatment.serviceName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      پزشک: {treatment.doctorName}
                    </p>
                    <p className="text-xs text-gray-400">
                      📅 {formatDate(treatment.treatmentDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">{formatPrice(treatment.finalPrice)} تومان</p>
                    {treatment.discountAmount > 0 && (
                      <p className="text-xs text-red-400">تخفیف: {formatPrice(treatment.discountAmount)}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${style}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== نکات مفید ===== */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-gold-light/30 to-gold-light/10">
          <h4 className="font-bold text-darkblue dark:text-white mb-2">💡 نکته</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            برای رزرو نوبت جدید، روی دکمه "رزرو نوبت جدید" کلیک کنید.
          </p>
        </div>
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-blue-50/30 to-blue-50/10 dark:from-blue-900/20">
          <h4 className="font-bold text-darkblue dark:text-white mb-2">📌 یادآوری</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            نوبت‌های در انتظار تایید را پیگیری کنید و در صورت نیاز با کلینیک تماس بگیرید.
          </p>
        </div>
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-green-50/30 to-green-50/10 dark:from-green-900/20">
          <h4 className="font-bold text-darkblue dark:text-white mb-2">📊 آمار شما</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            تعداد کل نوبت‌ها: {stats?.totalAppointments || 0} | هزینه کل: {formatPrice(stats?.totalSpent || 0)} تومان
          </p>
        </div>
      </div>
    </div>
  )
}