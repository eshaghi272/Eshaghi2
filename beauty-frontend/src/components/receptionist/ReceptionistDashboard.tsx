// Path: frontend/src/components/receptionist/ReceptionistDashboard.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
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
  FaUserPlus,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaUserMd,
  FaSyringe,
  FaMoneyBillWave,
  FaPlus,
  FaBell,
  FaEdit,
  FaTrash
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

export default function ReceptionistDashboard() {
  const { user } = useContext(AuthContext)
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
  const [searchTerm, setSearchTerm] = useState('')

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

      const response = await axios.get('/api/v1/appointments')
      setAppointments(response.data)
    } catch (error: any) {
      console.error('Error fetching appointments:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        return
      }
      
      setError('خطا در دریافت نوبت‌ها')
      toast.error('خطا در دریافت نوبت‌ها')
      
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
        patientId: 6,
        doctorId: 2,
        serviceId: 1,
        fdate: today,
        appointmentTime: '10:00',
        status: 'confirmed',
        notes: null,
        patientName: 'احمد رضایی',
        doctorName: 'دکتر علی محمدی',
        serviceName: 'بوتاکس'
      },
      {
        id: 2,
        patientId: 7,
        doctorId: 3,
        serviceId: 2,
        fdate: today,
        appointmentTime: '14:30',
        status: 'pending',
        notes: 'یادآوری',
        patientName: 'مریم کریمی',
        doctorName: 'دکتر سارا احمدی',
        serviceName: 'فیلر'
      },
      {
        id: 3,
        patientId: 8,
        doctorId: 2,
        serviceId: 3,
        fdate: '14030515',
        appointmentTime: '09:00',
        status: 'confirmed',
        notes: null,
        patientName: 'حسین موسوی',
        doctorName: 'دکتر علی محمدی',
        serviceName: 'لیزر موهای زائد'
      },
      {
        id: 4,
        patientId: 9,
        doctorId: 4,
        serviceId: 4,
        fdate: '14030520',
        appointmentTime: '16:00',
        status: 'completed',
        notes: 'انجام شد',
        patientName: 'زهرا علوی',
        doctorName: 'دکتر نرگس حسینی',
        serviceName: 'مزوتراپی'
      },
      {
        id: 5,
        patientId: 10,
        doctorId: 3,
        serviceId: 6,
        fdate: '14030425',
        appointmentTime: '11:30',
        status: 'cancelled',
        notes: 'لغو شد',
        patientName: 'محمد نادری',
        doctorName: 'دکتر سارا احمدی',
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

    const todayList = appointments.filter(a => a.fdate === today)
    setTodayAppointments(todayList)
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

  const deleteAppointment = async (id: number) => {
    if (!confirm('آیا از حذف این نوبت مطمئن هستید؟')) return
    
    try {
      await axios.delete(`/api/v1/appointments/${id}`)
      toast.success('نوبت با موفقیت حذف شد')
      fetchAppointments()
    } catch (error: any) {
      console.error('Error deleting appointment:', error)
      toast.error('خطا در حذف نوبت')
    }
  }

  const filteredAppointments = appointments.filter(app =>
    app.patientName?.includes(searchTerm) ||
    app.doctorName?.includes(searchTerm) ||
    app.serviceName?.includes(searchTerm) ||
    app.fdate.includes(searchTerm)
  )

  const quickActions = [
    { icon: <FaCalendarAlt />, label: 'رزرو نوبت', link: '/receptionist/book-appointment', color: 'bg-gold' },
    { icon: <FaUserPlus />, label: 'ثبت بیمار', link: '/receptionist/register-patient', color: 'bg-blue-500' },
    { icon: <FaUsers />, label: 'بیماران', link: '/receptionist/patients', color: 'bg-purple-500' },
    { icon: <FaCalendarCheck />, label: 'نوبت‌ها', link: '/receptionist/appointments', color: 'bg-green-500' },
    { icon: <FaCalendarCheck />, label: 'ساعات کاری', link: '/receptionist/doctor-schedule', color: 'bg-green-500' }
  
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
                خوش آمدید، {user?.fullName || 'منشی'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                امروز {new Date().toLocaleDateString('fa-IR')}
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/receptionist/book-appointment" className="btn-primary flex items-center gap-2">
                <FaPlus />
                رزرو نوبت
              </Link>
              <button 
                onClick={fetchAppointments}
                className="btn-secondary text-sm py-2 px-4"
              >
                🔄 بروزرسانی
              </button>
            </div>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
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

        {/* Search & Today's Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search */}
          <div className="card dark:bg-gray-800">
            <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4">
              <FaSearch className="inline ml-2 text-gold" />
              جستجوی نوبت
            </h3>
            <input
              type="text"
              placeholder="جستجو بر اساس نام بیمار، پزشک، خدمت یا تاریخ..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="mt-4 space-y-2">
                {filteredAppointments.slice(0, 5).map((app) => {
                  const { style, label } = getStatusBadge(app.status)
                  return (
                    <div key={app.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-darkblue dark:text-white">{app.patientName}</p>
                        <p className="text-xs text-gray-500">{app.doctorName} - {app.fdate}</p>
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

          {/* Today's Appointments */}
          <div className="card dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-darkblue dark:text-white">
                <FaClock className="inline ml-2 text-gold" />
                نوبت‌های امروز
              </h3>
              <Link to="/receptionist/appointments" className="text-gold hover:underline text-sm">
                مشاهده همه
              </Link>
            </div>

            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">هیچ نوبتی برای امروز ثبت نشده است</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {todayAppointments.map((app) => {
                  const { style, label } = getStatusBadge(app.status)
                  return (
                    <div key={app.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-darkblue dark:text-white">{app.patientName}</p>
                        <p className="text-xs text-gray-500">{app.doctorName} - {app.appointmentTime}</p>
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
              برای رزرو نوبت جدید برای بیمار، روی دکمه "رزرو نوبت" کلیک کنید.
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