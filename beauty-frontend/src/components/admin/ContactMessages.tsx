// Path: frontend/src/components/admin/ContactMessages.tsx
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  FaEnvelope, 
  FaUser, 
  FaPhone, 
  FaCalendar, 
  FaCheckCircle, 
  FaTimesCircle,
  FaReply,
  FaTrash,
  FaSearch,
  FaSpinner
} from 'react-icons/fa'

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
  repliedAt?: string
  reply?: string
}

export default function ContactMessages() {
  const { user, logout } = useContext(AuthContext)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('access_token')
      if (!token) {
        toast.error('لطفاً وارد سیستم شوید')
        logout()
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const response = await axios.get('/api/v1/contact/messages')
      
      setMessages(response.data.map((msg: any) => ({
        ...msg,
        createdAt: msg.createdAt || msg.created_at,
        repliedAt: msg.repliedAt || msg.replied_at
      })))
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      toast.error('خطا در دریافت پیام‌ها')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await axios.put(`/api/v1/contact/messages/${id}/read`)
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, status: 'read' } : msg
      ))
      toast.success('پیام به عنوان خوانده شده علامت‌گذاری شد')
    } catch (error) {
      toast.error('خطا در بروزرسانی وضعیت')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return
    
    try {
      await axios.delete(`/api/v1/contact/messages/${id}`)
      setMessages(prev => prev.filter(msg => msg.id !== id))
      toast.success('پیام حذف شد')
    } catch (error) {
      toast.error('خطا در حذف پیام')
    }
  }

  const handleReply = async () => {
    if (!selectedMessage) return
    if (!replyText.trim()) {
      toast.error('لطفاً متن پاسخ را وارد کنید')
      return
    }

    setReplying(true)
    try {
      await axios.post(`/api/v1/contact/messages/${selectedMessage.id}/reply`, {
        reply: replyText
      })
      
      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id ? { 
          ...msg, 
          status: 'replied', 
          reply: replyText, 
          repliedAt: new Date().toISOString() 
        } : msg
      ))
      
      toast.success('پاسخ با موفقیت ارسال شد')
      setShowReplyModal(false)
      setReplyText('')
      setSelectedMessage(null)
    } catch (error) {
      toast.error('خطا در ارسال پاسخ')
    } finally {
      setReplying(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      unread: 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
      read: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      replied: 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
    }
    const labels = {
      unread: '🔴 خوانده نشده',
      read: '🔵 خوانده شده',
      replied: '✅ پاسخ داده شده'
    }
    return { 
      style: styles[status as keyof typeof styles] || styles.unread, 
      label: labels[status as keyof typeof labels] || status 
    }
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    try {
      return new Date(date).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return date
    }
  }

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || msg.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter(m => m.status === 'unread').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری پیام‌ها...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-darkblue dark:text-white flex items-center gap-3">
            <FaEnvelope className="text-gold" />
            پیام‌های تماس
            {unreadCount > 0 && (
              <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">
                {unreadCount} جدید
              </span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            مدیریت پیام‌های ارسال شده از طریق فرم تماس
          </p>
        </div>
        <button 
          onClick={fetchMessages}
          className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
        >
          <FaSpinner className={loading ? 'animate-spin' : ''} />
          بروزرسانی
        </button>
      </div>

      {/* Filters */}
      <div className="card dark:bg-gray-800 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="جستجو در پیام‌ها..."
              className="input-field w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">همه پیام‌ها</option>
              <option value="unread">خوانده نشده</option>
              <option value="read">خوانده شده</option>
              <option value="replied">پاسخ داده شده</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="card dark:bg-gray-800">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ پیامی یافت نشد</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMessages.map((message) => {
              const { style, label } = getStatusBadge(message.status)
              return (
                <div 
                  key={message.id} 
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    message.status === 'unread' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-darkblue dark:text-white">
                          {message.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${style}`}>
                          {label}
                        </span>
                        {message.status === 'unread' && (
                          <span className="text-xs text-red-500 animate-pulse">جدید</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <FaEnvelope className="inline ml-1 text-xs" />
                        {message.email}
                        {message.phone && (
                          <span className="mr-3">
                            <FaPhone className="inline ml-1 text-xs" />
                            {message.phone}
                          </span>
                        )}
                      </p>
                      <p className="text-sm font-medium text-darkblue dark:text-white mt-1">
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <FaCalendar className="text-xs" />
                        {formatDate(message.createdAt)}
                      </p>
                      {message.reply && (
                        <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">پاسخ ارسال شده:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{message.reply}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {message.repliedAt && formatDate(message.repliedAt)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {message.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="علامت‌گذاری به عنوان خوانده شده"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedMessage(message)
                          setReplyText('')
                          setShowReplyModal(true)
                        }}
                        className="p-2 text-gold hover:bg-gold-light dark:hover:bg-gold-dark/20 rounded-lg transition-colors"
                        title="پاسخ به پیام"
                      >
                        <FaReply />
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="حذف پیام"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-darkblue dark:text-white">
                پاسخ به پیام
              </h2>
              <button
                onClick={() => {
                  setShowReplyModal(false)
                  setSelectedMessage(null)
                  setReplyText('')
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTimesCircle className="text-gray-500 text-xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">از:</p>
                <p className="font-medium text-darkblue dark:text-white">{selectedMessage.name}</p>
                <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                {selectedMessage.phone && (
                  <p className="text-sm text-gray-500">تلفن: {selectedMessage.phone}</p>
                )}
                <p className="text-sm font-medium text-darkblue dark:text-white mt-2">
                  موضوع: {selectedMessage.subject}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  متن پاسخ
                </label>
                <textarea
                  className="input-field w-full min-h-[150px]"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="متن پاسخ خود را وارد کنید..."
                  disabled={replying}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleReply}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={replying || !replyText.trim()}
                >
                  {replying ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <FaReply />
                      ارسال پاسخ
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setSelectedMessage(null)
                    setReplyText('')
                  }}
                  className="btn-secondary"
                  disabled={replying}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}