// Path: frontend/src/components/receptionist/Doctors.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { 
  FaUserMd, 
  FaPhone, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaStethoscope,
  FaMoneyBillWave,
  FaStar
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface Doctor {
  id: number
  userId: number
  specialty: string
  biography: string | null
  experienceYears: number
  consultationFee: number
  rating: number
  isActive: boolean
  user?: {
    id: number
    fullName: string
    nationalCode: string
    mobile: string
    email: string | null
    isActive: boolean
  }
  appointmentCount?: number
}

export default function ReceptionistDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, inactive

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      
      // دریافت لیست پزشکان
      const response = await axios.get('/api/v1/users', {
        params: { role: 'doctor' }
      })
      
      // دریافت اطلاعات تکمیلی پزشکان
      const doctorsWithDetails = await Promise.all(
        response.data.map(async (user: any) => {
          try {
            const doctorRes = await axios.get(`/api/v1/doctors/${user.id}`)
            return {
              ...doctorRes.data,
              user: user
            }
          } catch {
            // اگر اطلاعات پزشک وجود نداشت، یک رکورد پیش‌فرض برگردان
            return {
              userId: user.id,
              specialty: 'تعیین نشده',
              biography: null,
              experienceYears: 0,
              consultationFee: 0,
              rating: 0,
              isActive: true,
              user: user,
              appointmentCount: 0
            }
          }
        })
      )
      
      setDoctors(doctorsWithDetails)
    } catch (error: any) {
      console.error('Error fetching doctors:', error)
      toast.error('خطا در دریافت لیست پزشکان')
      
      // Mock data
      setDoctors([
        {
          id: 1,
          userId: 2,
          specialty: 'پوست و مو',
          biography: 'متخصص پوست و مو با ۱۵ سال سابقه',
          experienceYears: 15,
          consultationFee: 250000,
          rating: 4.8,
          isActive: true,
          user: {
            id: 2,
            fullName: 'دکتر علی محمدی',
            nationalCode: '1234567891',
            mobile: '09120000002',
            email: 'dr.mohammadi@clinic.com',
            isActive: true
          },
          appointmentCount: 45
        },
        {
          id: 2,
          userId: 3,
          specialty: 'زیبایی',
          biography: 'متخصص زیبایی و لیزر با ۱۰ سال سابقه',
          experienceYears: 10,
          consultationFee: 300000,
          rating: 4.9,
          isActive: true,
          user: {
            id: 3,
            fullName: 'دکتر سارا احمدی',
            nationalCode: '1234567892',
            mobile: '09120000003',
            email: 'dr.ahmadi@clinic.com',
            isActive: true
          },
          appointmentCount: 38
        },
        {
          id: 3,
          userId: 4,
          specialty: 'پوست',
          biography: 'متخصص پوست با ۸ سال سابقه',
          experienceYears: 8,
          consultationFee: 200000,
          rating: 4.7,
          isActive: false,
          user: {
            id: 4,
            fullName: 'دکتر رضا کریمی',
            nationalCode: '1234567893',
            mobile: '09120000004',
            email: 'dr.karimi@clinic.com',
            isActive: false
          },
          appointmentCount: 12
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleDoctorStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus
      await axios.put(`/api/v1/users/${userId}`, { isActive: newStatus })
      
      toast.success(`پزشک ${newStatus ? 'فعال' : 'غیرفعال'} شد`)
      fetchDoctors()
    } catch (error: any) {
      console.error('Error toggling doctor status:', error)
      toast.error('خطا در تغییر وضعیت پزشک')
    }
  }

  const deleteDoctor = async (userId: number) => {
    if (!confirm('آیا از حذف این پزشک مطمئن هستید؟')) return
    
    try {
      await axios.delete(`/api/v1/users/${userId}`)
      toast.success('پزشک با موفقیت حذف شد')
      fetchDoctors()
    } catch (error: any) {
      console.error('Error deleting doctor:', error)
      toast.error('خطا در حذف پزشک')
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    const search = searchTerm.toLowerCase()
    const matchSearch = 
      doctor.user?.fullName?.toLowerCase().includes(search) ||
      doctor.specialty?.toLowerCase().includes(search) ||
      doctor.user?.mobile?.includes(search)
    
    const matchStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && doctor.isActive && doctor.user?.isActive) ||
      (filterStatus === 'inactive' && (!doctor.isActive || !doctor.user?.isActive))
    
    return matchSearch && matchStatus
  })

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? { style: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'فعال' }
      : { style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'غیرفعال' }
  }

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">مدیریت پزشکان</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {doctors.filter(d => d.isActive && d.user?.isActive).length} پزشک فعال
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/receptionist/add-doctor" className="btn-primary flex items-center gap-2 text-sm">
              <FaPlus />
              ثبت پزشک جدید
            </Link>
            <button 
              onClick={fetchDoctors}
              className="btn-secondary text-sm py-2 px-4"
            >
              🔄 بروزرسانی
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="جستجوی پزشک بر اساس نام، تخصص یا موبایل..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterStatus === 'all' 
                  ? 'bg-gold text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setFilterStatus('all')}
            >
              همه
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterStatus === 'active' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setFilterStatus('active')}
            >
              فعال
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterStatus === 'inactive' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setFilterStatus('inactive')}
            >
              غیرفعال
            </button>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ پزشکی یافت نشد</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDoctors.map((doctor) => {
              const status = getStatusBadge(doctor.isActive && doctor.user?.isActive)
              return (
                <div key={doctor.userId} className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-gold to-gold-dark flex items-center justify-center text-white text-2xl font-bold">
                        {doctor.user?.fullName?.charAt(0) || 'د'}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-darkblue dark:text-white">
                            {doctor.user?.fullName || 'نامشخص'}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.style}`}>
                            {status.label}
                          </span>
                          {doctor.rating > 0 && (
                            <span className="flex items-center gap-1 text-sm text-yellow-500">
                              <FaStar />
                              {doctor.rating}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaStethoscope className="text-gold text-xs" />
                            {doctor.specialty || 'تخصص نامشخص'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaPhone className="text-gold text-xs" />
                            {doctor.user?.mobile || 'نامشخص'}
                          </span>
                          {doctor.user?.email && (
                            <span className="flex items-center gap-1">
                              <FaEnvelope className="text-gold text-xs" />
                              {doctor.user.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FaMoneyBillWave className="text-gold text-xs" />
                            {doctor.consultationFee?.toLocaleString() || 0} تومان
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <FaCalendarAlt className="text-gold text-xs" />
                            {doctor.experienceYears || 0} سال تجربه
                          </span>
                          {doctor.appointmentCount !== undefined && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              📅 {doctor.appointmentCount} نوبت
                            </span>
                          )}
                        </div>
                        {doctor.biography && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{doctor.biography}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => toggleDoctorStatus(doctor.userId, doctor.isActive && doctor.user?.isActive)}
                        className={`text-sm py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors ${
                          doctor.isActive && doctor.user?.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {doctor.isActive && doctor.user?.isActive ? (
                          <><FaToggleOn className="text-lg" /> فعال</>
                        ) : (
                          <><FaToggleOff className="text-lg" /> غیرفعال</>
                        )}
                      </button>
                      <Link
                        to={`/receptionist/edit-doctor/${doctor.userId}`}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <FaEdit className="text-sm" />
                        ویرایش
                      </Link>
                      <button
                        onClick={() => deleteDoctor(doctor.userId)}
                        className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <FaTrash className="text-sm" />
                        حذف
                      </button>
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