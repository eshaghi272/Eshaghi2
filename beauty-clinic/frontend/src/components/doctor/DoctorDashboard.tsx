// Path: frontend/src/components/doctor/DoctorDashboard.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { formatPersianDate, getTodayPersian } from '../../utils/persianDate'
import { 
  FaCalendarCheck, 
  FaClock, 
  FaUsers, 
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserMd,
  FaSyringe,
  FaMoneyBillWave,
  FaPlus,
  FaBell,
  FaSpinner
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface Appointment {
  id: number
  patientId: number
  doctorId: number
  serviceId: number
  fdate: string
  appointmentTime: string
  status: string
  notes: string | null
  patientName?: string
  doctorName?: string
  serviceName?: string
}

interface Stats {
  total: number
  confirmed: number
  pending: number
  completed: number
  cancelled: number
  today: number
  upcoming: number
}

export default function DoctorDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    upcoming: 0
  })
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    // بررسی نقش کاربر
    if (user && user.role !== 'doctor') {
      toast.error('دسترسی غیرمجاز - فقط پزشکان')
      window.location.href = '/dashboard'
      return
    }
    fetchAppointments()
  }, [])

  useEffect(() => {
    if (appointments.length > 0) {
      calculateStats()
    }
  }, [appointments])

  const fetchAppointments = async () => {
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

      // ===== دریافت نوبت‌های پزشک از API =====
      const response = await axios.get('/api/v1/appointments', {
        params: { doctorId: user?.id }
      })

      setAppointments(response.data || [])
      
    } catch (error: any) {
      console.error('Error fetching appointments:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        logout()
        return
      }
      
      if (error.response?.status === 403) {
        setError('شما دسترسی به نوبت‌ها ندارید')
        toast.error('دسترسی غیرمجاز')
        return
      }
      
      setError('خطا در دریافت نوبت‌ها')
      toast.error('خطا در دریافت نوبت‌ها')
      
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const today = getTodayPersian()
    
    // محاسبه آمار از داده‌های واقعی
    const statsData: Stats = {
      total: appointments.length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      today: appointments.filter(a => a.fdate === today).length,
      upcoming: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length
    }
    setStats(statsData)

    // نوبت‌های امروز
    const todayList = appointments.filter(a => a.fdate === today)
    setTodayAppointments(todayList)

    // نوبت‌های پیش‌رو (حداکثر 5 مورد)
    const upcoming = appointments
      .filter(a => a.status === 'confirmed' || a.status === 'pending')
      .sort((a, b) => parseInt(a.fdate) - parseInt(b.fdate))
      .slice(0, 5)
    setUpcomingAppointments(upcoming)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
    const labels: Record<string, string> = {
      confirmed: 'تایید شده',
      pending: 'در انتظار',
      completed: 'انجام شده',
      cancelled: 'لغو شده'
    }
    return { 
      style: styles[status] || styles.pending, 
      label: labels[status] || status 
    }
  }

  const updateAppointmentStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/api/v1/appointments/${id}`, { status })
      toast.success('وضعیت نوبت با موفقیت تغییر یافت')
      fetchAppointments()
    } catch (error: any) {
      console.error('Error updating appointment:', error)
      toast.error('خطا در تغییر وضعیت نوبت')
    }
  }

  const quickActions = [
    { icon: <FaCalendarAlt />, label: 'نوبت‌های امروز', link: '/doctor/appointments', color: 'bg-gold' },
    { icon: <FaUserMd />, label: 'بیماران', link: '/doctor/patients', color: 'bg-blue-500' },
    { icon: <FaSyringe />, label: 'ثبت درمان', link: '/doctor/register-treatment', color: 'bg-purple-500' },
    { icon: <FaChartLine />, label: 'آمار', link: '/doctor/stats', color: 'bg-green-500' }
  ]

  if (loading) {
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">
              خوش آمدید، {user?.fullName || 'دکتر'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              امروز {new Date().toLocaleDateString('fa-IR')}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchAppointments}
              className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : '🔄'}
              بروزرسانی
            </button>
            <Link to="/doctor/appointments" className="btn-primary flex items-center gap-2">
              <FaCalendarAlt />
              مدیریت نوبت‌ها
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchAppointments}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-light dark:bg-gold-dark/20 rounded-xl">
              <FaCalendarCheck className="text-gold text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">کل نوبت‌ها</p>
              <p className="text-2xl font-bold text-darkblue dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">تایید شده</p>
              <p className="text-2xl font-bold text-darkblue dark:text-white">{stats.confirmed}</p>
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <FaClock className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">در انتظار</p>
              <p className="text-2xl font-bold text-darkblue dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FaChartLine className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">انجام شده</p>
              <p className="text-2xl font-bold text-darkblue dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-gray-800 bg-gold-light/20 dark:bg-gold-dark/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">نوبت‌های امروز</p>
          <p className="text-2xl font-bold text-gold">{stats.today}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-blue-50 dark:bg-blue-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">نوبت‌های آینده</p>
          <p className="text-2xl font-bold text-blue-500">{stats.upcoming}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">لغو شده</p>
          <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-purple-50 dark:bg-purple-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">درصد تکمیل</p>
          <p className="text-2xl font-bold text-purple-500">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="card dark:bg-gray-800 hover:shadow-medium transition-all duration-300 text-center group p-4"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 text-white text-xl group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <p className="text-sm font-medium text-darkblue dark:text-white">{action.label}</p>
          </Link>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-darkblue dark:text-white">
              <FaClock className="inline ml-2 text-gold" />
              نوبت‌های امروز
            </h3>
            <Link to="/doctor/appointments" className="text-gold hover:underline text-sm">
              مشاهده همه
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">هیچ نوبتی برای امروز ندارید</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((app) => {
                const { style, label } = getStatusBadge(app.status)
                return (
                  <div key={app.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium text-darkblue dark:text-white">
                        {app.patientName || 'بیمار'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app.serviceName || 'خدمت'} - {app.appointmentTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
                        {label}
                      </span>
                      {app.status === 'pending' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                          className="btn-primary text-xs py-1 px-2"
                        >
                          تایید
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="card dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-darkblue dark:text-white">
              <FaCalendarAlt className="inline ml-2 text-gold" />
              نوبت‌های پیش‌رو
            </h3>
            <Link to="/doctor/appointments" className="text-gold hover:underline text-sm">
              مشاهده همه
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">هیچ نوبت پیش‌رویی ندارید</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((app) => {
                const { style, label } = getStatusBadge(app.status)
                return (
                  <div key={app.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium text-darkblue dark:text-white">
                        {app.patientName || 'بیمار'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app.serviceName || 'خدمت'} - {formatPersianDate(app.fdate)}
                      </p>
                      <p className="text-xs text-gray-400">ساعت: {app.appointmentTime}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-gold-light/30 to-gold-light/10">
          <h4 className="font-bold text-darkblue dark:text-white mb-2">💡 نکته</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            برای مدیریت نوبت‌ها، روی دکمه "مدیریت نوبت‌ها" کلیک کنید.
          </p>
        </div>
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-blue-50/30 to-blue-50/10 dark:from-blue-900/20">
          <h4 className="font-bold text-darkblue dark:text-white mb-2">📌 یادآوری</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            نوبت‌های در انتظار را تایید کنید تا بیماران از وضعیت نوبت خود مطلع شوند.
          </p>
        </div>
      </div>
    </div>
  )
}