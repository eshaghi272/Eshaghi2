// Path: frontend/src/components/common/ProtectedRoute.tsx
import { ReactNode, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'admin' | 'doctor' | 'patient' | 'receptionist'
  allowedRoles?: ('admin' | 'doctor' | 'patient' | 'receptionist')[]
}

export default function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
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

  // اگر allowedRoles مشخص شده باشد
  if (allowedRoles && allowedRoles.length > 0) {
    if (user.role === 'admin') {
      return <>{children}</>
    }
    if (allowedRoles.includes(user.role as any)) {
      return <>{children}</>
    }
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  // اگر requiredRole مشخص شده باشد
  if (requiredRole) {
    if (user.role === 'admin') {
      return <>{children}</>
    }
    if (user.role === requiredRole) {
      return <>{children}</>
    }
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return <>{children}</>
}

function getDashboardPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'doctor':
      return '/doctor/dashboard'
    case 'receptionist':
      return '/receptionist/dashboard'
    case 'patient':
      return '/patient/dashboard'
    default:
      return '/dashboard'
  }
}