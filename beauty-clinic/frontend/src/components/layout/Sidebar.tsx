// Path: frontend/src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import {
  FaHome,
  FaCalendarAlt,
  FaBookmark,
  FaCog,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaBoxes,
  FaSignOutAlt,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaSyringe,
  FaUserMd,
  FaStethoscope,
  FaHospital,
  FaCalendarCheck,
  FaFileInvoice,
  FaMoneyBillWave,
  FaEnvelope,
  FaUserPlus
} from 'react-icons/fa'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
  const isAdmin = user?.role === 'admin'
  const userRole = user?.role || 'patient'

  // ===== تابع دریافت مسیر داشبورد بر اساس نقش =====
  const getDashboardPath = (role: string): string => {
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

  // ===== تابع دریافت برچسب نقش =====
  const getRoleLabel = (role: string): string => {
    const roles: Record<string, string> = {
      admin: 'مدیر',
      doctor: 'پزشک',
      patient: 'بیمار',
      receptionist: 'منشی'
    }
    return roles[role] || role
  }

  // ===== تابع دریافت رنگ نقش =====
  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500',
      doctor: 'bg-blue-500',
      patient: 'bg-green-500',
      receptionist: 'bg-purple-500'
    }
    return colors[role] || 'bg-gray-500'
  }

  // ===== تعریف آیتم‌های منو =====
  const menuItems = [
    // ===== عمومی =====
    {
      path: '/',
      label: 'صفحه اصلی',
      icon: FaHome,
      roles: ['patient', 'doctor', 'admin', 'receptionist'],
      section: 'عمومی'
    },
    
    // ===== داشبورد پویا =====
    {
      path: getDashboardPath(userRole),
      label: 'داشبورد',
      icon: FaChartBar,
      roles: ['patient', 'doctor', 'admin', 'receptionist'],
      section: 'عمومی',
      isDashboard: true
    },
    
    // ===== بیمار =====
    {
      path: '/patient/appointments',
      label: 'نوبت‌های من',
      icon: FaCalendarAlt,
      roles: ['patient'],
      section: 'بیمار'
    },
    {
      path: '/patient/book-appointment',
      label: 'رزرو نوبت',
      icon: FaBookmark,
      roles: ['patient'],
      section: 'بیمار'
    },
    
    // ===== پزشک =====
    {
      path: '/doctor/appointments',
      label: 'مدیریت نوبت‌ها',
      icon: FaCalendarAlt,
      roles: ['doctor'],
      section: 'پزشک'
    },
    {
      path: '/doctor/patients',
      label: 'بیماران من',
      icon: FaUsers,
      roles: ['doctor'],
      section: 'پزشک'
    },
    {
      path: '/doctor/register-treatment',
      label: 'ثبت درمان',
      icon: FaSyringe,
      roles: ['doctor'],
      section: 'پزشک'
    },
    
    // ===== منشی =====
    {
      path: '/receptionist/appointments',
      label: 'مدیریت نوبت‌ها',
      icon: FaCalendarAlt,
      roles: ['receptionist'],
      section: 'منشی'
    },
    {
      path: '/receptionist/patients',
      label: 'بیماران',
      icon: FaUsers,
      roles: ['receptionist'],
      section: 'منشی'
    },
    {
      path: '/receptionist/doctors',
      label: 'پزشکان',
      icon: FaUserMd,
      roles: ['receptionist'],
      section: 'منشی'
    },
    {
      path: '/receptionist/add-doctor',
      label: 'افزودن پزشک',
      icon: FaUserPlus,
      roles: ['receptionist'],
      section: 'منشی'
    },
    {
      path: '/receptionist/select-doctor-schedule',
      label: 'تنظیم برنامه پزشکان',
      icon: FaCalendarCheck,
      roles: ['receptionist'],
      section: 'منشی'
    },
    {
      path: '/receptionist/book-appointment',
      label: 'رزرو نوبت',
      icon: FaBookmark,
      roles: ['receptionist'],
      section: 'منشی'
    },
    {
      path: '/receptionist/register-treatment',
      label: 'ثبت درمان',
      icon: FaSyringe,
      roles: ['receptionist'],
      section: 'منشی'
    },
    {
      path: '/receptionist/treatment-invoice',
      label: 'صورتحساب درمان',
      icon: FaFileInvoice,
      roles: ['receptionist'],
      section: 'منشی'
    },
    
    // ===== ادمین =====
    {
      path: '/admin/users',
      label: 'مدیریت کاربران',
      icon: FaUsers,
      roles: ['admin'],
      section: 'ادمین'
    },
    {
      path: '/admin/appointments',
      label: 'مدیریت نوبت‌ها',
      icon: FaCalendarAlt,
      roles: ['admin'],
      section: 'ادمین'
    },
    {
      path: '/admin/contact-messages',
      label: 'پیام‌های تماس',
      icon: FaEnvelope,
      roles: ['admin'],
      section: 'ادمین'
    },
    {
      path: '/admin/inventory',
      label: 'مدیریت انبار',
      icon: FaBoxes,
      roles: ['admin'],
      section: 'ادمین'
    },
    {
      path: '/admin/financial-report',
      label: 'گزارشات مالی',
      icon: FaMoneyBillWave,
      roles: ['admin'],
      section: 'ادمین'
    },
    {
      path: '/admin/clinics',
      label: 'مدیریت کلینیک',
      icon: FaHospital,
      roles: ['admin'],
      section: 'ادمین'
    },

    // ===== عمومی (همه کاربران) =====
    {
      path: '/profile',
      label: 'پروفایل',
      icon: FaCog,
      roles: ['patient', 'doctor', 'admin', 'receptionist'],
      section: 'عمومی'
    },
  ]

  // ===== فیلتر کردن منوها بر اساس نقش کاربر =====
  const filteredMenu = menuItems.filter(item => {
    if (isAdmin) return true
    return item.roles.includes(userRole)
  })

  // ===== حذف آیتم‌های تکراری =====
  const uniqueMenu = filteredMenu.filter((item, index, self) => 
    index === self.findIndex((t) => t.path === item.path && t.label === item.label)
  )

  // ===== گروه‌بندی منوها بر اساس بخش =====
  const groupedMenu: { [key: string]: typeof uniqueMenu } = {}
  uniqueMenu.forEach(item => {
    const section = item.section || 'سایر'
    if (!groupedMenu[section]) {
      groupedMenu[section] = []
    }
    groupedMenu[section].push(item)
  })

  // ===== بررسی فعال بودن مسیر =====
  const isActive = (path: string) => {
    if (path === getDashboardPath(userRole)) {
      return location.pathname === '/patient/dashboard' || 
             location.pathname === '/admin/dashboard' || 
             location.pathname === '/doctor/dashboard' || 
             location.pathname === '/receptionist/dashboard' ||
             location.pathname === '/dashboard'
    }
    return location.pathname === path
  }

  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-20'

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out z-40 ${sidebarWidth} flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${!sidebarOpen ? 'flex-col gap-2' : ''}`}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-3xl">💎</span>
                <div>
                  <h2 className="text-xl font-bold text-gold">کلینیک زیبایی</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">مرکز تخصصی پوست و مو</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:flex"
              >
                <FaChevronRight className="text-gray-700 dark:text-gray-300 text-lg" />
              </button>
            </>
          ) : (
            <>
              <span className="text-3xl">💎</span>
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:flex"
              >
                <FaChevronLeft className="text-gray-700 dark:text-gray-300 text-lg" />
              </button>
            </>
          )}
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
          >
            <FaTimes className="text-gray-700 dark:text-gray-300 text-xl" />
          </button>
        </div>

        {/* User info */}
        {sidebarOpen && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gold-light/10 dark:bg-gold-dark/5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-darkblue dark:text-white truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-3">
          {Object.entries(groupedMenu).length === 0 ? (
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
              هیچ منویی موجود نیست
            </p>
          ) : (
            Object.entries(groupedMenu).map(([section, items]) => (
              <div key={section}>
                {sidebarOpen && (
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
                    {section}
                  </p>
                )}
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path)
                    const isAdminItem = item.roles.includes('admin') && !item.roles.includes('receptionist') && !item.roles.includes('patient') && !item.roles.includes('doctor')
                    const isReceptionistItem = item.roles.includes('receptionist') && !item.roles.includes('admin')
                    const isDoctorItem = item.roles.includes('doctor') && !item.roles.includes('admin')
                    const isPatientItem = item.roles.includes('patient') && !item.roles.includes('admin')
                    const isDashboard = item.isDashboard || false
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          active
                            ? 'bg-gold text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setSidebarOpen(false)
                          }
                        }}
                        title={!sidebarOpen ? item.label : ''}
                      >
                        <Icon className={`text-lg ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400'} flex-shrink-0`} />
                        
                        {sidebarOpen && (
                          <div className="flex-1 min-w-0 flex items-center justify-between">
                            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                            
                            {isAdmin && isAdminItem && (
                              <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">مدیر</span>
                            )}
                            {isAdmin && isReceptionistItem && (
                              <span className="text-[8px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">منشی</span>
                            )}
                            {userRole === 'receptionist' && isReceptionistItem && (
                              <span className="text-[8px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">منشی</span>
                            )}
                            {isDashboard && active && (
                              <span className="text-[8px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">فعال</span>
                            )}
                          </div>
                        )}
                        
                        {!sidebarOpen && isAdmin && isAdminItem && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        {!sidebarOpen && isAdmin && isReceptionistItem && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                        )}
                        {!sidebarOpen && userRole === 'receptionist' && isReceptionistItem && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                        )}
                        {!sidebarOpen && isDashboard && active && (
                          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full"></span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
            title={!sidebarOpen ? 'خروج' : ''}
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">خروج</span>}
          </button>
          
          {sidebarOpen && (
            <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-2">
              نسخه 2.0.0
            </p>
          )}
        </div>
      </aside>
    </>
  )
}