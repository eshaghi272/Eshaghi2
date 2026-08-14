// Path: frontend/src/components/admin/AdminAppointments.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { formatPersianDate } from '../../utils/persianDate'
import { FaSearch, FaTimes, FaCheck, FaClock, FaUserMd, FaUser, FaSyringe, FaFilter } from 'react-icons/fa'
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

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  })

  useEffect(() => {
    fetchAppointments()
    fetchStats()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/appointments')
      setAppointments(response.data)
    } catch (error: any) {
      console.error('Error fetching appointments:', error)
      toast.error('خطا در دریافت نوبت‌ها')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/v1/dashboard/appointments')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/api/v1/appointments/${id}`, { status })
      toast.success('وضعیت نوبت تغییر یافت')
      fetchAppointments()
      fetchStats()
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast.error('خطا در تغییر وضعیت')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
      completed: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      cancelled: 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
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

  const filteredAppointments = appointments.filter(app => {
    const matchSearch =
      app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatus = filterStatus === 'all' || app.status === filterStatus
    const matchDate = filterDate ? app.fdate === filterDate : true

    return matchSearch && matchStatus && matchDate
  })

  const statuses = [
    { value: 'all', label: 'همه' },
    { value: 'pending', label: '⏳ در انتظار' },
    { value: 'confirmed', label: '✅ تایید شده' },
    { value: 'completed', label: '✔️ انجام شده' },
    { value: 'cancelled', label: '❌ لغو شده' }
  ]

  if (loading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">مدیریت نوبت‌ها</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {appointments.length} نوبت ثبت شده
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/receptionist/book-appointment" className="btn-primary text-sm py-2 px-4">
              📅 رزرو نوبت جدید
            </Link>
            <button
              onClick={fetchAppointments}
              className="btn-secondary text-sm py-2 px-4"
            >
              🔄 بروزرسانی
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="card dark:bg-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">کل</p>
            <p className="text-2xl font-bold text-darkblue dark:text-white">{stats.total}</p>
          </div>
          <div className="card dark:bg-gray-800 text-center border-2 border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">در انتظار</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="card dark:bg-gray-800 text-center border-2 border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">تایید شده</p>
            <p className="text-2xl font-bold text-green-500">{stats.confirmed}</p>
          </div>
          <div className="card dark:bg-gray-800 text-center border-2 border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">انجام شده</p>
            <p className="text-2xl font-bold text-blue-500">{stats.completed}</p>
          </div>
          <div className="card dark:bg-gray-800 text-center border-2 border-red-200 dark:border-red-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">لغو شده</p>
            <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="جستجو بر اساس بیمار، پزشک یا خدمت..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            className="input-field max-w-[180px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="فیلتر تاریخ (مثال: 14030515)"
            className="input-field max-w-[180px]"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterStatus('all')
              setFilterDate('')
            }}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
          >
            <FaTimes />
            پاک کردن
          </button>
        </div>

        {/* Appointments Table */}
        {filteredAppointments.length === 0 ? (
          <div className="card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ نوبتی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">بیمار</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">پزشک</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">خدمت</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">تاریخ و ساعت</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">وضعیت</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => {
                  const { style, label } = getStatusBadge(app.status)
                  return (
                    <tr key={app.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gold" />
                          <span className="font-medium text-darkblue dark:text-white">
                            {app.patientName || 'نامشخص'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FaUserMd className="text-blue-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {app.doctorName || 'نامشخص'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FaSyringe className="text-purple-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {app.serviceName || 'نامشخص'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-darkblue dark:text-white">
                          {formatPersianDate(app.fdate)}
                        </p>
                        <p className="text-xs text-gray-400">{app.appointmentTime}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
                          {label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(app.id, 'confirmed')}
                                className="btn-primary text-xs py-1 px-3 flex items-center gap-1"
                              >
                                <FaCheck className="text-sm" />
                                تایید
                              </button>
                              <button
                                onClick={() => updateStatus(app.id, 'cancelled')}
                                className="btn-danger text-xs py-1 px-3 flex items-center gap-1"
                              >
                                <FaTimes className="text-sm" />
                                لغو
                              </button>
                            </>
                          )}
                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => updateStatus(app.id, 'completed')}
                              className="btn-primary text-xs py-1 px-3 flex items-center gap-1"
                            >
                              <FaCheck className="text-sm" />
                              انجام شد
                            </button>
                          )}
                          {app.status === 'cancelled' && (
                            <span className="text-red-500 text-xs font-medium">لغو شده</span>
                          )}
                          {app.status === 'completed' && (
                            <span className="text-blue-500 text-xs font-medium">انجام شده</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    
  )
}