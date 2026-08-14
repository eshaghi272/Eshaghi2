// Path: frontend/src/pages/Home.tsx
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface Slider {
  id: number
  title: string
  description: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  order: number
}

interface Feature {
  id: number
  icon: string
  title: string
  description: string
}

interface Settings {
  site_name: string
  site_description: string
  site_logo: string
  hero_title: string
  hero_subtitle: string
  hero_button_text: string
  hero_button_link: string
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliders, setSliders] = useState<Slider[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [slidersRes, featuresRes, settingsRes] = await Promise.all([
        axios.get('/api/v1/site/sliders'),
        axios.get('/api/v1/site/features'),
        axios.get('/api/v1/site/settings')
      ])

      setSliders(slidersRes.data || [])
      setFeatures(featuresRes.data || [])
      setSettings(settingsRes.data?.general || {})

    } catch (error: any) {
      console.error('Error fetching home data:', error)
      setError('خطا در بارگذاری اطلاعات')
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)
  }

  // ===== تابع هدایت به صفحه رزرو نوبت =====
  const handleBookAppointment = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (user) {
      navigate('/patient/book-appointment')
    } else {
      navigate('/login?redirect=/patient/book-appointment')
      toast.info('لطفاً ابتدا وارد حساب کاربری خود شوید')
    }
  }

  // ===== تابع هدایت به صفحه خدمات =====
  const handleServices = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/services')
  }

  // ===== تابع هدایت به صفحه تماس =====
  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/contact')
  }

  // ===== تابع هدایت به صفحه گالری =====
  const handleGallery = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/gallery')
  }

  // ===== اسلایدهای پیش‌فرض (۶ اسلاید) =====
  const defaultSliders: Slider[] = [
    {
      id: 1,
      title: 'به کلینیک زیبایی خوش آمدید',
      description: 'مرکز تخصصی پوست، مو و زیبایی با کادری مجرب',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=500&fit=crop',
      buttonText: 'رزرو نوبت',
      buttonLink: '/book-appointment',
      order: 1
    },
    {
      id: 2,
      title: 'خدمات حرفه‌ای زیبایی',
      description: 'بوتاکس، فیلر، لیزر و هایفو با بهترین کیفیت',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=500&fit=crop',
      buttonText: 'مشاهده خدمات',
      buttonLink: '/services',
      order: 2
    },
    {
      id: 3,
      title: 'رزرو نوبت آنلاین',
      description: 'به راحتی از سایت خود نوبت خود را رزرو کنید',
      imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71a9?w=1200&h=500&fit=crop',
      buttonText: 'همین حالا اقدام کنید',
      buttonLink: '/book-appointment',
      order: 3
    },
    {
      id: 4,
      title: 'گالری تصاویر قبل و بعد',
      description: 'نمونه کارهای موفق کلینیک زیبایی',
      imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1200&h=500&fit=crop',
      buttonText: 'مشاهده گالری',
      buttonLink: '/gallery',
      order: 4
    },
    {
      id: 5,
      title: 'تیم پزشکی مجرب',
      description: 'پزشکان متخصص با سال‌ها تجربه در زمینه زیبایی',
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&h=500&fit=crop',
      buttonText: 'مشاهده تیم',
      buttonLink: '/gallery',
      order: 5
    },
    {
      id: 6,
      title: 'محیطی آرام و حرفه‌ای',
      description: 'کلینیکی با فضایی آرام و تجهیزات پیشرفته',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=500&fit=crop',
      buttonText: 'تماس با ما',
      buttonLink: '/contact',
      order: 6
    }
  ]

  const displaySliders = sliders.length > 0 ? sliders : defaultSliders
  const displayFeatures = features.length > 0 ? features : [
    { id: 1, icon: '👨‍⚕️', title: 'کادر مجرب', description: 'پزشکان متخصص با سال‌ها تجربه' },
    { id: 2, icon: '💎', title: 'تجهیزات پیشرفته', description: 'به‌روزترین دستگاه‌های روز دنیا' },
    { id: 3, icon: '🌟', title: 'کیفیت عالی', description: 'رضایت ۱۰۰٪ مشتریان' },
    { id: 4, icon: '🕐', title: 'نوبت‌دهی آنلاین', description: 'رزرو نوبت به راحتی از طریق سایت' },
    { id: 5, icon: '🏥', title: 'محیط آرام', description: 'فضایی آرام و حرفه‌ای برای بیماران' },
    { id: 6, icon: '📞', title: 'پشتیبانی ۲۴/۷', description: 'پشتیبانی و پاسخگویی در تمام ساعات' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-gray-900 transition-colors duration-300">
      <main className="flex-grow mt-16">
        {/* ===== Hero Slider ===== */}
        <section className="relative h-[500px] overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {displaySliders.map((slide, index) => (
              <div
                key={slide.id || index}
                className="min-w-full h-full flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, rgba(44, 62, 80, 0.85) 0%, rgba(201, 169, 110, 0.8) 100%)`
                }}
              >
                {slide.imageUrl && (
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center text-white p-8 z-10 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-6 drop-shadow-md">
                    {slide.description}
                  </p>
                  {slide.buttonText && slide.buttonLink && (
                    <button
                      onClick={() => {
                        if (slide.buttonLink === '/book-appointment') {
                          handleBookAppointment
                        } else if (slide.buttonLink === '/services') {
                          handleServices
                        } else if (slide.buttonLink === '/gallery') {
                          handleGallery
                        } else if (slide.buttonLink === '/contact') {
                          handleContact
                        }
                      }}
                      className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 inline-block hover:scale-105 transition-transform shadow-lg"
                    >
                      {slide.buttonText}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {displaySliders.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl transition-colors z-20"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl transition-colors z-20"
              >
                ›
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {displaySliders.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all ${
                      currentSlide === index ? 'bg-gold w-6 md:w-8' : 'bg-white/50 hover:bg-white/70'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ===== Features ===== */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-center text-darkblue dark:text-white">
              {settings?.hero_title || 'چرا کلینیک زیبایی؟'}
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              {settings?.hero_subtitle || 'مرکز تخصصی پوست، مو و زیبایی با کادری مجرب'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8">
              {displayFeatures.map((feature) => (
                <div key={feature.id} className="card text-center dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow group">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-darkblue dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Quick actions ===== */}
        <section className="py-16 bg-gold-light dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-darkblue dark:text-white mb-8">همین حالا اقدام کنید</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {/* دکمه رزرو نوبت */}
              <button
                onClick={handleBookAppointment}
                className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 inline-block hover:scale-105 transition-transform"
              >
                📅 رزرو نوبت
              </button>

              {/* دکمه مشاهده خدمات */}
              <button
                onClick={handleServices}
                className="btn-secondary text-base md:text-lg px-6 md:px-8 py-3 inline-block hover:scale-105 transition-transform"
              >
                📋 مشاهده خدمات
              </button>

              {/* دکمه گالری */}
              <button
                onClick={handleGallery}
                className="btn-secondary text-base md:text-lg px-6 md:px-8 py-3 inline-block hover:scale-105 transition-transform"
              >
                🖼️ گالری تصاویر
              </button>

              {/* دکمه تماس با ما */}
              <button
                onClick={handleContact}
                className="btn-secondary text-base md:text-lg px-6 md:px-8 py-3 inline-block hover:scale-105 transition-transform"
              >
                📞 تماس با ما
              </button>
            </div>

            {/* نمایش وضعیت لاگین */}
            {!user && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                برای رزرو نوبت، ابتدا وارد حساب کاربری خود شوید
              </p>
            )}
          </div>
        </section>

        {/* ===== اضافه کردن بخش آمار ===== */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-gold mb-2">۵۰۰+</div>
                <p className="text-gray-600 dark:text-gray-400">بیمار راضی</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-gold mb-2">۱۰+</div>
                <p className="text-gray-600 dark:text-gray-400">سال تجربه</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-gold mb-2">۱۵+</div>
                <p className="text-gray-600 dark:text-gray-400">خدمت تخصصی</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-gold mb-2">۱۰۰٪</div>
                <p className="text-gray-600 dark:text-gray-400">رضایت مشتریان</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}