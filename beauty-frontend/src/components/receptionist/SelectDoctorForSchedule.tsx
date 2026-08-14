// Path: frontend/src/components/receptionist/SelectDoctorForSchedule.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { FaUserMd, FaSearch, FaCalendarAlt, FaArrowLeft, FaUser } from 'react-icons/fa'

interface Doctor {
  id: number
  userId: number
  fullName: string
  specialty: string
  mobile: string
  isActive: number
}

export default function SelectDoctorForSchedule() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/doctors')
      setDoctors(response.data)
    } catch (error: any) {
      console.error('Error fetching doctors:', error)
      toast.error('خطا در دریافت لیست پزشکان')
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchSearch = 
      doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.mobile.includes(searchTerm)
    
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && doctor.isActive === 1) ||
      (filterStatus === 'inactive' && doctor.isActive === 0)
    
    return matchSearch && matchStatus
  })

  const getStatusBadge = (isActive: number) => {
    return isActive === 1
      ? { style: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'فعال' }
      : { style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'غیرفعال' }
  }

  if (loading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/receptionist/doctors')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">تنظیم برنامه کاری پزشکان</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              برای تنظیم روزها و ساعات کاری، پزشک مورد نظر را انتخاب کنید
            </p>
          </div>
        </div>

        {/* Filters */}
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
          <select
            className="input-field max-w-[180px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">همه پزشکان</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
          <button
            onClick={fetchDoctors}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
          >
            🔄 بروزرسانی
          </button>
        </div>

        {/* Doctors List */}
        {filteredDoctors.length === 0 ? (
          <div className="card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ پزشکی یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doctor) => {
              const status = getStatusBadge(doctor.isActive)
              return (
                <div 
                  key={doctor.id} 
                  className="card dark:bg-gray-800 hover:shadow-medium transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/receptionist/doctor-schedule/${doctor.userId}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-gold to-gold-dark flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {doctor.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-darkblue dark:text-white">
                          {doctor.fullName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.style}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p className="flex items-center gap-2">
                          <FaUserMd className="text-gold text-xs" />
                          {doctor.specialty || 'تخصص نامشخص'}
                        </p>
                        <p className="flex items-center gap-2">
                          <FaUser className="text-gold text-xs" />
                          {doctor.mobile || 'نامشخص'}
                        </p>
                      </div>
                      <button 
                        className="mt-3 btn-primary text-sm py-2 px-4 flex items-center gap-2 group-hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/receptionist/doctor-schedule/${doctor.userId}`)
                        }}
                      >
                        <FaCalendarAlt />
                        تنظیم برنامه کاری
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