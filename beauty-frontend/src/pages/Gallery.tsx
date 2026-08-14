// Path: frontend/src/pages/Gallery.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaSpinner, FaTimes, FaImage } from 'react-icons/fa'

interface GalleryItem {
  id: number
  category: string
  title: string
  description: string | null
  imageUrl: string
  beforeImageUrl: string | null
  afterImageUrl: string | null
  order: number
}

// ===== تصاویر پیش‌فرض برای هر دسته‌بندی =====
const defaultImages: Record<string, string> = {
  'قبل و بعد': '/images/services/laser.jpg',
  'کلینیک': '/images/clinic/clinic.jpg',
  'تیم پزشکی': '/images/team/doctor.jpg',
  'default': '/images/default-image.jpg'
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<string[]>(['همه'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState('همه')
  const [showBeforeAfter, setShowBeforeAfter] = useState<'before' | 'after'>('before')

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      setError(null)

      const [galleryRes, categoriesRes] = await Promise.all([
        axios.get('/api/v1/gallery'),
        axios.get('/api/v1/gallery/categories')
      ])

      setGalleryItems(galleryRes.data || [])
      setCategories(['همه', ...(categoriesRes.data || [])])
    } catch (error: any) {
      console.error('Error fetching gallery:', error)
      setError('خطا در دریافت تصاویر گالری')
      toast.error('خطا در دریافت تصاویر گالری')
      setGalleryItems([])
    } finally {
      setLoading(false)
    }
  }

  // ===== تابع دریافت مسیر تصویر =====
  const getImageUrl = (url: string | null, category?: string): string => {
    if (!url) {
      return category && defaultImages[category] ? defaultImages[category] : defaultImages.default
    }
    
    // اگر URL با http یا https شروع شود، همان URL است
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // اگر URL با / شروع شود، مسیر نسبی است
    if (url.startsWith('/')) {
      return url
    }
    
    // در غیر این صورت، مسیر را به صورت نسبی در نظر بگیر
    return `/images/${url}`
  }

  const filteredItems = filter === 'همه' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gold mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری گالری...</p>
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
            📸 گالری تصاویر
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            نمونه کارها، محیط کلینیک و تیم پزشکی ما را مشاهده کنید
          </p>
        </div>

        {/* ===== فیلترها ===== */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                filter === category 
                  ? 'bg-gold text-white shadow-md' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchGallery}
              className="text-sm text-red-600 dark:text-red-400 hover:underline mt-2"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* ===== گالری ===== */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {error ? 'خطا در بارگذاری تصاویر' : 'هیچ تصویری در این دسته‌بندی یافت نشد'}
            </p>
            {!error && (
              <p className="text-sm text-gray-400 mt-2">
                تصاویر جدید به زودی اضافه می‌شوند
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card dark:bg-gray-800 cursor-pointer hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 overflow-hidden"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden h-48 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={getImageUrl(item.imageUrl, item.category)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = defaultImages.default
                      target.onerror = null
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 right-3 bg-gold text-white text-xs px-3 py-1 rounded-full shadow-md">
                    {item.category}
                  </span>
                  <span className="absolute bottom-3 left-3 text-white text-sm font-medium">
                    {item.title}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.description || 'توضیحاتی برای این تصویر ثبت نشده است'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== مودال بزرگنمایی ===== */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ===== هدر مودال ===== */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-darkblue dark:text-white">
                    {selectedImage.title}
                  </h2>
                  <p className="text-xs text-gold">{selectedImage.category}</p>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <FaTimes className="text-xl text-gray-500" />
                </button>
              </div>

              {/* ===== محتوای مودال ===== */}
              <div className="p-6">
                {/* ===== تصویر اصلی ===== */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <img 
                    src={getImageUrl(selectedImage.imageUrl, selectedImage.category)}
                    alt={selectedImage.title}
                    className="w-full max-h-[400px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = defaultImages.default
                      target.onerror = null
                    }}
                  />
                </div>

                {/* ===== توضیحات ===== */}
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {selectedImage.description || 'توضیحاتی برای این تصویر ثبت نشده است'}
                </p>

                {/* ===== قبل و بعد ===== */}
                {selectedImage.category === 'قبل و بعد' && selectedImage.beforeImageUrl && selectedImage.afterImageUrl && (
                  <div className="mt-6">
                    <div className="flex gap-4 mb-4">
                      <button
                        className={`flex-1 py-2 rounded-xl transition-colors ${
                          showBeforeAfter === 'before'
                            ? 'bg-gold text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setShowBeforeAfter('before')}
                      >
                        قبل از درمان
                      </button>
                      <button
                        className={`flex-1 py-2 rounded-xl transition-colors ${
                          showBeforeAfter === 'after'
                            ? 'bg-gold text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setShowBeforeAfter('after')}
                      >
                        بعد از درمان
                      </button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                      <img 
                        src={getImageUrl(
                          showBeforeAfter === 'before' ? selectedImage.beforeImageUrl : selectedImage.afterImageUrl,
                          selectedImage.category
                        )}
                        alt={showBeforeAfter === 'before' ? 'قبل از درمان' : 'بعد از درمان'}
                        className="w-full max-h-[300px] object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = defaultImages.default
                          target.onerror = null
                        }}
                      />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {showBeforeAfter === 'before' ? 'قبل از درمان' : 'بعد از درمان'}
                    </p>
                  </div>
                )}

                {/* ===== اطلاعات اضافی ===== */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaImage className="text-gold" />
                    <span>شناسه: {selectedImage.id}</span>
                    <span className="mx-2">|</span>
                    <span>دسته‌بندی: {selectedImage.category}</span>
                    {selectedImage.order && (
                      <>
                        <span className="mx-2">|</span>
                        <span>ترتیب: {selectedImage.order}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}