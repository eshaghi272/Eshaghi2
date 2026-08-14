// Path: frontend/src/components/admin/FinancialReport.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  FaChartBar, 
  FaMoneyBillWave, 
  FaUsers, 
  FaCalendarAlt,
  FaPrint,
  FaDownload,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserMd,
  FaSyringe,
  FaPercent,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaFileInvoice,
  FaWallet,
  FaChartPie,        // <-- تغییر: FaPieChart → FaChartPie
  FaBoxes,
  FaPills,
  FaStethoscope
} from 'react-icons/fa'

interface FinancialReport {
  overview: {
    totalTreatments: number
    totalRevenue: number
    totalDoctorWage: number
    totalClinicProfit: number
    totalMaterialsCost: number
    totalMedicinesCost: number
    totalExtraCosts: number
    averageTreatmentPrice: number
    completedTreatments: number
    pendingTreatments: number
    cancelledTreatments: number
    paidTreatments: number
    unpaidTreatments: number
  }
  revenueByPeriod: Array<{
    period: string
    treatmentCount: number
    revenue: number
    doctorWage: number
    clinicProfit: number
    averagePrice: number
  }>
  serviceStats: Array<{
    serviceName: string
    count: number
    totalRevenue: number
    averagePrice: number
    completedCount: number
  }>
  doctorStats: Array<{
    doctorName: string
    treatmentCount: number
    totalRevenue: number
    totalWage: number
    averagePrice: number
    completedCount: number
  }>
  revenueTrend: Array<{
    month: string
    revenue: number
    count: number
  }>
  paymentStatus: Array<{
    paymentStatus: string
    count: number
    totalAmount: number
    paidAmount: number
    remainingAmount: number
  }>
  currentCosts: Array<{
    category: string
    amount: number
  }>
  summary: {
    totalRevenue: number
    totalProfit: number
    totalCosts: number
    successRate: number
  }
}

export default function FinancialReport() {
  const { user, logout } = useContext(AuthContext)
  const [report, setReport] = useState<FinancialReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('دسترسی غیرمجاز - فقط ادمین')
      window.location.href = '/dashboard'
      return
    }
    fetchReport()
  }, [period])

  const fetchReport = async () => {
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

      const params: any = { period }
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const response = await axios.get('/api/v1/financial/report', { params })
      setReport(response.data)

    } catch (error: any) {
      console.error('Error fetching financial report:', error)
      
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.')
        logout()
        return
      }
      
      setError('خطا در دریافت گزارش مالی')
      toast.error('خطا در دریافت اطلاعات')
      
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return price?.toLocaleString('fa-IR') || '۰'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری گزارش مالی...</p>
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
            <FaChartBar className="text-gold" />
            گزارش مالی
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            گزارش جامع عملکرد مالی کلینیک
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            <select
              className="input-field text-sm py-1 px-3"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="daily">روزانه</option>
              <option value="monthly">ماهانه</option>
              <option value="yearly">سالانه</option>
            </select>
          </div>
          <input
            type="date"
            className="input-field text-sm py-1 px-3 w-36"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="input-field text-sm py-1 px-3 w-36"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={fetchReport}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            <FaSpinner className={loading ? 'animate-spin' : ''} />
            بروزرسانی
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
          >
            <FaPrint />
            چاپ
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchReport}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* ===== کارت‌های خلاصه ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-gray-800 bg-gradient-to-r from-gold-light/30 to-gold-light/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">کل درآمد</p>
              <p className="text-2xl font-bold text-gold">
                {formatPrice(report?.summary?.totalRevenue || 0)} تومان
              </p>
            </div>
            <div className="p-3 bg-gold-light dark:bg-gold-dark/20 rounded-xl">
              <FaMoneyBillWave className="text-gold text-2xl" />
            </div>
          </div>
        </div>

        <div className="card dark:bg-gray-800 bg-gradient-to-r from-green-50/30 to-green-50/10 dark:from-green-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">سود خالص</p>
              <p className="text-2xl font-bold text-green-500">
                {formatPrice(report?.summary?.totalProfit || 0)} تومان
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FaWallet className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>

        <div className="card dark:bg-gray-800 bg-gradient-to-r from-red-50/30 to-red-50/10 dark:from-red-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">کل هزینه‌ها</p>
              <p className="text-2xl font-bold text-red-500">
                {formatPrice(report?.summary?.totalCosts || 0)} تومان
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <FaChartLine className="text-red-500 text-2xl" />
            </div>
          </div>
        </div>

        <div className="card dark:bg-gray-800 bg-gradient-to-r from-blue-50/30 to-blue-50/10 dark:from-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">نرخ موفقیت</p>
              <p className="text-2xl font-bold text-blue-500">
                {report?.summary?.successRate || 0}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FaPercent className="text-blue-500 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== آمار تکمیلی ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-light dark:bg-gold-dark/20 rounded-xl">
              <FaFileInvoice className="text-gold text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">تعداد درمان‌ها</p>
              <p className="text-2xl font-bold text-darkblue dark:text-white">
                {report?.overview?.totalTreatments || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card dark:bg-gray-800 bg-green-50 dark:bg-green-900/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">انجام شده</p>
              <p className="text-2xl font-bold text-green-500">
                {report?.overview?.completedTreatments || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card dark:bg-gray-800 bg-yellow-50 dark:bg-yellow-900/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <FaClock className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">در انتظار</p>
              <p className="text-2xl font-bold text-yellow-500">
                {report?.overview?.pendingTreatments || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card dark:bg-gray-800 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <FaTimesCircle className="text-red-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">لغو شده</p>
              <p className="text-2xl font-bold text-red-500">
                {report?.overview?.cancelledTreatments || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== جدول درآمد دوره‌ای ===== */}
      <div className="card dark:bg-gray-800 mb-8">
        <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4">
          <FaChartBar className="inline ml-2 text-gold" />
          درآمد بر اساس {period === 'daily' ? 'روز' : period === 'monthly' ? 'ماه' : 'سال'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-2 px-3">دوره</th>
                <th className="text-right py-2 px-3">تعداد درمان</th>
                <th className="text-right py-2 px-3">درآمد</th>
                <th className="text-right py-2 px-3">دستمزد پزشکان</th>
                <th className="text-right py-2 px-3">سود کلینیک</th>
                <th className="text-right py-2 px-3">میانگین قیمت</th>
              </tr>
            </thead>
            <tbody>
              {report?.revenueByPeriod?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-3 font-medium">{item.period}</td>
                  <td className="py-2 px-3">{item.treatmentCount}</td>
                  <td className="py-2 px-3 font-bold text-gold">{formatPrice(item.revenue)}</td>
                  <td className="py-2 px-3 text-blue-500">{formatPrice(item.doctorWage)}</td>
                  <td className="py-2 px-3 text-green-500">{formatPrice(item.clinicProfit)}</td>
                  <td className="py-2 px-3">{formatPrice(item.averagePrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== جدول خدمات ===== */}
      <div className="card dark:bg-gray-800 mb-8">
        <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4">
          <FaSyringe className="inline ml-2 text-gold" />
          جزئیات خدمات
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-2 px-3">خدمت</th>
                <th className="text-right py-2 px-3">تعداد</th>
                <th className="text-right py-2 px-3">انجام شده</th>
                <th className="text-right py-2 px-3">میانگین قیمت</th>
                <th className="text-right py-2 px-3">کل درآمد</th>
              </tr>
            </thead>
            <tbody>
              {report?.serviceStats?.map((service, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-3 font-medium">{service.serviceName}</td>
                  <td className="py-2 px-3">{service.count}</td>
                  <td className="py-2 px-3">{service.completedCount}</td>
                  <td className="py-2 px-3">{formatPrice(service.averagePrice)}</td>
                  <td className="py-2 px-3 font-bold text-gold">{formatPrice(service.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== جدول پزشکان ===== */}
      <div className="card dark:bg-gray-800">
        <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4">
          <FaUserMd className="inline ml-2 text-gold" />
          عملکرد پزشکان
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-2 px-3">پزشک</th>
                <th className="text-right py-2 px-3">تعداد</th>
                <th className="text-right py-2 px-3">انجام شده</th>
                <th className="text-right py-2 px-3">میانگین قیمت</th>
                <th className="text-right py-2 px-3">کل درآمد</th>
                <th className="text-right py-2 px-3">دستمزد</th>
              </tr>
            </thead>
            <tbody>
              {report?.doctorStats?.map((doctor, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-3 font-medium">{doctor.doctorName}</td>
                  <td className="py-2 px-3">{doctor.treatmentCount}</td>
                  <td className="py-2 px-3">{doctor.completedCount}</td>
                  <td className="py-2 px-3">{formatPrice(doctor.averagePrice)}</td>
                  <td className="py-2 px-3 font-bold text-gold">{formatPrice(doctor.totalRevenue)}</td>
                  <td className="py-2 px-3 text-blue-500">{formatPrice(doctor.totalWage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== توزیع هزینه‌ها ===== */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4">
            <FaChartPie className="inline ml-2 text-gold" />  {/* <-- تغییر: FaPieChart → FaChartPie */}
            توزیع هزینه‌ها
          </h3>
          <div className="space-y-3">
            {report?.currentCosts?.map((cost, index) => {
              const colors = ['#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899']
              const total = report?.currentCosts?.reduce((sum, c) => sum + c.amount, 0) || 1
              const percentage = Math.round((cost.amount / total) * 100)
              
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{cost.category}</span>
                    <span className="font-bold">{formatPrice(cost.amount)} تومان ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[index % colors.length]
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ===== روند درآمد ===== */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4">
            <FaChartLine className="inline ml-2 text-gold" />
            روند درآمد
          </h3>
          <div className="space-y-3">
            {report?.revenueTrend?.slice(-6).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{item.month}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-6 rounded-full flex items-center justify-end px-2 text-xs text-white font-medium transition-all duration-500"
                      style={{
                        width: `${Math.min((item.revenue / (report?.revenueTrend?.reduce((max, r) => Math.max(max, r.revenue), 0) || 1)) * 100, 100)}%`,
                        backgroundColor: '#C9A96E'
                      }}
                    >
                      {formatPrice(item.revenue)}
                    </div>
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-500 text-left">{item.count} درمان</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}