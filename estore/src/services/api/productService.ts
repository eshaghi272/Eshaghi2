import type { Product, ApiResponse } from '../../types/index';

// آدرس API شما
const API_BASE_URL = 'http://localhost:3000/api';

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
}

export class ProductService {
  private static async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // دریافت همه محصولات
  static async getAllProducts(): Promise<Product[]> {
    const response = await this.fetchAPI<ApiResponse<Product[]>>('/products');
    return response.data || [];
  }

  // دریافت محصول بر اساس ID
  static async getProductById(id: number): Promise<Product | undefined> {
    try {
      const response = await this.fetchAPI<ApiResponse<Product>>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return undefined;
    }
  }

  // دریافت دسته‌بندی‌ها
  static async getCategories(): Promise<string[]> {
    try {
      const response = await this.fetchAPI<ApiResponse<any[]>>('/categories');
      // فرض: API دسته‌بندی‌ها را با فیلد name برمی‌گرداند
      return (response.data || []).map(cat => cat.name);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  // فیلتر کردن محصولات (در سمت سرور یا کلاینت)
  static async getFilteredProducts(filters: ProductFilters): Promise<Product[]> {
    // در این نسخه اولیه، همه محصولات را می‌گیریم و در کلاینت فیلتر می‌کنیم
    // در آینده می‌توانید پارامترهای فیلتر را به API اضافه کنید
    const allProducts = await this.getAllProducts();
    
    return allProducts.filter(product => {
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
  }

  // جستجوی محصولات
  static async searchProducts(query: string): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    
    if (!query.trim()) return allProducts;
    
    const normalizedQuery = query.toLowerCase().trim();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
      false
    );
  }
}