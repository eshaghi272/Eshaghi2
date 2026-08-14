// Path: frontend/src/components/layout/Header.tsx
import { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import { NotificationContext } from '../../context/NotificationContext'
import ColorPicker from '../common/ColorPicker'
import { 
  FaBars,
  FaSun, 
  FaMoon, 
  FaBell, 
  FaUser, 
  FaSignOutAlt, 
  FaUserCircle,
  FaSearch,
  FaTimes,
  FaHome,
  FaCog
} from 'react-icons/fa'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const { theme, toggleTheme, colors } = useContext(ThemeContext)
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useContext(NotificationContext)
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  // تابع دریافت حروف اول نام - با بررسی وجود user
  const getUserInitials = () => {
    if (!user || !user.fullName) return '?'
    const names = user.fullName.split(' ')
    if (names.length >= 2) {
      return names[0][0] + names[1][0]
    }
    return user.fullName.substring(0, 2)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'لحظاتی پیش'
    if (minutes < 60) return `${minutes} دقیقه پیش`
    if (hours < 24) return `${hours} ساعت پیش`
    if (days < 7) return `${days} روز پیش`
    return new Date(date).toLocaleDateString('fa-IR')
  }

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 h-16"
      style={{ borderBottom: `2px solid ${colors?.primary || '#C9A96E'}20` }}
    >
      <div className="flex items-center justify-between px-3 md:px-6 h-full max-w-7xl mx-auto">
        {/* ===== RIGHT SECTION - Logo and Menu Toggle ===== */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-gray-700 dark:text-gray-300 text-xl" />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
              style={{ backgroundColor: colors?.primary || '#C9A96E' }}
            >
              💎
            </div>
            <div className="hidden sm:block">
              <span 
                className="text-xl font-bold transition-colors duration-300"
                style={{ color: colors?.primary || '#C9A96E' }}
              >
                کلینیک زیبایی
              </span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">
                مرکز تخصصی پوست و مو
              </p>
            </div>
          </Link>
        </div>

        {/* ===== CENTER - Search ===== */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="جستجو در کلینیک..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none transition-all duration-200"
                style={{ 
                  borderColor: searchQuery ? (colors?.primary || '#C9A96E') : 'var(--border-color)',
                  boxShadow: searchQuery ? `0 0 0 3px ${colors?.primary || '#C9A96E'}30` : 'none'
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:transition-colors duration-200"
                style={{ color: searchQuery ? (colors?.primary || '#C9A96E') : '#9CA3AF' }}
              >
                <FaSearch className="text-sm" />
              </button>
            </form>
          </div>
        </div>

        {/* ===== LEFT SECTION - تمام آیتم‌ها در یک ردیف ===== */}
        <div className="flex items-center gap-1 md:gap-1.5">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden"
            aria-label="Search"
          >
            <FaSearch className="text-gray-700 dark:text-gray-300 text-lg" />
          </button>

          <ColorPicker />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <FaMoon className="text-gray-700 dark:text-gray-300 text-xl" />
            ) : (
              <FaSun className="text-yellow-400 text-xl" />
            )}
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              aria-label="Notifications"
            >
              <FaBell className="text-gray-700 dark:text-gray-300 text-xl" />
              {unreadCount > 0 && (
                <span 
                  className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg animate-pulse"
                  style={{ backgroundColor: colors?.primary || '#C9A96E' }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-[340px] md:w-[420px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                <div 
                  className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
                  style={{ backgroundColor: `${colors?.primary || '#C9A96E'}10` }}
                >
                  <span className="font-bold text-darkblue dark:text-white">اعلان‌ها</span>
                  <div className="flex gap-3">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-medium hover:underline transition-colors"
                        style={{ color: colors?.primary || '#C9A96E' }}
                      >
                        خواندن همه
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                      >
                        پاک کردن همه
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-5xl mb-3">🔔</div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">هیچ اعلانی وجود ندارد</p>
                      <p className="text-xs text-gray-400 mt-1">با ما همراه باشید</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                          !notif.read ? 'border-r-4' : ''
                        }`}
                        style={!notif.read ? { borderRightColor: colors?.primary || '#C9A96E' } : {}}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-darkblue dark:text-white">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatTime(notif.created_at)}
                            </p>
                          </div>
                          {!notif.read && (
                            <span 
                              className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                              style={{ backgroundColor: colors?.primary || '#C9A96E' }}
                            />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md transition-all duration-300 group-hover:scale-105"
                  style={{ backgroundColor: colors?.primary || '#C9A96E' }}
                >
                  {getUserInitials()}
                </div>
                <span className="text-sm font-medium text-darkblue dark:text-white hidden lg:block">
                  {user.fullName}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div 
                    className="p-4 border-b border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: `${colors?.primary || '#C9A96E'}10` }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                        style={{ backgroundColor: colors?.primary || '#C9A96E' }}
                      >
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="font-bold text-darkblue dark:text-white">{user.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.mobile}</p>
                        {user.email && (
                          <p className="text-xs text-gray-400">{user.email}</p>
                        )}
                      </div>
                    </div>
                    <span 
                      className="inline-block mt-2 px-3 py-0.5 text-xs rounded-full font-medium"
                      style={{ 
                        backgroundColor: `${colors?.primary || '#C9A96E'}20`,
                        color: colors?.primary || '#C9A96E'
                      }}
                    >
                      {user.role === 'admin' ? 'مدیر' : user.role === 'doctor' ? 'پزشک' : 'بیمار'}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUser className="text-gray-500 text-sm" />
                      <span className="text-sm text-darkblue dark:text-white">پروفایل</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaHome className="text-gray-500 text-sm" />
                      <span className="text-sm text-darkblue dark:text-white">داشبورد</span>
                    </Link>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                    
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FaSignOutAlt className="text-red-500 text-sm" />
                      <span className="text-sm text-red-500">خروج از حساب</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-white font-medium text-sm transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: colors?.primary || '#C9A96E' }}
              >
                ورود
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl font-medium text-sm border-2 transition-all duration-300 hover:scale-105"
                style={{ 
                  borderColor: colors?.primary || '#C9A96E',
                  color: colors?.primary || '#C9A96E'
                }}
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 p-3 shadow-lg border-b border-gray-200 dark:border-gray-700 animate-slideDown">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none"
              style={{ 
                borderColor: searchQuery ? (colors?.primary || '#C9A96E') : 'var(--border-color)',
                boxShadow: searchQuery ? `0 0 0 3px ${colors?.primary || '#C9A96E'}30` : 'none'
              }}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              style={{ color: searchQuery ? (colors?.primary || '#C9A96E') : '#9CA3AF' }}
            >
              <FaSearch className="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  )
}