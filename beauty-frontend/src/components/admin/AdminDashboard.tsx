// Path: frontend/src/components/admin/AdminDashboard.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  FaUsers, 
  FaCalendarCheck, 
  FaMoneyBillWave, 
  FaChartBar, 
  FaBoxes, 
  FaClipboardList, 
  FaSyringe, 
  FaBell,
  FaUserMd,
  FaStethoscope,
  FaHospital,
  FaPlus,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaFileInvoice,
  FaUserPlus,
  FaCalendarAlt,
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaUser,
  FaBuilding,
  FaChartPie
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  monthlyRevenue: number
  totalDoctors: number
  totalServices: number
  pendingAppointments: number
  month: number
  year: number
  weeklyGrowth?: number
  patientGrowth?: number
  revenueGrowth?: number
}

interface Appointment {
  id: number
  patientName: string
  doctorName: string
  serviceName: string
  fdate: string
  appointmentTime: string
  status: string
  notes?: string
}

interface LowStockItem {
  id: number
  name: string
  quantity: number
  minThreshold: number
  category: string
}

interface ClinicInfo {
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
  description: string
  isActive: number
  createdAt: string
  updatedAt: string
}

interface TreatmentStats {
  totalTreatments: number
  totalRevenue: number
  totalDoctorWage: number
  totalClinicProfit: number
  totalMaterialsCost: number
  totalMedicinesCost: number
  totalExtraCosts: number
  completed: number
  pending: number
  cancelled: number
}

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([])
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([])
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null)
  const [treatmentStats, setTreatmentStats] = useState<TreatmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('دسترسی غیرمجاز - فقط ادمین')
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

      const [
        statsResponse,
        appointmentsResponse,
        lowStockResponse,
        clinicResponse,
        treatmentResponse
      ] = await Promise.all([
        axios.get('/api/v1/dashboard/overview'),
        axios.get('/api/v1/dashboard/recent-appointments', { params: { limit: 10 } }),
        axios.get('/api/v1/dashboard/low-stock'),
        axios.get('/api/v1/dashboard/clinic-info'),
        axios.get('/api/v1/dashboard/treatment-stats')
      ])

      setStats({
        ...statsResponse.data,
        weeklyGrowth: 12.5,
        patientGrowth: 8.3,
        revenueGrowth: 15.7
      })
      setRecentAppointments(appointmentsResponse.data)
      setLowStockItems(lowStockResponse.data)
      setClinicInfo(clinicResponse.data)
      setTreatmentStats(treatmentResponse.data)

    } catch (error: any) {
      console.error('Error fetching dashboard:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        logout()
        return
      }
      
      setError('خطا در دریافت اطلاعات داشبورد')
      toast.error('خطا در دریافت اطلاعات')
      
    } finally {
      setLoading(false)
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
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR')
  }

  const filteredAppointments = recentAppointments.filter(app =>
    app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const quickActions = [
    { icon: <FaUserPlus />, label: 'ثبت کاربر', link: '/admin/users/add', color: 'bg-blue-500' },
    { icon: <FaCalendarAlt />, label: 'رزرو نوبت', link: '/admin/appointments/add', color: 'bg-gold' },
    { icon: <FaSyringe />, label: 'خدمات', link: '/admin/services', color: 'bg-purple-500' },
    { icon: <FaBoxes />, label: 'موجودی', link: '/admin/inventory', color: 'bg-green-500' },
    { icon: <FaFileInvoice />, label: 'درمان‌ها', link: '/admin/treatments', color: 'bg-orange-500' },
    { icon: <FaChartBar />, label: 'گزارشات', link: '/admin/financial-report', color: 'bg-red-500' }
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
    <div className="max-w-7xl mx-auto">
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-darkblue dark:text-white flex items-center gap-3">
            <FaBuilding className="text-gold" />
            پنل مدیریت کلینیک
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <FaClock className="text-gold text-xs" />
            خوش آمدید، {user?.fullName || 'مدیر'} 
            {clinicInfo && <span className="text-xs text-gold mr-2 font-bold">| {clinicInfo.clinicName}</span>}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchDashboardData}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? '⏳ در حال بروزرسانی...' : '🔄 بروزرسانی'}
          </button>
          <Link to="/admin/financial-report" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <FaChartBar />
            گزارشات مالی
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

      {/* ===== اطلاعات کلینیک ===== */}
      {clinicInfo && (
        <div className="card dark:bg-gray-800 mb-8 bg-gradient-to-r from-gold-light/10 to-gold-light/5 border-2 border-gold/20">
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gold flex items-center justify-center text-white text-4xl flex-shrink-0">
              <FaHospital />
            </div>
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-2xl font-bold text-darkblue dark:text-white">
                {clinicInfo.clinicName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                کد: {clinicInfo.clinicCode || '-'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                {clinicInfo.address && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-gold text-xs" />
                    {clinicInfo.address}
                  </p>
                )}
                {clinicInfo.phone && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaPhone className="text-gold text-xs" />
                    {clinicInfo.phone}
                  </p>
                )}
                {clinicInfo.mobile && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaPhone className="text-gold text-xs" />
                    {clinicInfo.mobile}
                  </p>
                )}
                {clinicInfo.email && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaEnvelope className="text-gold text-xs" />
                    {clinicInfo.email}
                  </p>
                )}
                {clinicInfo.website && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaGlobe className="text-gold text-xs" />
                    {clinicInfo.website}
                  </p>
                )}
                {clinicInfo.managerName && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaUser className="text-gold text-xs" />
                    مدیر: {clinicInfo.managerName}
                  </p>
                )}
                {clinicInfo.managerPhone && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaPhone className="text-gold text-xs" />
                    {clinicInfo.managerPhone}
                  </p>
                )}
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                  clinicInfo.isActive === 1 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {clinicInfo.isActive === 1 ? '🟢 فعال' : '🔴 غیرفعال'}
                </span>
              </div>
              {clinicInfo.description && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                  📝 {clinicInfo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">تعداد بیماران</p>
              <p className="text-2xl font-bold text-darkblue dark:text-white">
                {stats?.totalPatients || 0}
              </p>
              {stats?.patientGrowth && (
                <p className={`text-xs flex items-center gap-1 ${stats.patientGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.patientGrowth > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(stats.patientGrowth)}%
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FaUsers className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">نوبت‌های امروز</p>
              <p className="text-2xl font-bold text-darkblue dark:text-white">
                {stats?.todayAppointments || 0}
              </p>
              {stats?.weeklyGrowth && (
                <p className={`text-xs flex items-center gap-1 ${stats.weeklyGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.weeklyGrowth > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(stats.weeklyGrowth)}%
                </p>
              )}
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FaCalendarCheck className="text-green-500 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">درآمد ماه جاری</p>
              <p className="text-xl font-bold text-gold dark:text-gold">
                {stats?.monthlyRevenue ? formatPrice(stats.monthlyRevenue) : '۰'} تومان
              </p>
              {stats?.revenueGrowth && (
                <p className={`text-xs flex items-center gap-1 ${stats.revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.revenueGrowth > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(stats.revenueGrowth)}%
                </p>
              )}
            </div>
            <div className="p-3 bg-gold-light dark:bg-gold-dark/20 rounded-xl">
              <FaMoneyBillWave className="text-gold text-xl" />
            </div>
          </div>
        </div>
        
        <div className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">نوبت‌های در انتظار</p>
              <p className="text-2xl font-bold text-yellow-500">
                {stats?.pendingAppointments || 0}
              </p>
              <p className="text-xs text-gray-400">نیاز به تایید</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <FaClock className="text-yellow-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Quick Stats ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-gray-800 bg-blue-50 dark:bg-blue-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">👨‍⚕️ پزشکان</p>
          <p className="text-2xl font-bold text-blue-500">{stats?.totalDoctors || 0}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-green-50 dark:bg-green-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">💊 خدمات</p>
          <p className="text-2xl font-bold text-green-500">{stats?.totalServices || 0}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-purple-50 dark:bg-purple-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">🏥 درمان‌ها</p>
          <p className="text-2xl font-bold text-purple-500">{treatmentStats?.totalTreatments || 0}</p>
        </div>
        <div className="card dark:bg-gray-800 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">📦 کمبود موجودی</p>
          <p className="text-2xl font-bold text-red-500">{lowStockItems.length}</p>
        </div>
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="card dark:bg-gray-800 hover:shadow-medium transition-all duration-300 text-center group p-4"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 text-white text-xl group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <p className="text-xs font-medium text-darkblue dark:text-white">{action.label}</p>
          </Link>
        ))}
      </div>

      {/* ===== Main Content ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 card dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-darkblue dark:text-white flex items-center gap-2">
              <FaCalendarAlt className="text-gold" />
              نوبت‌های اخیر
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
              <Link to="/admin/appointments" className="text-gold hover:underline text-sm whitespace-nowrap">
                مشاهده همه
              </Link>
            </div>
          </div>
          
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">هیچ نوبتی ثبت نشده است</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredAppointments.map((app) => {
                const { style, label } = getStatusBadge(app.status)
                return (
                  <div key={app.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b dark:border-gray-700 last:border-0">
                    <div className="flex-1 min-w-[150px]">
                      <p className="font-medium text-darkblue dark:text-white">{app.patientName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {app.serviceName} - {app.doctorName}
                      </p>
                      <p className="text-xs text-gray-400">
                        📅 {app.fdate} ⏰ {app.appointmentTime}
                      </p>
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Low Stock Warning */}
          {lowStockItems.length > 0 && (
            <div className="card dark:bg-gray-800 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-3">
                <FaExclamationTriangle className="text-red-500 text-xl" />
                <h3 className="text-lg font-bold text-red-500">کمبود موجودی</h3>
                <span className="mr-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {lowStockItems.length} مورد
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-darkblue dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-500">{item.quantity}</p>
                      <p className="text-xs text-gray-400">حداقل: {item.minThreshold}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/inventory" className="btn-primary text-sm w-full mt-3 text-center block">
                مدیریت موجودی
              </Link>
            </div>
          )}

          {/* Treatment Summary */}
          {treatmentStats && (
            <div className="card dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <FaSyringe className="text-gold text-xl" />
                <h3 className="text-lg font-bold text-darkblue dark:text-white">خلاصه درمان‌ها</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">انجام شده</p>
                  <p className="font-bold text-green-600">{treatmentStats.completed || 0}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">در انتظار</p>
                  <p className="font-bold text-yellow-600">{treatmentStats.pending || 0}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">لغو شده</p>
                  <p className="font-bold text-red-600">{treatmentStats.cancelled || 0}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">کل</p>
                  <p className="font-bold text-blue-600">{treatmentStats.totalTreatments || 0}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">کل درآمد درمان‌ها</span>
                  <span className="font-bold text-gold">{formatPrice(treatmentStats.totalRevenue || 0)} تومان</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500 dark:text-gray-400">سود کلینیک</span>
                  <span className="font-bold text-green-500">{formatPrice(treatmentStats.totalClinicProfit || 0)} تومان</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Quick Tips ===== */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-gold-light/30 to-gold-light/10">
          <h4 className="font-bold text-darkblue dark:text-white mb-2">💡 نکته</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            برای مدیریت کاربران، روی دکمه "ثبت کاربر" کلیک کنید.
          </p>
        </div>
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-blue-50/30 to-blue-50/10 dark:from-blue-900/20">
          <h4 className="font-bold text-darkblue dark:text-white mb-2">📌 یادآوری</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            نوبت‌های در انتظار را تایید کنید تا بیماران از وضعیت خود مطلع شوند.
          </p>
        </div>
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-green-50/30 to-green-50/10 dark:from-green-900/20">
          <h4 className="font-bold text-darkblue dark:text-white mb-2">📊 آمار کلینیک</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            درآمد ماه جاری: {stats?.monthlyRevenue ? formatPrice(stats.monthlyRevenue) : '۰'} تومان
          </p>
        </div>
      </div>
    </div>
  )
}