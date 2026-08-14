// Path: frontend/src/components/doctor/Appointments.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { formatPersianDate, getTodayPersian } from '../../utils/persianDate'
import { FaCheck, FaTimes, FaClock, FaCalendarAlt, FaUser, FaSyringe } from 'react-icons/fa'

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

export default function DoctorAppointments() {
  const { user } = useContext(AuthContext)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/appointments', {
        params: { doctorId: user?.id }
      })
      setAppointments(response.data)
    } catch (error: any) {
      console.error('Error fetching appointments:', error)
      toast.error('خطا در دریافت نوبت‌ها')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-600 text-white',
      pending: 'bg-yellow-500 text-white',
      completed: 'bg-blue-600 text-white',
      cancelled: 'bg-red-600 text-white'
    }
    const labels = {
      confirmed: 'تایید شده',
      pending: 'در انتظار',
      completed: 'انجام شده',
      cancelled: 'لغو شده'
    }
    return { 
      style: styles[status as keyof typeof styles] || styles.pending, 
      label: labels[status as keyof typeof labels] || status 
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/api/v1/appointments/${id}`, { status })
      toast.success('وضعیت نوبت تغییر یافت')
      fetchAppointments()
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast.error('خطا در تغییر وضعیت')
    }
  }

  const filteredAppointments = appointments.filter(app => {
    if (filter !== 'all' && app.status !== filter) return false
    if (dateFilter && app.fdate !== dateFilter) return false
    return true
  })

  const filters = [
    { value: 'all', label: 'همه' },
    { value: 'pending', label: 'در انتظار' },
    { value: 'confirmed', label: 'تایید شده' },
    { value: 'completed', label: 'انجام شده' },
    { value: 'cancelled', label: 'لغو شده' }
  ]

  if (loading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">مدیریت نوبت‌ها</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {appointments.length} نوبت ثبت شده
            </p>
          </div>
          <button 
            onClick={fetchAppointments}
            className="btn-secondary text-sm py-2 px-4"
          >
            🔄 بروزرسانی
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                filter === f.value
                  ? 'bg-gold text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
          <input
            type="text"
            placeholder="فیلتر تاریخ (مثال: 14030515)"
            className="input-field max-w-[200px] text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-red-500 text-sm hover:underline"
            >
              حذف فیلتر
            </button>
          )}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              هیچ نوبتی با این فیلترها وجود ندارد
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((app) => {
              const { style, label } = getStatusBadge(app.status)
              return (
                <div key={app.id} className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gold-light dark:bg-gold-dark/20 rounded-xl">
                        <FaUser className="text-gold" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-darkblue dark:text-white">
                            {app.patientName || 'بیمار'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gold">
                            {formatPersianDate(app.fdate)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ⏰ {app.appointmentTime}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
                            {label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaSyringe className="text-xs" />
                            {app.serviceName || 'خدمت نامشخص'}
                          </span>
                          {app.notes && (
                            <span className="flex items-center gap-1">
                              📝 {app.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(app.id, 'confirmed')}
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <FaCheck className="text-sm" />
                            تایید
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'cancelled')}
                            className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <FaTimes className="text-sm" />
                            رد
                          </button>
                        </>
                      )}
                      {app.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(app.id, 'completed')}
                          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                        >
                          <FaCheck className="text-sm" />
                          انجام شد
                        </button>
                      )}
                      {app.status === 'cancelled' && (
                        <span className="text-red-500 text-sm font-medium px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          لغو شده
                        </span>
                      )}
                      {app.status === 'completed' && (
                        <span className="text-blue-500 text-sm font-medium px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          انجام شده
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    
  )
}