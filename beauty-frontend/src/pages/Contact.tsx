// Path: frontend/src/pages/Contact.tsx
import { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import { 
  FaSpinner, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaInstagram, FaTelegram, FaWhatsapp, FaUser, FaReply, 
  FaPaperPlane, FaChevronDown, FaChevronUp, FaCheckCircle,
  FaClock as FaClockIcon, FaTimesCircle, FaUserCircle,
  FaHeadset, FaArrowLeft
} from 'react-icons/fa'

interface ClinicData {
  id: number
  clinicName: string
  clinicCode: string
  address: string
  phone: string
  mobile: string
  email: string
  website: string
  managerName: string
  managerPhone: string
  logo: string
  description: string
  isActive: number
  contact: {
    contactAddress: string
    addressLink: string
    phone1: string
    phone2: string
    email1: string
    email2: string
    workingHours: string
    workingHoursDescription: string
    mapUrl: string
    contactTitle: string
    contactSubtitle: string
    responseTime: string
    supportMessage: string
    socialInstagram: string
    socialTelegram: string
    socialWhatsapp: string
  }
}

interface Message {
  id: number
  userId: number | null
  name: string
  email: string | null
  phone: string
  subject: string
  message: string
  reply: string | null
  status: 'pending' | 'read' | 'replied'
  isReply: number
  parentId: number | null
  createdAt: string
  repliedAt: string | null
}

export default function Contact() {
  const { user } = useContext(AuthContext)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [clinicData, setClinicData] = useState<ClinicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userMessages, setUserMessages] = useState<Message[]>([])
  const [showMessages, setShowMessages] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    parentId: null as number | null
  })
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  useEffect(() => {
    fetchClinicData()
    if (user) {
      fetchUserMessages()
    }
  }, [])

  // اسکرول به انتهای پیام‌ها
  useEffect(() => {
    if (showMessages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [userMessages, showMessages])

  const fetchClinicData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('access_token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      const response = await axios.get('/api/v1/clinics/current')
      setClinicData(response.data)
    } catch (error: any) {
      console.error('Error fetching clinic data:', error)
      setError('خطا در دریافت اطلاعات تماس')
      toast.error('خطا در دریافت اطلاعات تماس')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserMessages = async () => {
    try {
      const response = await axios.get('/api/v1/contact/my-messages')
      setUserMessages(response.data || [])
    } catch (error: any) {
      console.error('Error fetching user messages:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        parentId: formData.parentId
      }

      const response = await axios.post('/api/v1/contact', data)
      toast.success(response.data.message || 'پیام شما با موفقیت ارسال شد')
      
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: '',
        parentId: null 
      })
      setReplyingTo(null)
      setSelectedConversation(null)
      
      if (user) {
        await fetchUserMessages()
        setShowMessages(true)
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast.error(error.response?.data?.message || 'خطا در ارسال پیام')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = (message: Message) => {
    setReplyingTo(message.id)
    setSelectedConversation(message)
    setFormData({
      ...formData,
      parentId: message.id,
      subject: `پاسخ به: ${message.subject}`,
      message: ''
    })
    setTimeout(() => {
      document.getElementById('message-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'text-yellow-500', icon: <FaClockIcon />, label: 'در انتظار پاسخ' }
      case 'read':
        return { color: 'text-blue-500', icon: <FaCheckCircle />, label: 'خوانده شده' }
      case 'replied':
        return { color: 'text-green-500', icon: <FaCheckCircle />, label: 'پاسخ داده شده' }
      default:
        return { color: 'text-gray-500', icon: <FaClockIcon />, label: status }
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // دریافت پیام‌های یک مکالمه
  const getConversationMessages = (parentId: number | null): Message[] => {
    if (parentId === null) return []
    
    const messages: Message[] = []
    // پیدا کردن پیام اصلی
    const parent = userMessages.find(m => m.id === parentId)
    if (parent) {
      messages.push(parent)
      // پیدا کردن پاسخ‌ها
      const replies = userMessages.filter(m => m.parentId === parentId)
      messages.push(...replies)
    }
    return messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gold mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری اطلاعات تماس...</p>
        </div>
      </div>
    )
  }

  const contact = clinicData?.contact || {}

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-16">
      <main className="container mx-auto px-4 py-8">
        {/* ===== Header ===== */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-darkblue dark:text-white mb-4">
            {contact?.contactTitle || '📞 تماس با ما'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {contact?.contactSubtitle || 'برای رزرو نوبت، مشاوره و یا هرگونه سوال با ما در ارتباط باشید'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchClinicData}
              className="text-sm text-red-600 dark:text-red-400 hover:underline mt-2"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== اطلاعات تماس ===== */}
          <div className="lg:col-span-1 space-y-6">
            {/* آدرس */}
            {(clinicData?.address || contact?.contactAddress) && (
              <div className="card dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-gold">📍</div>
                  <div>
                    <h3 className="font-bold text-darkblue dark:text-white mb-2">آدرس</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {contact?.contactAddress || clinicData?.address}
                    </p>
                    {contact?.addressLink && (
                      <a 
                        href={contact.addressLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gold text-sm hover:underline mt-1 inline-block"
                      >
                        مشاهده در نقشه
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* تلفن */}
            {(contact?.phone1 || clinicData?.phone) && (
              <div className="card dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-gold">📞</div>
                  <div>
                    <h3 className="font-bold text-darkblue dark:text-white mb-2">تلفن</h3>
                    {contact?.phone1 && (
                      <a href={`tel:${contact.phone1}`} className="text-gray-600 dark:text-gray-400 text-sm hover:text-gold block">
                        {contact.phone1}
                      </a>
                    )}
                    {contact?.phone2 && (
                      <a href={`tel:${contact.phone2}`} className="text-gray-600 dark:text-gray-400 text-sm hover:text-gold block mt-1">
                        {contact.phone2}
                      </a>
                    )}
                    {!contact?.phone1 && clinicData?.phone && (
                      <a href={`tel:${clinicData.phone}`} className="text-gray-600 dark:text-gray-400 text-sm hover:text-gold block">
                        {clinicData.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ایمیل */}
            {(contact?.email1 || clinicData?.email) && (
              <div className="card dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-gold">✉️</div>
                  <div>
                    <h3 className="font-bold text-darkblue dark:text-white mb-2">ایمیل</h3>
                    {contact?.email1 && (
                      <a href={`mailto:${contact.email1}`} className="text-gray-600 dark:text-gray-400 text-sm hover:text-gold block">
                        {contact.email1}
                      </a>
                    )}
                    {contact?.email2 && (
                      <a href={`mailto:${contact.email2}`} className="text-gray-600 dark:text-gray-400 text-sm hover:text-gold block mt-1">
                        {contact.email2}
                      </a>
                    )}
                    {!contact?.email1 && clinicData?.email && (
                      <a href={`mailto:${clinicData.email}`} className="text-gray-600 dark:text-gray-400 text-sm hover:text-gold block">
                        {clinicData.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ساعات کاری */}
            {contact?.workingHours && (
              <div className="card dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-gold">🕐</div>
                  <div>
                    <h3 className="font-bold text-darkblue dark:text-white mb-2">ساعات کاری</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{contact.workingHours}</p>
                    {contact.workingHoursDescription && (
                      <p className="text-xs text-gray-400 mt-1">{contact.workingHoursDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* وضعیت پاسخگویی */}
            <div className="card dark:bg-gray-800 bg-gold-light/10 dark:bg-gold-dark/5">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {contact?.responseTime || 'پاسخگویی ۲۴ ساعته'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {contact?.supportMessage || 'پیام شما در اسرع وقت پاسخ داده می‌شود'}
                </p>
              </div>
            </div>

            {/* شبکه‌های اجتماعی */}
            {(contact?.socialInstagram || contact?.socialTelegram || contact?.socialWhatsapp) && (
              <div className="card dark:bg-gray-800">
                <h3 className="font-bold text-darkblue dark:text-white mb-3 text-center">ما را دنبال کنید</h3>
                <div className="flex justify-center gap-4">
                  {contact?.socialInstagram && (
                    <a 
                      href={contact.socialInstagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
                    >
                      <FaInstagram />
                    </a>
                  )}
                  {contact?.socialTelegram && (
                    <a 
                      href={contact.socialTelegram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
                    >
                      <FaTelegram />
                    </a>
                  )}
                  {contact?.socialWhatsapp && (
                    <a 
                      href={contact.socialWhatsapp} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"
                    >
                      <FaWhatsapp />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ===== فرم تماس و پیام‌ها ===== */}
          <div className="lg:col-span-2 space-y-6">
            {/* ===== نمایش پیام‌های قبلی به صورت چت روم ===== */}
            {user && userMessages.length > 0 && (
              <div className="card dark:bg-gray-800">
                <button
                  className="w-full flex items-center justify-between text-right p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  onClick={() => {
                    setShowMessages(!showMessages)
                    if (!showMessages) {
                      setSelectedConversation(null)
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <FaHeadset className="text-gold text-xl" />
                    <span className="font-bold text-darkblue dark:text-white">
                      پیام‌های من
                    </span>
                    <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">
                      {userMessages.filter(m => m.isReply === 0).length}
                    </span>
                  </div>
                  {showMessages ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {showMessages && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {/* لیست مکالمات */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {userMessages.filter(m => m.isReply === 0).map((msg) => {
                        const replies = userMessages.filter(r => r.parentId === msg.id)
                        const status = getStatusBadge(msg.status)
                        const lastReply = replies.length > 0 ? replies[replies.length - 1] : null
                        
                        return (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                              selectedConversation?.id === msg.id
                                ? 'bg-gold/10 border-2 border-gold'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-2 border-transparent'
                            }`}
                            onClick={() => {
                              setSelectedConversation(msg)
                              setReplyingTo(null)
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-darkblue dark:text-white">
                                    {msg.subject}
                                  </span>
                                  <span className={`text-xs flex items-center gap-1 ${status.color}`}>
                                    {status.icon}
                                    {status.label}
                                  </span>
                                  {replies.length > 0 && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                      {replies.length} پاسخ
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                                  {msg.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDate(msg.createdAt)}
                                </p>
                              </div>
                              <div className="mr-2">
                                <FaChevronDown className="text-gray-400 text-xs" />
                              </div>
                            </div>

                            {/* نمایش پاسخ‌ها در صورت انتخاب */}
                            {selectedConversation?.id === msg.id && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                {/* پیام اصلی */}
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {user?.fullName?.charAt(0) || 'ش'}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tr-none p-3">
                                      <p className="text-sm text-gray-800 dark:text-gray-200">
                                        {msg.message}
                                      </p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {formatTime(msg.createdAt)} - {formatDate(msg.createdAt)}
                                    </p>
                                  </div>
                                </div>

                                {/* پاسخ‌ها */}
                                {replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start gap-3 mr-8">
                                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-bold flex-shrink-0">
                                      <FaHeadset className="text-sm" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="bg-gold/10 dark:bg-gold/20 rounded-2xl rounded-tl-none p-3 border-r-4 border-gold">
                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                          {reply.reply || reply.message}
                                        </p>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {formatTime(reply.createdAt)} - {formatDate(reply.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                ))}

                                {/* دکمه پاسخ */}
                                {msg.status !== 'replied' && (
                                  <button
                                    onClick={() => handleReply(msg)}
                                    className="mt-3 text-gold hover:text-gold-dark text-sm flex items-center gap-1 transition-colors"
                                  >
                                    <FaReply />
                                    پاسخ
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            )}

            {/* ===== فرم ارسال پیام ===== */}
            <div className="card dark:bg-gray-800" id="message-form">
              <h2 className="text-2xl font-bold text-darkblue dark:text-white mb-6">
                {replyingTo ? 'پاسخ به پیام' : 'ارسال پیام جدید'}
              </h2>
              
              {replyingTo && (
                <div className="mb-4 p-3 bg-gold-light/20 dark:bg-gold-dark/10 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    در حال پاسخ به: {selectedConversation?.subject}
                  </span>
                  <button
                    onClick={() => {
                      setReplyingTo(null)
                      setSelectedConversation(null)
                      setFormData({ ...formData, parentId: null, subject: '', message: '' })
                    }}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    لغو
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      placeholder="نام کامل خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                      ایمیل
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                      شماره موبایل *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                      موضوع *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      placeholder="موضوع پیام"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                    متن پیام *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    placeholder={replyingTo ? 'متن پاسخ خود را بنویسید...' : 'پیام خود را بنویسید...'}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      {replyingTo ? 'ارسال پاسخ' : 'ارسال پیام'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}