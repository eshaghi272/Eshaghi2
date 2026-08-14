// Path: frontend/src/components/receptionist/BookAppointment.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { getTodayPersian, isValidPersianDate } from '../../utils/persianDate'
import { FaUser, FaUserMd, FaSyringe, FaCalendarAlt, FaClock, FaNotesMedical, FaSave } from 'react-icons/fa'

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
  doctor?: {
    specialty: string
  }
}

interface Patient {
  id: number
  fullName: string
  mobile: string
}

export default function ReceptionistBookAppointment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    serviceId: '',
    fdate: getTodayPersian(),
    appointmentTime: '',
    notes: ''
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (formData.doctorId && formData.fdate) {
      fetchAvailableSlots()
    } else {
      setAvailableSlots([])
    }
  }, [formData.doctorId, formData.fdate])

  const fetchInitialData = async () => {
    try {
      setLoadingData(true)

      const [patientsRes, servicesRes, doctorsRes] = await Promise.all([
        axios.get('/api/v1/users', { params: { role: 'patient' } }),
        axios.get('/api/v1/services'),
        axios.get('/api/v1/users', { params: { role: 'doctor' } })
      ])

      setPatients(patientsRes.data)
      setServices(servicesRes.data)
      
      // پردازش لیست پزشکان
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
      
      // Mock data
      setPatients([
        { id: 6, fullName: 'احمد رضایی', mobile: '09120000006' },
        { id: 7, fullName: 'مریم کریمی', mobile: '09120000007' }
      ])
      setServices([
        { id: 1, name: 'بوتاکس', price: 5000000, durationMinutes: 30 },
        { id: 2, name: 'فیلر', price: 3000000, durationMinutes: 20 }
      ])
      setDoctors([
        { id: 2, userId: 2, fullName: 'دکتر علی محمدی', specialty: 'پوست و مو', consultationFee: 250000 },
        { id: 3, userId: 3, fullName: 'دکتر سارا احمدی', specialty: 'زیبایی', consultationFee: 300000 }
      ])
    } finally {
      setLoadingData(false)
    }
  }

  const fetchAvailableSlots = async () => {
    try {
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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!isValidPersianDate(formData.fdate)) {
        toast.error('فرمت تاریخ صحیح نیست. مثال: 14030231')
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
        toast.error('این زمان قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید.')
        fetchAvailableSlots()
      } else {
        toast.error(error.response?.data?.message || 'خطا در رزرو نوبت')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loadingData) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-3xl mx-auto">
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
                name="patientId"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.patientId}
                onChange={handleInputChange}
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
                name="doctorId"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.doctorId}
                onChange={handleInputChange}
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

            {/* خدمت */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaSyringe className="inline ml-1 text-gold" />
                خدمت *
              </label>
              <select
                name="serviceId"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.serviceId}
                onChange={handleInputChange}
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

            {/* تاریخ */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaCalendarAlt className="inline ml-1 text-gold" />
                تاریخ (شمسی) *
              </label>
              <input
                type="text"
                name="fdate"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="مثال: 14030231"
                value={formData.fdate}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">فرمت: ۱۴۰۳۰۲۳۱</p>
            </div>

            {/* ساعت */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaClock className="inline ml-1 text-gold" />
                ساعت *
              </label>
              <select
                name="appointmentTime"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="">انتخاب ساعت...</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {formData.doctorId && formData.fdate && availableSlots.length === 0 && !loading && (
                <p className="text-sm text-yellow-500 mt-1">هیچ زمان خالی برای این تاریخ وجود ندارد</p>
              )}
            </div>

            {/* توضیحات */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaNotesMedical className="inline ml-1 text-gold" />
                توضیحات
              </label>
              <textarea
                name="notes"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="توضیحات اضافی..."
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
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