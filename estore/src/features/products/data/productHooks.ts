// src/features/products/data/productHooks.ts
import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../../../types/index';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  error?: string;
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
}

// ----- API Service Functions -----
const API_BASE_URL = 'http://localhost:3000/api';

const fetchAPI = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
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
};

// دریافت همه محصولات
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetchAPI<ApiResponse<Product[]>>('/products');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

// دریافت محصول بر اساس ID
export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await fetchAPI<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return undefined;
  }
};

// دریافت دسته‌بندی‌ها
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetchAPI<ApiResponse<any[]>>('/categories');
    
    console.log('API Categories Response:', response);
    
    const categoriesData = response.data || [];
    
    if (categoriesData.length === 0) {
      console.warn('No categories received from API');
      return getFallbackCategories();
    }
    
    // استخراج نام دسته‌بندی‌ها از API
    const categories = categoriesData
      .filter((cat: any) => cat && cat.name && typeof cat.name === 'string')
      .map((cat: any) => cat.name.trim());
    
    // حذف موارد تکراری و خالی
    const uniqueCategories = Array.from(new Set(categories.filter(Boolean)));
    
    console.log('Extracted categories:', uniqueCategories);
    return uniqueCategories;
    
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return getFallbackCategories();
  }
};

// دسته‌بندی‌های پیش‌فرض
const getFallbackCategories = (): string[] => {
  console.log('Using fallback categories');
  return [
    'الکترونیک', 'موبایل', 'لپ‌تاپ', 'تبلت', 'کامپیوتر',
    'لباس', 'مردانه', 'زنانه', 'بچگانه',
    'کتاب', 'رمان', 'علمی', 'تاریخ',
    'خانه و آشپزخانه', 'مبلمان', 'لوازم آشپزخانه', 'دکوراسیون'
  ];
};

// دریافت دسته‌بندی‌های کامل با جزئیات
export const fetchDetailedCategories = async (): Promise<any[]> => {
  try {
    const response = await fetchAPI<ApiResponse<any[]>>('/categories');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch detailed categories:', error);
    return [];
  }
};

// فیلتر کردن محصولات
export const fetchFilteredProducts = async (filters: ProductFilters): Promise<Product[]> => {
  try {
    const allProducts = await fetchProducts();
    
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
  } catch (error) {
    console.error('Failed to filter products:', error);
    return [];
  }
};

// جستجوی محصولات
export const searchProductsAPI = async (query: string): Promise<Product[]> => {
  try {
    const allProducts = await fetchProducts();
    
    if (!query.trim()) return allProducts;
    
    const normalizedQuery = query.toLowerCase().trim();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
      false
    );
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
};

// ----- React Hooks -----

/**
 * هوک برای دریافت همه محصولات
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProducts();
      setProducts(data);
      console.log('Loaded products:', data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت محصولات';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    refetch: loadProducts,
  };
};

/**
 * هوک برای دریافت یک محصول خاص بر اساس ID
 */
export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        console.log('Loaded product:', data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت محصول';
        setError(errorMessage);
        console.error(`Error fetching product ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  return { 
    product, 
    loading, 
    error,
    refetch: () => {
      if (id) {
        const loadProduct = async () => {
          setLoading(true);
          try {
            const data = await fetchProductById(id);
            setProduct(data);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'خطا در دریافت محصول');
          } finally {
            setLoading(false);
          }
        };
        loadProduct();
      }
    }
  };
};

/**
 * هوک برای دریافت دسته‌بندی‌ها
 */
export const useProductCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [detailedCategories, setDetailedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // دریافت لیست ساده دسته‌بندی‌ها
      const categoryNames = await fetchCategories();
      setCategories(categoryNames);
      
      // دریافت اطلاعات کامل دسته‌بندی‌ها
      const detailed = await fetchDetailedCategories();
      setDetailedCategories(detailed);
      
      console.log('Loaded categories:', {
        simple: categoryNames.length,
        detailed: detailed.length
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت دسته‌بندی‌ها';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { 
    categories, 
    detailedCategories,
    loading, 
    error,
    refetch: loadCategories
  };
};

/**
 * هوک برای فیلتر کردن محصولات
 */
export const useFilteredProducts = (filters: ProductFilters) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyFilters = useCallback(async (filterOptions: ProductFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchFilteredProducts(filterOptions);
      setFilteredProducts(data);
      console.log('Filtered products:', data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در فیلتر کردن محصولات';
      setError(errorMessage);
      console.error('Error filtering products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    applyFilters(filters);
  }, [filters, applyFilters]);

  return {
    products: filteredProducts,
    loading,
    error,
    refetch: () => applyFilters(filters),
  };
};

/**
 * هوک برای جستجوی محصولات
 */
export const useProductSearch = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      const results = await searchProductsAPI(query);
      setSearchResults(results);
      console.log('Search results:', results.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در جستجوی محصولات';
      setSearchError(errorMessage);
      console.error('Error searching products:', err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  return {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    search,
    clearResults: () => {
      setSearchResults([]);
      setSearchError(null);
    }
  };
};

/**
 * هوک برای دریافت محصولات مشابه
 */
export const useSimilarProducts = (productId: number, limit = 4) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { product } = useProduct(productId);
  const { products: allProducts } = useProducts();

  useEffect(() => {
    const findSimilarProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!product) {
          setSimilarProducts([]);
          return;
        }

        const similar = allProducts
          .filter(p => 
            p.id !== productId && 
            p.category === product.category
          )
          .slice(0, limit);
        
        setSimilarProducts(similar);
        console.log('Similar products:', similar.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطا در یافتن محصولات مشابه';
        setError(errorMessage);
        console.error('Error finding similar products:', err);
      } finally {
        setLoading(false);
      }
    };

    findSimilarProducts();
  }, [product, allProducts, productId, limit]);

  return {
    products: similarProducts,
    loading,
    error,
  };
};

/**
 * هوک برای دریافت محصولات پرفروش
 */
export const useBestSellingProducts = (limit = 6) => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { products: allProducts } = useProducts();

  useEffect(() => {
    const calculateBestSellers = () => {
      setLoading(true);
      setError(null);
      
      try {
        const sorted = [...allProducts]
          .sort((a, b) => {
            // امتیاز بر اساس ریتینگ و تعداد نظرات
            const scoreA = a.rating * Math.log(a.reviewCount + 1);
            const scoreB = b.rating * Math.log(b.reviewCount + 1);
            return scoreB - scoreA;
          })
          .slice(0, limit);
        
        setBestSellers(sorted);
        console.log('Best selling products:', sorted.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطا در محاسبه پرفروش‌ها';
        setError(errorMessage);
        console.error('Error calculating best sellers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (allProducts.length > 0) {
      calculateBestSellers();
    }
  }, [allProducts, limit]);

  return {
    products: bestSellers,
    loading,
    error,
  };
};

/**
 * هوک برای دریافت محصولات تخفیف‌دار
 */
export const useDiscountedProducts = (limit?: number) => {
  const [discounted, setDiscounted] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { products: allProducts } = useProducts();

  useEffect(() => {
    const findDiscounted = () => {
      setLoading(true);
      setError(null);
      
      try {
        let discountedProducts = allProducts
          .filter(p => p.discount && p.discount > 0)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0));
        
        if (limit) {
          discountedProducts = discountedProducts.slice(0, limit);
        }
        
        setDiscounted(discountedProducts);
        console.log('Discounted products:', discountedProducts.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطا در یافتن محصولات تخفیف‌دار';
        setError(errorMessage);
        console.error('Error finding discounted products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (allProducts.length > 0) {
      findDiscounted();
    }
  }, [allProducts, limit]);

  return {
    products: discounted,
    loading,
    error,
  };
};

/**
 * هوک برای دریافت دسته‌بندی‌های ساختار یافته (درختی)
 */
export const useStructuredCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStructuredCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchAPI<ApiResponse<any[]>>('/categories');
      const allCategories = response.data || [];
      
      // ایجاد ساختار درختی
      const parentCategories = allCategories.filter(cat => cat.parent_id === null);
      
      const structured = parentCategories.map(parent => ({
        ...parent,
        children: allCategories.filter(child => child.parent_id === parent.id)
      }));
      
      setCategories(structured);
      console.log('Structured categories loaded:', structured.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت ساختار دسته‌بندی‌ها';
      setError(errorMessage);
      console.error('Error fetching structured categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStructuredCategories();
  }, [loadStructuredCategories]);

  return {
    categories,
    loading,
    error,
    refetch: loadStructuredCategories
  };
};

/**
 * هوک ترکیبی برای مدیریت محصولات
 */
export const useProductManager = () => {
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    refetch: refetchProducts 
  } = useProducts();
  
  const { 
    categories, 
    detailedCategories,
    loading: categoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
  } = useProductCategories();
  
  const { 
    products: bestSellers, 
    loading: bestSellersLoading 
  } = useBestSellingProducts(6);
  
  const { 
    products: discountedProducts, 
    loading: discountedLoading 
  } = useDiscountedProducts(6);
  
  const productSearch = useProductSearch();
  const structuredCategories = useStructuredCategories();

  return {
    // همه محصولات
    allProducts: products,
    productsLoading,
    productsError,
    refetchProducts,
    
    // دسته‌بندی‌ها (ساده)
    categories,
    detailedCategories,
    categoriesLoading,
    categoriesError,
    refetchCategories,
    
    // دسته‌بندی‌های ساختار یافته
    structuredCategories: structuredCategories.categories,
    structuredCategoriesLoading: structuredCategories.loading,
    structuredCategoriesError: structuredCategories.error,
    
    // پرفروش‌ها
    bestSellingProducts: bestSellers,
    bestSellersLoading,
    
    // تخفیف‌دارها
    discountedProducts,
    discountedLoading,
    
    // جستجو
    search: productSearch.search,
    searchResults: productSearch.results,
    searchLoading: productSearch.loading,
    searchError: productSearch.error,
    clearSearch: productSearch.clearResults,
    
    // وضعیت کلی
    isLoading: productsLoading || categoriesLoading,
    hasError: !!productsError || !!categoriesError,
    
    // توابع کمکی
    getCategoryProducts: (categoryName: string) => {
      return products.filter(p => p.category === categoryName);
    },
    
    getProductsByCategoryId: (categoryId: number) => {
      const category = detailedCategories.find(c => c.id === categoryId);
      if (!category) return [];
      return products.filter(p => p.category === category.name);
    },
    
    getParentCategories: () => {
      return detailedCategories.filter(cat => cat.parent_id === null);
    },
    
    getChildCategories: (parentId: number) => {
      return detailedCategories.filter(cat => cat.parent_id === parentId);
    }
  };
};

// تابع کمکی برای تبدیل API response به فرمت مورد نیاز
export const transformApiResponse = (apiData: any[]): Product[] => {
  if (!Array.isArray(apiData)) return [];
  
  return apiData.map(item => ({
    id: item.id || 0,
    name: item.name || 'بدون نام',
    description: item.description || 'بدون توضیحات',
    price: item.price || 0,
    originalPrice: item.original_price || item.price || 0,
    discount: item.discount || 0,
    category: item.category || 'عمومی',
    stock: item.stock || 0,
    rating: item.rating || 0,
    reviewCount: item.review_count || 0,
    images: item.images || [],
    tags: item.tags || [],
    specifications: item.specifications || {},
    brand: item.brand || 'نا‌مشخص',
    sku: item.sku || '',
    weight: item.weight || 0,
    dimensions: item.dimensions || {},
    isFeatured: item.is_featured || false,
    isNew: item.is_new || false,
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString()
  }));
};

export default useProductManager;