// Path: frontend/src/components/common/DashboardRouter.tsx
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

import PatientDashboard from '../patient/PatientDashboard'
import DoctorDashboard from '../doctor/DoctorDashboard'
import ReceptionistDashboard from '../receptionist/ReceptionistDashboard'
import AdminDashboard from '../admin/AdminDashboard'

export default function DashboardRouter() {
  const { user, loading } = useContext(AuthContext)
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
          <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />
    case 'doctor':
      return <DoctorDashboard />
    case 'receptionist':
      return <ReceptionistDashboard />
    case 'patient':
      return <PatientDashboard />
    default:
      return <Navigate to="/login" replace />
  }
}