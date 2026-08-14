// Path: frontend/src/components/patient/Dashboard.tsx
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { NotificationContext } from '../../context/NotificationContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { formatPersianDate, getTodayPersian } from '../../utils/persianDate'
import { 
  FaCalendarCheck, 
  FaClock, 
  FaUsers, 
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaBell,
  FaUserMd,
  FaSyringe,
  FaMoneyBillWave
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
  createdAt?: string
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

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const { addNotification } = useContext(NotificationContext)
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
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])

  useEffect(() => {
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
        return
      }

      // دریافت نوبت‌های بیمار از API
      const response = await axios.get('/api/v1/appointments', {
        params: { patientId: user?.id }
      })

      setAppointments(response.data)
      
      // نمایش نوتیفیکیشن خوش‌آمدید
      addNotification({
        title: 'خوش آمدید',
        message: `سلام ${user?.fullName || 'کاربر'}، به داشبورد خود خوش آمدید`,
        type: 'success'
      })
    } catch (error: any) {
      console.error('Error fetching appointments:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        return
      }
      
      setError('خطا در دریافت نوبت‌ها')
      toast.error('خطا در دریافت نوبت‌ها')
      
      // استفاده از داده‌های Mock در صورت خطا
      setAppointments(getMockAppointments())
    } finally {
      setLoading(false)
    }
  }

  const getMockAppointments = (): Appointment[] => {
    const today = getTodayPersian()
    
    return [
      {
        id: 1,
        patientId: user?.id || 1,
        doctorId: 1,
        serviceId: 1,
        fdate: today,
        appointmentTime: '10:00',
        status: 'confirmed',
        notes: null,
        patientName: user?.fullName || 'نامشخص',
        doctorName: 'دکتر علی محمدی',
        serviceName: 'بوتاکس'
      },
      {
        id: 2,
        patientId: user?.id || 1,
        doctorId: 2,
        serviceId: 2,
        fdate: today,
        appointmentTime: '14:30',
        status: 'pending',
        notes: 'یادآوری',
        patientName: user?.fullName || 'نامشخص',
        doctorName: 'دکتر سارا احمدی',
        serviceName: 'فیلر'
      },
      {
        id: 3,
        patientId: user?.id || 1,
        doctorId: 3,
        serviceId: 3,
        fdate: '14030515',
        appointmentTime: '09:00',
        status: 'confirmed',
        notes: null,
        patientName: user?.fullName || 'نامشخص',
        doctorName: 'دکتر رضا کریمی',
        serviceName: 'لیزر موهای زائد'
      },
      {
        id: 4,
        patientId: user?.id || 1,
        doctorId: 4,
        serviceId: 4,
        fdate: '14030520',
        appointmentTime: '16:00',
        status: 'completed',
        notes: 'انجام شد',
        patientName: user?.fullName || 'نامشخص',
        doctorName: 'دکتر نرگس حسینی',
        serviceName: 'مزوتراپی'
      },
      {
        id: 5,
        patientId: user?.id || 1,
        doctorId: 1,
        serviceId: 6,
        fdate: '14030425',
        appointmentTime: '11:30',
        status: 'cancelled',
        notes: 'لغو شد',
        patientName: user?.fullName || 'نامشخص',
        doctorName: 'دکتر علی محمدی',
        serviceName: 'هایفو'
      }
    ]
  }

  const calculateStats = () => {
    const today = getTodayPersian()
    const stats: Stats = {
      total: appointments.length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      today: appointments.filter(a => a.fdate === today).length,
      upcoming: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length
    }
    setStats(stats)

    // دریافت نوبت‌های پیش‌رو
    const upcoming = appointments
      .filter(a => a.status === 'confirmed' || a.status === 'pending')
      .sort((a, b) => parseInt(a.fdate) - parseInt(b.fdate))
      .slice(0, 5)
    setUpcomingAppointments(upcoming)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-600 text-white dark:bg-green-700',
      pending: 'bg-yellow-500 text-white dark:bg-yellow-600',
      completed: 'bg-blue-600 text-white dark:bg-blue-700',
      cancelled: 'bg-red-600 text-white dark:bg-red-700'
    }
    const labels = {
      confirmed: '✅ تایید شده',
      pending: '⏳ در انتظار',
      completed: '✔️ انجام شده',
      cancelled: '❌ لغو شده'
    }
    return { 
      style: styles[status as keyof typeof styles] || styles.pending, 
      label: labels[status as keyof typeof labels] || status 
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />
      case 'pending':
        return <FaClock className="text-yellow-500" />
      case 'completed':
        return <FaCheckCircle className="text-blue-500" />
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />
      default:
        return <FaClock className="text-gray-500" />
    }
  }

  const cancelAppointment = async (id: number) => {
    if (!confirm('آیا از لغو این نوبت مطمئن هستید؟')) return

    try {
      await axios.delete(`/api/v1/appointments/${id}`)
      toast.success('نوبت با موفقیت لغو شد')
      
      // بروزرسانی لیست نوبت‌ها
      setAppointments(prev => 
        prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
      )
    } catch (error: any) {
      console.error('Error cancelling appointment:', error)
      toast.error(error.response?.data?.message || 'خطا در لغو نوبت')
    }
  }

  // Quick actions
  const quickActions = [
    { icon: <FaCalendarAlt />, label: 'رزرو نوبت', link: '/book-appointment', color: 'bg-gold' },
    { icon: <FaUserMd />, label: 'پزشکان', link: '/doctors', color: 'bg-blue-500' },
    { icon: <FaSyringe />, label: 'خدمات', link: '/services', color: 'bg-purple-500' },
    { icon: <FaBell />, label: 'اعلان‌ها', link: '/notifications', color: 'bg-pink-500' }
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
                خوش آمدید، {user?.fullName || 'کاربر'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                امروز {new Date().toLocaleDateString('fa-IR')}
              </p>
            </div>
            <Link to="/book-appointment" className="btn-primary flex items-center gap-2">
              <FaPlus />
              رزرو نوبت جدید
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchAppointments}
              className="text-sm text-red-600 dark:text-red-400 hover:underline mt-2"
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
              className="card dark:bg-gray-800 hover:shadow-medium transition-all duration-300 text-center group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 text-white text-xl group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <p className="text-sm font-medium text-darkblue dark:text-white">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="card dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-darkblue dark:text-white">
              نوبت‌های پیش‌رو
            </h3>
            <Link to="/appointments" className="text-gold hover:underline text-sm">
              مشاهده همه
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">هیچ نوبت پیش‌رویی ندارید</p>
              <Link to="/book-appointment" className="btn-primary mt-4 inline-block">
                رزرو نوبت جدید
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((app) => {
                const { style, label } = getStatusBadge(app.status)
                return (
                  <div key={app.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-0">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-darkblue dark:text-white">
                            {formatPersianDate(app.fdate)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ساعت: {app.appointmentTime}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
                            {label}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {app.serviceName || 'خدمت نامشخص'} - {app.doctorName || 'پزشک نامشخص'}
                        </div>
                        {app.notes && (
                          <p className="text-xs text-gray-400 mt-1">📝 {app.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      {app.status !== 'cancelled' && app.status !== 'completed' && (
                        <button
                          onClick={() => cancelAppointment(app.id)}
                          className="btn-danger text-xs py-1 px-3 flex-1 md:flex-none text-center"
                        >
                          لغو
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card dark:bg-gray-800 bg-gradient-to-r from-gold-light/30 to-gold-light/10">
            <h4 className="font-bold text-darkblue dark:text-white mb-2">💡 نکته</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              برای رزرو نوبت جدید، روی دکمه "رزرو نوبت جدید" کلیک کنید.
            </p>
          </div>
          <div className="card dark:bg-gray-800 bg-gradient-to-r from-blue-50/30 to-blue-50/10 dark:from-blue-900/20">
            <h4 className="font-bold text-darkblue dark:text-white mb-2">📌 یادآوری</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              لطفاً ۱۵ دقیقه قبل از زمان نوبت در کلینیک حضور داشته باشید.
            </p>
          </div>
        </div>
      </div>
    
  )
}