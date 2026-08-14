// Path: frontend/src/components/admin/Users.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { 
  FaUsers, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUserCheck, 
  FaUserTimes,
  FaUserMd,
  FaUser,
  FaUserGraduate,
  FaFilter,
  FaTimes
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface User {
  id: number
  fullName: string
  nationalCode: string
  mobile: string
  email: string | null
  role: string
  isActive: number
  createdAt: string
  doctor?: {
    specialty: string
    consultationFee: number
  }
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/users')
      setUsers(response.data)
    } catch (error: any) {
      console.error('Error fetching users:', error)
      toast.error('خطا در دریافت لیست کاربران')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: number) => {
    if (!confirm('آیا از حذف این کاربر مطمئن هستید؟')) return

    try {
      await axios.delete(`/api/v1/users/${id}`)
      toast.success('کاربر با موفقیت حذف شد')
      fetchUsers()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error('خطا در حذف کاربر')
    }
  }

  const toggleUserStatus = async (id: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1
      await axios.put(`/api/v1/users/${id}`, { isActive: newStatus })
      toast.success(`کاربر ${newStatus === 1 ? 'فعال' : 'غیرفعال'} شد`)
      fetchUsers()
    } catch (error: any) {
      console.error('Error toggling user status:', error)
      toast.error('خطا در تغییر وضعیت کاربر')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FaUserGraduate className="text-red-500" />
      case 'doctor':
        return <FaUserMd className="text-blue-500" />
      case 'receptionist':
        return <FaUser className="text-purple-500" />
      default:
        return <FaUser className="text-green-500" />
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'مدیر',
      doctor: 'پزشک',
      receptionist: 'منشی',
      patient: 'بیمار'
    }
    return labels[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      doctor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      receptionist: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      patient: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  const getStatusBadge = (isActive: number) => {
    return isActive === 1
      ? { style: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'فعال' }
      : { style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'غیرفعال' }
  }

  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm) ||
      user.nationalCode.includes(searchTerm)
    
    const matchRole = filterRole === 'all' || user.role === filterRole
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.isActive === 1) ||
      (filterStatus === 'inactive' && user.isActive === 0)
    
    return matchSearch && matchRole && matchStatus
  })

  const roles = [
    { value: 'all', label: 'همه نقش‌ها' },
    { value: 'admin', label: 'مدیر' },
    { value: 'doctor', label: 'پزشک' },
    { value: 'receptionist', label: 'منشی' },
    { value: 'patient', label: 'بیمار' }
  ]

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
    
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">مدیریت کاربران</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {users.length} کاربر در سیستم
            </p>
          </div>
          <Link to="/admin/users/add" className="btn-primary flex items-center gap-2">
            <FaPlus />
            افزودن کاربر
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="جستجو بر اساس نام، موبایل یا کد ملی..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            className="input-field max-w-[180px]"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <select
            className="input-field max-w-[160px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterRole('all')
              setFilterStatus('all')
              fetchUsers()
            }}
            className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
          >
            <FaTimes />
            پاک کردن فیلترها
          </button>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">👤</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ کاربری یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">کاربر</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">اطلاعات تماس</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">نقش</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">وضعیت</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const status = getStatusBadge(user.isActive)
                  return (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-white font-bold text-sm">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-darkblue dark:text-white">{user.fullName}</p>
                            <p className="text-xs text-gray-400">{user.nationalCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.mobile}</p>
                        {user.email && (
                          <p className="text-xs text-gray-400">{user.email}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                          {user.role === 'doctor' && user.doctor && (
                            <span className="text-xs text-gray-400">
                              {user.doctor.specialty}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.style}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`text-sm py-1 px-3 rounded-lg flex items-center gap-1 transition-colors ${
                              user.isActive === 1
                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {user.isActive === 1 ? (
                              <><FaUserCheck className="text-sm" /> فعال</>
                            ) : (
                              <><FaUserTimes className="text-sm" /> غیرفعال</>
                            )}
                          </button>
                          <Link
                            to={`/admin/users/edit/${user.id}`}
                            className="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
                          >
                            <FaEdit className="text-sm" />
                            ویرایش
                          </Link>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="btn-danger text-xs py-1 px-3 flex items-center gap-1"
                            >
                              <FaTrash className="text-sm" />
                              حذف
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    
  )
}