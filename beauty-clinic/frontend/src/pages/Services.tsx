// Path: frontend/src/pages/Services.tsx
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { 
  FaSearch, 
  FaClock, 
  FaMoneyBillWave, 
  FaTag, 
  FaSpinner,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaFilter
} from 'react-icons/fa'
import { getCategoryIcon, getFallbackImage } from '../utils/images'

interface Service {
  id: number
  name: string
  description: string | null
  price: number
  duration_minutes: number
  category: string | null
  is_active: boolean
  imageUrl: string | null
  rating?: number
  reviewCount?: number
}

// ===== تصاویر پیش‌فرض برای هر دسته‌بندی =====
const categoryImages: Record<string, string> = {
  'تزریقات': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
  'لیزر': 'https://images.unsplash.com/photo-1623831379238-0d5b3180ea45?w=600&h=400&fit=crop',
  'پوست': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71a9?w=600&h=400&fit=crop',
  'لیفتینگ': 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=400&fit=crop',
  'مو': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=400&fit=crop'
}

export default function Services() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('همه')
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get('/api/v1/services/public')
      setServices(response.data || [])
    } catch (error: any) {
      console.error('Error fetching services:', error)
      setError('خطا در دریافت لیست خدمات')
      toast.error('خطا در دریافت لیست خدمات')
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  // ===== تابع هدایت به صفحه رزرو نوبت =====
  const handleBookAppointment = (e: React.MouseEvent, serviceId?: number) => {
    e.preventDefault()
    
    if (user) {
      // اگر کاربر لاگین است، به صفحه رزرو نوبت برو
      const url = serviceId 
        ? `/patient/book-appointment?service=${serviceId}`
        : '/patient/book-appointment'
      navigate(url)
    } else {
      // اگر لاگین نیست، به صفحه لاگین برو با پارامتر redirect
      const redirectUrl = serviceId 
        ? `/patient/book-appointment?service=${serviceId}`
        : '/patient/book-appointment'
      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
      toast.info('لطفاً ابتدا وارد حساب کاربری خود شوید')
    }
  }

  // استخراج دسته‌بندی‌ها
  const categories = ['همه', ...new Set(services.map(s => s.category).filter(Boolean) as string[])]

  // فیلتر کردن خدمات
  const filteredServices = services.filter(service => {
    const matchCategory = selectedCategory === 'همه' || service.category === selectedCategory
    const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchCategory && matchSearch
  })

  const formatPrice = (price: number) => price.toLocaleString('fa-IR')

  // ===== تابع دریافت تصویر خدمت =====
  const getServiceImage = (service: Service): string => {
    if (service.imageUrl) {
      return service.imageUrl
    }
    if (service.category && categoryImages[service.category]) {
      return categoryImages[service.category]
    }
    return categoryImages.default
  }

  const renderStars = (rating: number = 0) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - Math.ceil(rating)

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        {hasHalfStar && <FaStarHalf className="text-yellow-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gold mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری خدمات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pt-16">
      <main className="container mx-auto px-4 py-8">
        {/* ===== Header ===== */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-darkblue dark:text-white mb-4">
            💎 خدمات زیبایی
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            ما در کلینیک زیبایی با به‌روزترین روش‌ها و تجهیزات، خدمات متنوعی را ارائه می‌دهیم
          </p>
        </div>

        {/* ===== فیلترها ===== */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              className="input-field pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              placeholder="جستجوی خدمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full transition-all duration-200 text-sm flex items-center gap-2 ${
                selectedCategory === 'همه'
                  ? 'bg-gold text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedCategory('همه')}
            >
              <FaFilter className="text-xs" />
              همه
            </button>
            {categories.filter(c => c !== 'همه').map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full transition-all duration-200 text-sm ${
                  selectedCategory === category
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchServices}
              className="text-sm text-red-600 dark:text-red-400 hover:underline mt-2"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* ===== لیست خدمات ===== */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ خدمتی با این مشخصات یافت نشد</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('همه')
              }}
              className="text-gold hover:underline mt-2"
            >
              حذف فیلترها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="card dark:bg-gray-800 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  {/* ===== تصویر ===== */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getServiceImage(service)}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = categoryImages.default
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* ===== برچسب دسته‌بندی ===== */}
                    {service.category && (
                      <span className="absolute top-3 right-3 text-xs bg-white/90 dark:bg-gray-800/90 text-gold px-3 py-1 rounded-full shadow-md">
                        {service.category}
                      </span>
                    )}
                    
                    {/* ===== آیکون دسته‌بندی ===== */}
                    <div className="absolute bottom-3 left-3 text-white text-2xl drop-shadow-lg">
                      {getCategoryIcon(service.category || 'default')}
                    </div>
                    
                    {/* ===== وضعیت ===== */}
                    {service.is_active && (
                      <span className="absolute top-3 left-3 text-xs bg-green-500 text-white px-3 py-1 rounded-full shadow-md">
                        فعال
                      </span>
                    )}
                  </div>

                  {/* ===== محتوا ===== */}
                  <div className="flex-1 p-5">
                    <h3 className="text-xl font-bold text-darkblue dark:text-white line-clamp-1 mb-2">
                      {service.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {service.description || 'توضیحاتی برای این خدمت ثبت نشده است'}
                    </p>

                    {/* ===== امتیاز ===== */}
                    {service.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(service.rating)}
                        <span className="text-xs text-gray-500">
                          ({service.reviewCount || 0} نظر)
                        </span>
                      </div>
                    )}

                    {/* ===== قیمت و مدت زمان ===== */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-gold text-sm" />
                        <span className="text-gold font-bold text-lg">
                          {formatPrice(service.price)} تومان
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <FaClock className="text-gold text-xs" />
                        {service.duration_minutes} دقیقه
                      </div>
                    </div>

                    {/* ===== دکمه رزرو نوبت ===== */}
                    <button
                      onClick={(e) => handleBookAppointment(e, service.id)}
                      className="btn-primary w-full mt-4 text-sm flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
                    >
                      <FaTag className="text-xs" />
                      رزرو نوبت
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== تعداد کل ===== */}
        {filteredServices.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            نمایش {filteredServices.length} از {services.length} خدمت
          </div>
        )}
      </main>
    </div>
  )
}