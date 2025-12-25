// src/features/products/data/mockProducts.ts
import { Product } from '../../../types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'گوشی موبایل سامسونگ گلکسی S24',
    description: 'گوشی پرچمدار سامسونگ با دوربین فوق‌العاده و پردازنده قدرتمند',
    price: 35000000,
    originalPrice: 40000000,
    discount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1611791485440-24e8239a0377?w=400&h=400&fit=crop',
    stock: 15,
    category: 'موبایل',
    rating: 4.8,
    reviewCount: 127,
    tags: ['پرچمدار', 'جدید'],
    specifications: {
      'حافظه داخلی': '256 گیگابایت',
      'رم': '8 گیگابایت',
      'اندازه صفحه': '6.2 اینچ'
    }
  },
  {
    id: 2,
    name: 'لپ‌تاپ اپل مک‌بوک پرو 14',
    description: 'لپ‌تاپ حرفه‌ای برای طراحی و برنامه‌نویسی',
    price: 82000000,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    stock: 8,
    category: 'لپ‌تاپ',
    rating: 4.9,
    reviewCount: 89,
    tags: ['اپل', 'حرفه‌ای'],
    specifications: {
      'پردازنده': 'Apple M2 Pro',
      'حافظه': '16 گیگابایت',
      'ذخیره‌سازی': '512 گیگابایت'
    }
  },
  {
    id: 3,
    name: 'هدفون بلوتوثی Sony WH-1000XM5',
    description: 'هدفون نویز کنسلینگ حرفه‌ای با کیفیت صدای استثنایی',
    price: 12500000,
    originalPrice: 15000000,
    discount: 16,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w-400&h-400&fit=crop',
    stock: 0,
    category: 'هدفون',
    rating: 4.7,
    reviewCount: 203,
    tags: ['نویز کنسلینگ', 'پرطرفدار'],
    specifications: {
      'باتری': '30 ساعت',
      'نویز کنسلینگ': 'فعال',
      'اتصال': 'بلوتوث 5.2'
    }
  }
];