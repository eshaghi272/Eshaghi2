// Path: frontend/src/components/patient/Appointments.tsx
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { AuthContext } from '../../context/AuthContext'
import { formatPersianDate } from '../../utils/persianDate'
import { FaCheckCircle, FaClock, FaTimesCircle, FaCalendarPlus } from 'react-icons/fa'

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

export default function PatientAppointments() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('access_token')
      if (!token) {
        toast.error('لطفاً وارد سیستم شوید')
        return
      }

      // دریافت نوبت‌های بیمار
      const response = await axios.get('/api/v1/appointments', {
        params: { patientId: user?.id }
      })

      setAppointments(response.data)
    } catch (error: any) {
      console.error('Error fetching appointments:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        return
      }
      
      setError('خطا در دریافت نوبت‌ها')
      toast.error('خطا در دریافت نوبت‌ها')
      
      // استفاده از داده‌های Mock در صورت خطا
      setAppointments([
        {
          id: 1,
          patientId: user?.id || 1,
          doctorId: 1,
          serviceId: 1,
          fdate: '14030515',
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
          fdate: '14030520',
          appointmentTime: '14:30',
          status: 'pending',
          notes: 'یادآوری',
          patientName: user?.fullName || 'نامشخص',
          doctorName: 'دکتر سارا احمدی',
          serviceName: 'فیلر'
        }
      ])
    } finally {
      setLoading(false)
    }
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
        return <FaCheckCircle className="text-green-500 text-lg" />
      case 'pending':
        return <FaClock className="text-yellow-500 text-lg" />
      case 'completed':
        return <FaCheckCircle className="text-blue-500 text-lg" />
      case 'cancelled':
        return <FaTimesCircle className="text-red-500 text-lg" />
      default:
        return <FaClock className="text-gray-500 text-lg" />
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

  const filters = [
    { value: 'all', label: 'همه' },
    { value: 'confirmed', label: '✅ تایید شده' },
    { value: 'pending', label: '⏳ در انتظار' },
    { value: 'completed', label: '✔️ انجام شده' },
    { value: 'cancelled', label: '❌ لغو شده' }
  ]

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  if (loading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری نوبت‌ها...</p>
          </div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">نوبت‌های من</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {appointments.length} نوبت ثبت شده
            </p>
          </div>
          <button 
            onClick={() => navigate('/book-appointment')}
            className="btn-primary flex items-center gap-2"
          >
            <FaCalendarPlus />
            رزرو نوبت جدید
          </button>
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

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                filter === f.value
                  ? 'bg-gold text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              {filter === 'all' ? 'هیچ نوبتی ثبت نشده است' : 'هیچ نوبتی با این وضعیت وجود ندارد'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              برای رزرو نوبت جدید روی دکمه "رزرو نوبت جدید" کلیک کنید
            </p>
            <button 
              onClick={() => navigate('/book-appointment')}
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              <FaCalendarPlus />
              رزرو نوبت
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((app) => {
              const { style, label } = getStatusBadge(app.status)
              return (
                <div key={app.id} className="card dark:bg-gray-800 hover:shadow-medium transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(app.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-darkblue dark:text-white">
                            {formatPersianDate(app.fdate)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ⏰ {app.appointmentTime}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${style}`}>
                            {label}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            💊 خدمت: <span className="font-medium text-darkblue dark:text-white">{app.serviceName || 'نامشخص'}</span>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            👨‍⚕️ پزشک: <span className="font-medium text-darkblue dark:text-white">{app.doctorName || 'نامشخص'}</span>
                          </p>
                        </div>
                        {app.notes && (
                          <p className="text-xs text-gray-400 mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                            📝 {app.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    {app.status !== 'cancelled' && app.status !== 'completed' && (
                      <button
                        onClick={() => cancelAppointment(app.id)}
                        className="btn-danger text-sm py-2 px-4 whitespace-nowrap"
                      >
                        لغو نوبت
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    
  )
}