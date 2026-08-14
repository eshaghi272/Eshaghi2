// Path: frontend/src/components/receptionist/Patients.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface Patient {
  id: number
  fullName: string
  nationalCode: string
  mobile: string
  email: string | null
  role: string
  isActive: boolean
  createdAt: string
  appointmentCount?: number
}

export default function ReceptionistPatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/users', {
        params: { role: 'patient' }
      })
      setPatients(response.data)
    } catch (error: any) {
      console.error('Error fetching patients:', error)
      toast.error('خطا در دریافت لیست بیماران')
    } finally {
      setLoading(false)
    }
  }

  const deletePatient = async (id: number) => {
    if (!confirm('آیا از حذف این بیمار مطمئن هستید؟')) return
    
    try {
      await axios.delete(`/api/v1/users/${id}`)
      toast.success('بیمار با موفقیت حذف شد')
      fetchPatients()
    } catch (error: any) {
      console.error('Error deleting patient:', error)
      toast.error('خطا در حذف بیمار')
    }
  }

  const filteredPatients = patients.filter(p =>
    p.fullName.includes(searchTerm) || 
    p.mobile.includes(searchTerm) ||
    p.nationalCode.includes(searchTerm)
  )

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
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">مدیریت بیماران</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {patients.length} بیمار
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/receptionist/register-patient" className="btn-primary flex items-center gap-2 text-sm">
              <FaPlus />
              ثبت بیمار جدید
            </Link>
            <button 
              onClick={fetchPatients}
              className="btn-secondary text-sm py-2 px-4"
            >
              🔄 بروزرسانی
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="جستجوی بیمار بر اساس نام، موبایل یا کد ملی..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {filteredPatients.length === 0 ? (
          <div className="card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">👤</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ بیماری یافت نشد</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="card dark:bg-gray-800 hover:shadow-medium transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center text-white text-lg font-bold">
                      {patient.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-darkblue dark:text-white">
                        {patient.fullName}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p className="flex items-center gap-2">
                          <FaPhone className="text-gold text-xs" />
                          {patient.mobile}
                        </p>
                        {patient.email && (
                          <p className="flex items-center gap-2">
                            <FaEnvelope className="text-gold text-xs" />
                            {patient.email}
                          </p>
                        )}
                        <p className="flex items-center gap-2 text-xs text-gray-400">
                          کد ملی: {patient.nationalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/receptionist/edit-patient/${patient.id}`}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <FaEdit className="text-sm" />
                      ویرایش
                    </Link>
                    <button
                      onClick={() => deletePatient(patient.id)}
                      className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <FaTrash className="text-sm" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  )
}