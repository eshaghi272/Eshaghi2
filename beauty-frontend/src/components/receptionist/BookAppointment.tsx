// Path: frontend/src/components/receptionist/BookAppointment.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { 
  getTodayPersian, 
  isValidPersianDate, 
  toPersianDate,
  getPersianMonthName,
  getPersianMonthDays,
  getFirstDayOfPersianMonth
} from '../../utils/persianDate'
import { 
  FaUser, 
  FaUserMd, 
  FaSyringe, 
  FaCalendarAlt, 
  FaClock, 
  FaNotesMedical, 
  FaSave,
  FaChevronRight,
  FaChevronLeft,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle
} from 'react-icons/fa'

interface Service {
  id: number
  name: string
  price: number
  durationMinutes: number
}

interface Doctor {
  id: number
  userId: number
  fullName: string
  specialty: string
  consultationFee: number
}

interface Patient {
  id: number
  fullName: string
  mobile: string
}

interface ScheduleItem {
  dayOfWeek: number
  dayName: string
  isWorking: boolean
  startTime: string | null
  endTime: string | null
  slotDuration: number
}

export default function ReceptionistBookAppointment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorSchedule, setDoctorSchedule] = useState<ScheduleItem[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isFetchingSlots, setIsFetchingSlots] = useState(false)
  const [selectedDoctorSchedule, setSelectedDoctorSchedule] = useState<ScheduleItem | null>(null)
  
  // تاریخ و روزهای هفته
  const [currentYear, setCurrentYear] = useState(() => {
    const today = getTodayPersian()
    return parseInt(today.substring(0, 4))
  })
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = getTodayPersian()
    return parseInt(today.substring(4, 6))
  })
  const [selectedDayName, setSelectedDayName] = useState<string>('')
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(-1)
  
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    serviceId: '',
    fdate: getTodayPersian(),
    appointmentTime: '',
    notes: ''
  })

  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (formData.doctorId) {
      fetchDoctorSchedule()
      setAvailableSlots([])
      setFormData(prev => ({ ...prev, appointmentTime: '' }))
    } else {
      setDoctorSchedule([])
      setAvailableSlots([])
      setSelectedDoctorSchedule(null)
    }
  }, [formData.doctorId])

  useEffect(() => {
    if (formData.doctorId && formData.fdate) {
      fetchAvailableSlots()
    }
  }, [formData.doctorId, formData.fdate])

  useEffect(() => {
    if (formData.fdate && isValidPersianDate(formData.fdate)) {
      const year = parseInt(formData.fdate.substring(0, 4))
      const month = parseInt(formData.fdate.substring(4, 6))
      const day = parseInt(formData.fdate.substring(6, 8))
      
      // محاسبه روز هفته برای تاریخ شمسی
      const dateObj = new Date(year - 621, month - 1, day)
      const dayOfWeek = dateObj.getDay()
      const persianDay = (dayOfWeek + 6) % 7
      
      setSelectedDayName(weekDays[persianDay])
      setSelectedDayOfWeek(persianDay)
      
      const daySchedule = doctorSchedule.find(d => d.dayOfWeek === persianDay)
      setSelectedDoctorSchedule(daySchedule || null)
    }
  }, [formData.fdate, doctorSchedule])

  const fetchInitialData = async () => {
    try {
      setLoadingData(true)

      const [patientsRes, servicesRes, doctorsRes] = await Promise.all([
        axios.get('/api/v1/users', { params: { role: 'patient' } }),
        axios.get('/api/v1/services'),
        axios.get('/api/v1/doctors')
      ])

      setPatients(patientsRes.data)
      setServices(servicesRes.data)
      
      const doctorsList = doctorsRes.data.map((doc: any) => ({
        id: doc.id,
        userId: doc.id,
        fullName: doc.fullName || 'نامشخص',
        specialty: doc.doctor?.specialty || 'متخصص',
        consultationFee: doc.doctor?.consultationFee || 0
      }))
      
      setDoctors(doctorsList)
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('خطا در دریافت اطلاعات')
    } finally {
      setLoadingData(false)
    }
  }

  const fetchDoctorSchedule = async () => {
    try {
      if (!formData.doctorId) return
      
      const response = await axios.get(`/api/v1/working-hours/schedule/${formData.doctorId}`)
      setDoctorSchedule(response.data)
    } catch (error) {
      console.error('Error fetching doctor schedule:', error)
      setDoctorSchedule([])
    }
  }

  const fetchAvailableSlots = async () => {
    try {
      setIsFetchingSlots(true)
      
      const selectedDay = doctorSchedule.find(d => d.dayOfWeek === selectedDayOfWeek)
      
      if (!selectedDay || !selectedDay.isWorking) {
        setAvailableSlots([])
        setFormData(prev => ({ ...prev, appointmentTime: '' }))
        return
      }

      const response = await axios.get('/api/v1/appointments/available', {
        params: {
          doctorId: formData.doctorId,
          date: formData.fdate
        }
      })
      
      setAvailableSlots(response.data.availableSlots || [])
    } catch (error: any) {
      console.error('Error fetching available slots:', error)
      setAvailableSlots([])
    } finally {
      setIsFetchingSlots(false)
    }
  }

  const generateMonthDays = () => {
    const year = currentYear
    const month = currentMonth
    
    const daysInMonth = getPersianMonthDays(year, month)
    const firstDayOfMonth = getFirstDayOfPersianMonth(year, month)
    
    const days: { 
      persianDate: string; 
      dayOfWeek: number; 
      isToday: boolean;
      day: number;
    }[] = []
    
    // روزهای خالی قبل از شروع ماه
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        persianDate: '',
        dayOfWeek: i,
        isToday: false,
        day: 0
      })
    }
    
    const todayPersian = getTodayPersian()
    const todayYear = parseInt(todayPersian.substring(0, 4))
    const todayMonth = parseInt(todayPersian.substring(4, 6))
    const todayDay = parseInt(todayPersian.substring(6, 8))
    
    // روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
      const persianDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
      const isToday = (year === todayYear && month === todayMonth && day === todayDay)
      const dayOfWeek = (firstDayOfMonth + day - 1) % 7
      
      days.push({
        persianDate,
        dayOfWeek,
        isToday,
        day
      })
    }
    
    return days
  }

  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta
    let newYear = currentYear
    
    if (newMonth > 12) {
      newMonth = 1
      newYear += 1
    } else if (newMonth < 1) {
      newMonth = 12
      newYear -= 1
    }
    
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const selectDate = (persianDate: string) => {
    if (!persianDate) return
    setFormData(prev => ({ ...prev, fdate: persianDate, appointmentTime: '' }))
    
    const year = parseInt(persianDate.substring(0, 4))
    const month = parseInt(persianDate.substring(4, 6))
    const day = parseInt(persianDate.substring(6, 8))
    
    const dateObj = new Date(year - 621, month - 1, day)
    const dayOfWeek = dateObj.getDay()
    const persianDay = (dayOfWeek + 6) % 7
    const selectedDay = doctorSchedule.find(d => d.dayOfWeek === persianDay)
    
    if (!selectedDay || !selectedDay.isWorking) {
      toast.warning('این روز کاری پزشک نیست')
    }
  }

  const getDayStatus = (dayOfWeek: number): { isWorking: boolean; startTime: string | null; endTime: string | null } => {
    if (!formData.doctorId || doctorSchedule.length === 0) {
      return { isWorking: false, startTime: null, endTime: null }
    }
    const day = doctorSchedule.find(d => d.dayOfWeek === dayOfWeek)
    return day ? { isWorking: day.isWorking, startTime: day.startTime, endTime: day.endTime } : { isWorking: false, startTime: null, endTime: null }
  }

  const renderTimeSlots = () => {
    if (isFetchingSlots) {
      return (
        <div className="text-center py-8">
          <FaSpinner className="animate-spin text-3xl text-gold mx-auto" />
          <p className="mt-2 text-gray-500">در حال دریافت زمان‌های خالی...</p>
        </div>
      )
    }

    const selectedDay = doctorSchedule.find(d => d.dayOfWeek === selectedDayOfWeek)
    
    if (!selectedDay || !selectedDay.isWorking) {
      return (
        <div className="text-center py-6 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <FaTimesCircle className="text-3xl mx-auto mb-2" />
          <p className="font-bold">این روز برای پزشک غیرفعال است</p>
          <p className="text-sm text-gray-400 mt-1">لطفاً روز دیگری را انتخاب کنید</p>
        </div>
      )
    }

    if (!selectedDay.startTime || !selectedDay.endTime) {
      return (
        <div className="text-center py-6 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
          <FaInfoCircle className="text-3xl mx-auto mb-2" />
          <p>ساعت کاری برای این روز تنظیم نشده است</p>
          <p className="text-sm text-gray-400 mt-1">لطفاً با مدیر سیستم تماس بگیرید</p>
        </div>
      )
    }

    if (availableSlots.length === 0) {
      return (
        <div className="text-center py-6 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
          <FaClock className="text-3xl mx-auto mb-2" />
          <p>هیچ زمان خالی برای این روز وجود ندارد</p>
          <p className="text-sm text-gray-400 mt-1">لطفاً تاریخ دیگری را انتخاب کنید</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {availableSlots.map((slot) => {
          const isSelected = formData.appointmentTime === slot
          return (
            <button
              key={slot}
              type="button"
              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gold text-white shadow-md scale-105 ring-2 ring-gold ring-offset-2'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 hover:scale-105'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, appointmentTime: slot }))}
            >
              {slot}
            </button>
          )
        })}
      </div>
    )
  }

  const renderDoctorScheduleInfo = () => {
    if (!formData.doctorId || doctorSchedule.length === 0) {
      return (
        <div className="text-center py-4 text-gray-400">
          <FaInfoCircle className="inline ml-2" />
          برای مشاهده روزهای کاری، پزشک را انتخاب کنید
        </div>
      )
    }

    const workingDays = doctorSchedule.filter(d => d.isWorking)
    const workingDayNames = workingDays.map(d => d.dayName).join('، ')

    return (
      <div className="bg-gold-light/10 dark:bg-gold-dark/5 rounded-xl p-4 border border-gold/20">
        <div className="flex items-center gap-2 mb-2">
          <FaCalendarAlt className="text-gold" />
          <h4 className="font-semibold text-darkblue dark:text-white">روزهای کاری پزشک</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {workingDayNames || 'هیچ روز کاری تنظیم نشده است'}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {doctorSchedule.map((day) => (
            <span
              key={day.dayOfWeek}
              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                day.isWorking
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400 line-through'
              }`}
            >
              {day.dayName}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!isValidPersianDate(formData.fdate)) {
        toast.error('فرمت تاریخ صحیح نیست')
        setLoading(false)
        return
      }

      if (!formData.appointmentTime) {
        toast.error('لطفاً ساعت را انتخاب کنید')
        setLoading(false)
        return
      }

      const appointmentData = {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        serviceId: parseInt(formData.serviceId),
        fdate: formData.fdate,
        appointmentTime: formData.appointmentTime,
        notes: formData.notes || ''
      }

      await axios.post('/api/v1/appointments', appointmentData)
      toast.success('نوبت با موفقیت رزرو شد')
      navigate('/receptionist/appointments')
    } catch (error: any) {
      console.error('Error booking appointment:', error)
      
      if (error.response?.status === 409) {
        toast.error('این زمان قبلاً رزرو شده است')
        fetchAvailableSlots()
      } else {
        toast.error(error.response?.data?.message || 'خطا در رزرو نوبت')
      }
    } finally {
      setLoading(false)
    }
  }

  const monthDays = generateMonthDays()

  if (loadingData) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-darkblue dark:text-white mb-8">رزرو نوبت برای بیمار</h1>

        <div className="card dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* بیمار */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaUser className="inline ml-1 text-gold" />
                بیمار *
              </label>
              <select
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                required
                disabled={loading}
              >
                <option value="">انتخاب بیمار...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.fullName} - {patient.mobile}
                  </option>
                ))}
              </select>
            </div>

            {/* پزشک */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaUserMd className="inline ml-1 text-gold" />
                پزشک *
              </label>
              <select
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.doctorId}
                onChange={(e) => {
                  setFormData({...formData, doctorId: e.target.value, fdate: getTodayPersian(), appointmentTime: ''})
                  setDoctorSchedule([])
                  setAvailableSlots([])
                  setSelectedDoctorSchedule(null)
                }}
                required
                disabled={loading}
              >
                <option value="">انتخاب پزشک...</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* نمایش روزهای کاری پزشک */}
            {renderDoctorScheduleInfo()}

            {/* خدمت */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaSyringe className="inline ml-1 text-gold" />
                خدمت *
              </label>
              <select
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.serviceId}
                onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                required
                disabled={loading}
              >
                <option value="">انتخاب خدمت...</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString()} تومان ({service.durationMinutes} دقیقه)
                  </option>
                ))}
              </select>
            </div>

            {/* تقویم */}
            <div>
              <label className="block text-sm font-medium mb-3 text-darkblue dark:text-white">
                <FaCalendarAlt className="inline ml-1 text-gold" />
                تاریخ *
              </label>
              
              {/* هدر ماه */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaChevronRight className="text-gray-600 dark:text-gray-300" />
                </button>
                <span className="text-lg font-bold text-darkblue dark:text-white">
                  {getPersianMonthName(currentMonth)} {currentYear}
                </span>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* روزهای هفته */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* روزهای ماه */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, index) => {
                  const isSelected = day.persianDate === formData.fdate
                  const dayStatus = getDayStatus(day.dayOfWeek)
                  const isAvailable = dayStatus.isWorking
                  
                  let bgColor = ''
                  
                  if (day.persianDate) {
                    if (isAvailable) {
                      bgColor = isSelected 
                        ? 'bg-gold text-white shadow-md scale-105 ring-2 ring-gold ring-offset-2' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-darkblue dark:text-white'
                    } else {
                      bgColor = 'text-gray-400 cursor-not-allowed dark:text-gray-600 bg-gray-50 dark:bg-gray-800/50 line-through'
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                        !day.persianDate
                          ? 'text-gray-300 dark:text-gray-600 cursor-default'
                          : bgColor
                      } ${day.isToday && !isSelected && day.persianDate ? 'border-2 border-gold' : ''}`}
                      onClick={() => {
                        if (day.persianDate && isAvailable) {
                          selectDate(day.persianDate)
                        } else if (day.persianDate && !isAvailable) {
                          const dayName = weekDays[day.dayOfWeek]
                          toast.warning(`روز ${dayName} برای این پزشک غیرفعال است`)
                        }
                      }}
                      disabled={!day.persianDate || !isAvailable}
                      title={day.persianDate && !isAvailable ? `روز ${weekDays[day.dayOfWeek]} غیرفعال است` : ''}
                    >
                      {day.persianDate ? day.day : ''}
                      {day.persianDate && (
                        <span className="absolute -top-1 -right-1">
                          {isAvailable ? (
                            <FaCheckCircle className="text-green-500 text-[10px]" />
                          ) : (
                            <FaTimesCircle className="text-red-400 text-[10px]" />
                          )}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* نمایش اطلاعات روز انتخاب شده */}
              {selectedDayName && formData.fdate && (
                <div className="mt-3 p-3 bg-gold-light/20 dark:bg-gold-dark/10 rounded-xl border border-gold/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-darkblue dark:text-white">
                        📅 {selectedDayName} - {formData.fdate}
                      </p>
                      {selectedDoctorSchedule && (
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedDoctorSchedule.isWorking ? (
                            <span className="text-green-500">✅ روز کاری</span>
                          ) : (
                            <span className="text-red-500">❌ روز غیرفعال</span>
                          )}
                          {selectedDoctorSchedule.isWorking && selectedDoctorSchedule.startTime && selectedDoctorSchedule.endTime && (
                            <span className="text-gray-400 mr-2">
                              ⏰ {selectedDoctorSchedule.startTime} - {selectedDoctorSchedule.endTime}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    {selectedDoctorSchedule?.isWorking && (
                      <div className="text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                        قابل رزرو
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ساعت */}
            <div>
              <label className="block text-sm font-medium mb-3 text-darkblue dark:text-white">
                <FaClock className="inline ml-1 text-gold" />
                ساعت *
              </label>
              {renderTimeSlots()}
              {formData.appointmentTime && (
                <p className="text-sm text-green-500 mt-2 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  ساعت انتخاب شده: {formData.appointmentTime}
                </p>
              )}
              {!formData.appointmentTime && selectedDayOfWeek >= 0 && doctorSchedule.length > 0 && (
                <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                  <FaInfoCircle />
                  برای انتخاب ساعت، روی یکی از زمان‌های خالی کلیک کنید
                </p>
              )}
            </div>

            {/* توضیحات */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaNotesMedical className="inline ml-1 text-gold" />
                توضیحات
              </label>
              <textarea
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="توضیحات اضافی..."
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading || !formData.appointmentTime}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  در حال رزرو...
                </>
              ) : (
                <>
                  <FaSave />
                  رزرو نوبت
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    
  )
}