// src/features/products/data/mockProducts.ts

// 1. اول این کلاس ProductService را در همین فایل اضافه کنید:
class ProductService {
  private static API_BASE_URL = 'http://localhost:3000/api';

  private static async fetchAPI<T>(endpoint: string): Promise<T> {
    const url = `${this.API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  static async getAllProducts(): Promise<any[]> {
    try {
      const response = await this.fetchAPI<{ success: boolean; data: any[] }>('/products');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }

  static async getProductById(id: number): Promise<any | undefined> {
    try {
      const response = await this.fetchAPI<{ success: boolean; data: any }>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return undefined;
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const response = await this.fetchAPI<{ success: boolean; data: any[] }>('/categories');
      return (response.data || []).map((cat: any) => cat.name || cat.title || 'دسته‌بندی');
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }
}

// 2. بقیه کدها با اصلاحات:
import type { Product } from '@/types/index';

// تابع برای تولید URL تصاویر (در صورت نیاز برای محصولات بدون عکس)
const generateImageUrl = (query: string, width = 400, height = 400): string => {
  return `https://images.unsplash.com/photo-${query}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
};

// دیتای موقت برای حالت آفلاین یا هنگام خطای API
const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'گوشی موبایل سامسونگ گلکسی S24',
    description: 'گوشی پرچمدار سامسونگ با دوربین 200 مگاپیکسل',
    price: 35000000,
    originalPrice: 40000000,
    discount: 12,
    imageUrl: generateImageUrl('1611791485440-24e8239a0377', 600, 600),
    stock: 15,
    category: 'موبایل',
    rating: 4.8,
    reviewCount: 127,
    tags: ['پرچمدار', 'جدید', 'پرفروش'],
    specifications: {
      'حافظه داخلی': '256 گیگابایت',
      'رم': '12 گیگابایت',
      'اندازه صفحه': '6.8 اینچ'
    }
  },
  {
    id: 2,
    name: 'لپ‌تاپ اپل مک‌بوک پرو 14',
    description: 'لپ‌تاپ حرفه‌ای برای طراحی و برنامه‌نویسی',
    price: 82000000,
    imageUrl: generateImageUrl('1517336714731-489689fd1ca8', 600, 600),
    stock: 8,
    category: 'لپ‌تاپ',
    rating: 4.9,
    reviewCount: 89,
    tags: ['اپل', 'حرفه‌ای', 'جدید'],
    specifications: {
      'پردازنده': 'Apple M2 Pro',
      'حافظه': '16 گیگابایت',
      'ذخیره‌سازی': '512 گیگابایت SSD'
    }
  },
  {
    id: 3,
    name: 'هدفون بلوتوثی Sony WH-1000XM5',
    description: 'هدفون نویز کنسلینگ حرفه‌ای',
    price: 12500000,
    originalPrice: 15000000,
    discount: 16,
    imageUrl: generateImageUrl('1505740420928-5e560c06d30e', 600, 600),
    stock: 0,
    category: 'هدفون',
    rating: 4.7,
    reviewCount: 203,
    tags: ['نویز کنسلینگ', 'پرطرفدار'],
    specifications: {
      'باتری': '30 ساعت',
      'نویز کنسلینگ': 'دارد',
      'اتصال': 'بلوتوث 5.2'
    }
  },
  {
    id: 4,
    name: 'دوربین کانن EOS R6',
    description: 'دوربین فول‌فریم حرفه‌ای',
    price: 68000000,
    imageUrl: generateImageUrl('1526170375885-4d8ecf77b99f', 600, 600),
    stock: 5,
    category: 'دوربین',
    rating: 4.6,
    reviewCount: 56,
    tags: ['حرفه‌ای', 'فول‌فریم'],
    specifications: {
      'سنسور': 'فول‌فریم 20 مگاپیکسل',
      'فیلمبرداری': '4K 60fps'
    }
  },
  {
    id: 5,
    name: 'ساعت هوشمند اپل واچ سری 8',
    description: 'ساعت هوشمند با قابلیت‌های سلامتی',
    price: 18500000,
    originalPrice: 22000000,
    discount: 15,
    imageUrl: generateImageUrl('1546868871-7041f2a55e51', 600, 600),
    stock: 22,
    category: 'ساعت هوشمند',
    rating: 4.8,
    reviewCount: 312,
    tags: ['اپل', 'سلامتی', 'تخفیف‌دار'],
    specifications: {
      'باتری': '18 ساعت',
      'اندازه': '45mm',
      'مقاومت': 'آب تا 50 متر'
    }
  }
];

// دریافت محصولات از API (اکنون در این فایل است)
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const apiProducts = await ProductService.getAllProducts();
    
    // تبدیل محصولات API به فرمت Product
    return apiProducts.map((apiProduct: any) => ({
      id: apiProduct.id || 0,
      name: apiProduct.name || apiProduct.title || 'محصول بدون نام',
      description: apiProduct.description || 'بدون توضیحات',
      price: apiProduct.price || apiProduct.price_final || 0,
      originalPrice: apiProduct.originalPrice || apiProduct.price_before || undefined,
      discount: apiProduct.discount || undefined,
      imageUrl: apiProduct.imageUrl || apiProduct.image || 
        generateImageUrl('1611791485440-24e8239a0377'),
      stock: apiProduct.stock || apiProduct.quantity || 0,
      category: apiProduct.category || apiProduct.category_name || 'دسته‌بندی نشده',
      rating: apiProduct.rating || 4.0,
      reviewCount: apiProduct.reviewCount || apiProduct.reviews_count || 0,
      tags: apiProduct.tags || [],
      specifications: apiProduct.specifications || {}
    }));
  } catch (error) {
    console.warn('Using fallback data due to API error:', error);
    return fallbackProducts;
  }
};

// دریافت محصول بر اساس ID
export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const apiProduct = await ProductService.getProductById(id);
    
    if (!apiProduct) return undefined;
    
    // تبدیل محصول API به فرمت Product
    return {
      id: apiProduct.id || id,
      name: apiProduct.name || apiProduct.title || 'محصول بدون نام',
      description: apiProduct.description || 'بدون توضیحات',
      price: apiProduct.price || apiProduct.price_final || 0,
      originalPrice: apiProduct.originalPrice || apiProduct.price_before || undefined,
      discount: apiProduct.discount || undefined,
      imageUrl: apiProduct.imageUrl || apiProduct.image || 
        generateImageUrl('1611791485440-24e8239a0377'),
      stock: apiProduct.stock || apiProduct.quantity || 0,
      category: apiProduct.category || apiProduct.category_name || 'دسته‌بندی نشده',
      rating: apiProduct.rating || 4.0,
      reviewCount: apiProduct.reviewCount || apiProduct.reviews_count || 0,
      tags: apiProduct.tags || [],
      specifications: apiProduct.specifications || {}
    };
  } catch (error) {
    console.warn(`Using fallback product ${id} due to API error:`, error);
    return fallbackProducts.find(p => p.id === id);
  }
};

// دریافت دسته‌بندی‌ها
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const categories = await ProductService.getCategories();
    return categories.length > 0 ? categories : ['موبایل', 'لپ‌تاپ', 'هدفون'];
  } catch (error) {
    console.warn('Using fallback categories due to API error:', error);
    return ['موبایل', 'لپ‌تاپ', 'هدفون', 'دوربین', 'ساعت هوشمند'];
  }
};

// سایر توابع کمکی
export const getSimilarProducts = async (productId: number, limit = 4): Promise<Product[]> => {
  try {
    const allProducts = await fetchProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) return [];
    
    return allProducts
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  } catch (error) {
    console.warn('Error fetching similar products:', error);
    return fallbackProducts.slice(0, limit);
  }
};

// گروه‌بندی محصولات بر اساس دسته‌بندی
export const getProductsByCategory = async (): Promise<Record<string, Product[]>> => {
  try {
    const allProducts = await fetchProducts();
    
    return allProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  } catch (error) {
    console.warn('Error grouping products:', error);
    
    // برگرداندن fallback
    const result: Record<string, Product[]> = {};
    fallbackProducts.forEach(product => {
      if (!result[product.category]) {
        result[product.category] = [];
      }
      result[product.category].push(product);
    });
    return result;
  }
};

// ----- اکسپورت‌های اصلی که کدهای دیگر نیاز دارند -----

// این اکسپورت‌ها برای جلوگیری از خطاهای import لازم هستند
export const mockProducts: Product[] = fallbackProducts;

export const bestSellingProducts: Product[] = [...fallbackProducts]
  .sort((a, b) => {
    const scoreA = a.rating * Math.log(a.reviewCount + 1);
    const scoreB = b.rating * Math.log(b.reviewCount + 1);
    return scoreB - scoreA;
  })
  .slice(0, 6);

export const productCategories: string[] = Array.from(
  new Set(fallbackProducts.map(p => p.category))
).sort();

// توابع فیلتر و جستجو (برای ProductListingPage)
export const filterProducts = (filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
}): Product[] => {
  const products = fallbackProducts; // یا می‌توانید fetchProducts() را فراخوانی کنید
  
  return products.filter(product => {
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

export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) return fallbackProducts;
  
  const normalizedQuery = query.toLowerCase().trim();
  return fallbackProducts.filter(product => 
    product.name.toLowerCase().includes(normalizedQuery) ||
    product.description.toLowerCase().includes(normalizedQuery) ||
    product.category.toLowerCase().includes(normalizedQuery) ||
    product.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
    false
  );
};

// توابع کمکی دیگر
export const getProductById = (id: number): Product | undefined => {
  return fallbackProducts.find(product => product.id === id);
};

// اکسپورت دیفالت
export default mockProducts;