// Path: frontend/src/utils/images.ts

// ============================================
// تصاویر ثابت برنامه
// ============================================

// تصاویر عمومی
export const publicImages = {
  logo: '/images/logo/logo.png',
  favicon: '/images/favicon.ico',
  defaultAvatar: '/images/default-avatar.png',
  defaultService: '/images/services/default-service.jpg',
  defaultSlider: '/images/sliders/default-slider.jpg',
  noImage: '/images/no-image.png',
}

// تصاویر خدمات
export const serviceImages = {
  botox: '/images/services/botox.jpg',
  filler: '/images/services/filler.jpg',
  laser: '/images/services/laser.jpg',
  mesotherapy: '/images/services/mesotherapy.jpg',
  HIFU: '/images/services/hifu.jpg',
  lipFiller: '/images/services/lip-filler.jpg',
  hairTransplant: '/images/services/hair-transplant.jpg',
  carboxytherapy: '/images/services/carboxytherapy.jpg',
}

// تصاویر اسلایدرها
export const sliderImages = {
  slide1: '/images/sliders/slide1.jpg',
  slide2: '/images/sliders/slide2.jpg',
  slide3: '/images/sliders/slide3.jpg',
}

// ============================================
// تابع دریافت تصویر بر اساس نام خدمت
// ============================================

export const getServiceImage = (serviceName: string): string => {
  const imageMap: Record<string, string> = {
    'بوتاکس': serviceImages.botox,
    'فیلر': serviceImages.filler,
    'لیزر موهای زائد': serviceImages.laser,
    'مزوتراپی': serviceImages.mesotherapy,
    'هایفو': serviceImages.HIFU,
    'ژل لب': serviceImages.lipFiller,
    'کاشت مو': serviceImages.hairTransplant,
    'کربوکسی تراپی': serviceImages.carboxytherapy,
  }

  return imageMap[serviceName] || publicImages.defaultService
}

// ============================================
// تابع دریافت تصویر بر اساس دسته‌بندی
// ============================================

export const getCategoryImage = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'تزریقات': '/images/categories/injections.jpg',
    'لیزر': '/images/categories/laser.jpg',
    'پوست': '/images/categories/skin.jpg',
    'لیفتینگ': '/images/categories/lifting.jpg',
    'مو': '/images/categories/hair.jpg',
  }

  return categoryMap[category] || publicImages.defaultService
}

// ============================================
// تابع دریافت آیکون دسته‌بندی
// ============================================

export const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'تزریقات': '💉',
    'لیزر': '⚡',
    'پوست': '🧴',
    'لیفتینگ': '✨',
    'مو': '💇‍♀️',
  }

  return iconMap[category] || '💎'
}

// ============================================
// تابع دریافت تصویر اسلایدر
// ============================================

export const getSliderImage = (index: number): string => {
  const images = [
    sliderImages.slide1,
    sliderImages.slide2,
    sliderImages.slide3,
  ]
  return images[index] || publicImages.defaultSlider
}

// ============================================
// تابع بررسی وجود تصویر
// ============================================

export const isValidImage = (url: string): boolean => {
  if (!url) return false
  return url.startsWith('/images/') || 
         url.startsWith('/uploads/') || 
         url.startsWith('http://') || 
         url.startsWith('https://')
}

// ============================================
// تابع دریافت تصویر پیش‌فرض برای خطا
// ============================================

export const getFallbackImage = (): string => {
  return publicImages.noImage
}

// ============================================
// لینک‌های تصاویر Unsplash برای دیتابیس
// ============================================

export const unsplashImages = {
  // تصاویر خدمات
  services: {
    botox: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
    filler: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=400&fit=crop',
    laser: 'images/laser.jpg',
    mesotherapy: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71a9?w=600&h=400&fit=crop',
    hifu: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=400&fit=crop',
    lipFiller: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=400&fit=crop',
    hairTransplant: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
    carboxytherapy: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=400&fit=crop',
  },
  // تصاویر اسلایدر
  sliders: {
    slide1: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=500&fit=crop',
    slide2: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&h=500&fit=crop',
    slide3: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71a9?w=1200&h=500&fit=crop',
  },
  // تصاویر دسته‌بندی
  categories: {
    injections: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=400&fit=crop',
    laser: 'https://images.unsplash.com/photo-1623831379238-0d5b3180ea45?w=600&h=400&fit=crop',
    skin: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71a9?w=600&h=400&fit=crop',
    lifting: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=400&fit=crop',
    hair: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
  },
  // تصاویر کلینیک
  clinic: {
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop',
    hero: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=500&fit=crop',
    about: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
  }
}