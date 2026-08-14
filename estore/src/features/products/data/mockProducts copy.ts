// src/features/products/data/mockProducts.ts
import type { Product } from '@/types/index'; // استفاده از type import و alias

// تعداد محصولات به دلخواه می‌تواند تغییر کند
const PRODUCT_COUNT = 12;

// تابع کمکی برای تولید آدرس تصاویر Unsplash با ابعاد ثابت
const generateImageUrl = (query: string, width = 400, height = 400): string => {
  return `https://images.unsplash.com/photo-${query}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
};

// آرایه‌ای از تصاویر پیش‌فرض برای تنوع بیشتر
const PRODUCT_IMAGES = [
  '1611791485440-24e8239a0377', // موبایل
  '1517336714731-489689fd1ca8', // لپ‌تاپ
  '1505740420928-5e560c06d30e', // هدفون
  '1526170375885-4d8ecf77b99f', // دوربین
  '1546868871-7041f2a55e51',   // ساعت هوشمند
  '1593640402852-8b4cb5cab5e8', // تبلت
  '1498049794561-1e1e6d5f5c5f', // مانیتور
  '1560769629-975ec94e6a86',   // کیبورد
  '1542291026-7eec264c27ff',   // کفش ورزشی
  '1523275335684-37898b6baf30', // لوازم خانگی
  '1506905925346-21bda4d32df4', // دوچرخه
  '1572635196236-9673724c8b8c'  // عینک
];

// تولیدکننده محصولات متنوع
const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  const categories = [
    'موبایل', 'لپ‌تاپ', 'هدفون', 'کامپیوتر', 'تبلت', 
    'ساعت هوشمند', 'دوربین', 'لوازم جانبی', 'گجت'
  ];
  
  const tagsOptions = [
    ['پرچمدار', 'جدید'],
    ['پرطرفدار', 'تخفیف‌دار'],
    ['اقتصادی', 'پرفروش'],
    ['ویژه', 'محدود'],
    ['برتر ماه', 'پیشنهاد']
  ];
  
  const productNames = [
    'سامسونگ گلکسی S24',
    'اپل آیفون 15 پرو',
    'شیائومی 14 پرو',
    'هوآوی P60',
    'گوگل پیکسل 8',
    'اپل مک‌بوک پرو 14',
    'لنوو لژیون 5',
    'دل XPS 13',
    'ایسوس ROG Zephyrus',
    'سونی WH-1000XM5',
    'بیتز استودیو پرو',
    'جی‌بی‌ال Flip 6'
  ];
  
  const descriptions = [
    'محصولی با کیفیت استثنایی و طراحی منحصربفرد',
    'مناسب برای کارهای حرفه‌ای و روزمره',
    'دارای جدیدترین تکنولوژی‌های روز دنیا',
    'با گارانتی 24 ماهه و خدمات پس از فروش',
    'بهترین انتخاب در رده قیمتی خود',
    'دارای عملکرد فوق‌العاده و باتری قدرتمند'
  ];
  
  for (let i = 1; i <= PRODUCT_COUNT; i++) {
    const hasDiscount = i % 3 === 0; // هر 3 محصول یک تخفیف
    const originalPrice = 10000000 + Math.floor(Math.random() * 90000000);
    const discountPercent = hasDiscount ? Math.floor(Math.random() * 30) + 5 : 0;
    const finalPrice = hasDiscount 
      ? Math.floor(originalPrice * (1 - discountPercent / 100))
      : originalPrice;
    
    const stockStatus = i % 12 === 0 ? 0 : // یک محصول ناموجود
                       i % 4 === 0 ? Math.floor(Math.random() * 5) + 1 : // موجودی کم
                       Math.floor(Math.random() * 30) + 10; // موجودی خوب
    
    const categoryIndex = i % categories.length;
    const tags = tagsOptions[i % tagsOptions.length];
    
    const product: Product = {
      id: i,
      name: `${productNames[i % productNames.length]} ${i}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price: finalPrice,
      stock: stockStatus,
      category: categories[categoryIndex],
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // بین 3.5 تا 5
      reviewCount: Math.floor(Math.random() * 500) + 50, // بین 50 تا 550
      imageUrl: generateImageUrl(PRODUCT_IMAGES[i % PRODUCT_IMAGES.length]),
      tags,
      specifications: {
        'رنگ': ['مشکی', 'سفید', 'آبی', 'نقره‌ای'][Math.floor(Math.random() * 4)],
        'وزن': `${Math.floor(Math.random() * 2000) + 500} گرم`,
        'ابعاد': 'استاندارد',
        'گارانتی': '18 ماه'
      }
    };
    
    // اضافه کردن فیلدهای اختیاری فقط در صورت نیاز
    if (hasDiscount) {
      product.originalPrice = originalPrice;
      product.discount = discountPercent;
    }
    
    // مشخصات خاص بر اساس دسته‌بندی
    switch (product.category) {
      case 'موبایل':
        product.specifications!['حافظه'] = ['128GB', '256GB', '512GB'][Math.floor(Math.random() * 3)];
        product.specifications!['رم'] = ['8GB', '12GB', '16GB'][Math.floor(Math.random() * 3)];
        product.tags!.push('هوشمند');
        break;
      case 'لپ‌تاپ':
        product.specifications!['پردازنده'] = 'Intel Core i7';
        product.specifications!['کارت گرافیک'] = 'NVIDIA RTX 4060';
        product.tags!.push('حرفه‌ای');
        break;
      case 'هدفون':
        product.specifications!['باتری'] = `${Math.floor(Math.random() * 20) + 20} ساعت`;
        product.specifications!['نویز کنسلینگ'] = 'دارد';
        product.tags!.push('بلوتوث');
        break;
    }
    
    products.push(product);
  }
  
  return products;
};

// محصولات اصلی (3 محصول اول که در کد شما بود)
export const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'گوشی موبایل سامسونگ گلکسی S24',
    description: 'گوشی پرچمدار سامسونگ با دوربین فوق‌العاده 200 مگاپیکسل، پردازنده اسنپدراگون 8 نسل 3 و باتری 5000 میلی‌آمپر',
    price: 35000000,
    originalPrice: 40000000,
    discount: 12,
    imageUrl: generateImageUrl(PRODUCT_IMAGES[0], 600, 600),
    stock: 15,
    category: 'موبایل',
    rating: 4.8,
    reviewCount: 127,
    tags: ['پرچمدار', 'جدید', 'پرفروش', 'تخفیف‌دار'],
    specifications: {
      'حافظه داخلی': '256 گیگابایت',
      'رم': '12 گیگابایت',
      'اندازه صفحه': '6.8 اینچ Dynamic AMOLED',
      'دوربین اصلی': '200 مگاپیکسل',
      'دوربین سلفی': '32 مگاپیکسل',
      'سیستم عامل': 'Android 14',
      'پردازنده': 'Snapdragon 8 Gen 3',
      'باتری': '5000 میلی‌آمپر'
    }
  },
  {
    id: 2,
    name: 'لپ‌تاپ اپل مک‌بوک پرو 14',
    description: 'لپ‌تاپ حرفه‌ای با چیپ Apple M2 Pro، مناسب برای طراحی گرافیک، تدوین ویدئو و برنامه‌نویسی سنگین',
    price: 82000000,
    originalPrice: undefined, // بدون تخفیف
    discount: undefined,
    imageUrl: generateImageUrl(PRODUCT_IMAGES[1], 600, 600),
    stock: 8,
    category: 'لپ‌تاپ',
    rating: 4.9,
    reviewCount: 89,
    tags: ['اپل', 'حرفه‌ای', 'جدید'],
    specifications: {
      'پردازنده': 'Apple M2 Pro (10-core)',
      'حافظه': '16 گیگابایت unified',
      'ذخیره‌سازی': '512 گیگابایت SSD',
      'گرافیک': '16-core GPU',
      'صفحه‌نمایش': '14.2 اینچ Liquid Retina XDR',
      'باتری': 'تا 18 ساعت استفاده',
      'سیستم عامل': 'macOS Ventura'
    }
  },
  {
    id: 3,
    name: 'هدفون بلوتوثی Sony WH-1000XM5',
    description: 'هدفون نویز کنسلینگ حرفه‌ای با پردازنده دوگانه QN1، میکروفون 8 قطبی و باتری 30 ساعته',
    price: 12500000,
    originalPrice: 15000000,
    discount: 16,
    imageUrl: generateImageUrl(PRODUCT_IMAGES[2], 600, 600),
    stock: 0,
    category: 'هدفون',
    rating: 4.7,
    reviewCount: 203,
    tags: ['نویز کنسلینگ', 'پرطرفدار', 'تخفیف‌دار'],
    specifications: {
      'باتری': '30 ساعت با نویز کنسلینگ فعال',
      'نویز کنسلینگ': 'فعال با پردازنده دوگانه QN1',
      'اتصال': 'بلوتوث 5.2',
      'میکروفون': '8 قطبی برای مکالمه واضح',
      'وزن': '250 گرم',
      'قابلیت‌ها': 'حالت Ambient Sound، کنترل لمسی'
    }
  }
];

// محصولات تولید شده
export const mockProducts: Product[] = [
  ...featuredProducts,
  ...generateProducts().slice(3) // اضافه کردن محصولات تولید شده به جز 3 تای اول
];

// دسته‌بندی‌های موجود
export const productCategories = Array.from(
  new Set(mockProducts.map(p => p.category))
).sort();

// محصولات پرفروش (بر اساس امتیاز و تعداد نظرات)
export const bestSellingProducts = [...mockProducts]
  .sort((a, b) => {
    const scoreA = a.rating * Math.log(a.reviewCount + 1);
    const scoreB = b.rating * Math.log(b.reviewCount + 1);
    return scoreB - scoreA;
  })
  .slice(0, 6);

// محصولات تخفیف‌دار
export const discountedProducts = mockProducts
  .filter(p => p.discount && p.discount > 0)
  .sort((a, b) => (b.discount || 0) - (a.discount || 0));

// محصولات موجود (غیر ناموجود)
export const availableProducts = mockProducts.filter(p => p.stock > 0);

// گروه‌بندی محصولات بر اساس دسته‌بندی
export const productsByCategory = mockProducts.reduce((acc, product) => {
  if (!acc[product.category]) {
    acc[product.category] = [];
  }
  acc[product.category].push(product);
  return acc;
}, {} as Record<string, Product[]>);

// فیلتر کردن محصولات بر اساس معیارهای مختلف
export const filterProducts = (filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
}): Product[] => {
  return mockProducts.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.inStock && product.stock === 0) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        false
      );
    }
    return true;
  });
};

// جستجوی محصولات
export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) return mockProducts;
  
  const normalizedQuery = query.toLowerCase().trim();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(normalizedQuery) ||
    product.description.toLowerCase().includes(normalizedQuery) ||
    product.category.toLowerCase().includes(normalizedQuery) ||
    product.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
    false
  );
};

// دریافت محصول بر اساس ID
export const getProductById = (id: number): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// پیشنهاد محصولات مشابه
export const getSimilarProducts = (productId: number, limit = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return mockProducts
    .filter(p => 
      p.id !== productId && 
      p.category === product.category
    )
    .slice(0, limit);
};

export default mockProducts;