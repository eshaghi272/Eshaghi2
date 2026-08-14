// src/hooks/useProductFilters.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../types/index';

interface UseProductFiltersProps {
  products: Product[];
  initialCategory?: string;
}

interface UseProductFiltersReturn {
  filteredProducts: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (show: boolean) => void;
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'rating';
  setSortBy: (sort: 'default' | 'price_asc' | 'price_desc' | 'rating') => void;
  categoriesWithCount: Array<{ name: string; count: number }>;
  priceRangeData: { min: number; max: number; defaultMin: number; defaultMax: number };
  handleResetFilters: () => void;
}

const useProductFilters = ({
  products,
  initialCategory = 'همه'
}: UseProductFiltersProps): UseProductFiltersReturn => {
  const [searchParams] = useSearchParams();
  
  // States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || initialCategory
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating'>('default');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // محاسبه محدوده قیمت از داده‌های واقعی
  const priceRangeData = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 100000000, defaultMin: 0, defaultMax: 100000000 };
    }
    
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    return {
      min,
      max,
      defaultMin: 0,
      defaultMax: max
    };
  }, [products]);

  // دسته‌بندی‌ها با تعداد (از داده‌های واقعی)
  const categoriesWithCount = useMemo(() => {
    if (products.length === 0) {
      return [{ name: 'همه', count: 0 }];
    }
    
    // محاسبه تعداد هر دسته‌بندی
    const categoryCounts: Record<string, number> = {};
    products.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    
    // ایجاد آرایه دسته‌بندی‌ها
    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }));
    
    // اضافه کردن گزینه "همه"
    return [
      { name: 'همه', count: products.length },
      ...categories.sort((a, b) => b.count - a.count)
    ];
  }, [products]);

  // فیلتر کردن محصولات
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    let result = products.filter(product => {
      // فیلتر دسته‌بندی
      if (selectedCategory !== 'همه' && product.category !== selectedCategory) {
        return false;
      }
      
      // فیلتر قیمت
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // فیلتر موجودی
      if (showInStockOnly && product.stock === 0) {
        return false;
      }
      
      // فیلتر جستجو
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          product.category.toLowerCase().includes(query)
        );
      }
      
      return true;
    });

    // مرتب‌سازی
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // مرتب‌سازی پیش‌فرض (جدیدترین)
        result.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, priceRange, showInStockOnly, sortBy]);

  // تابع ریست فیلترها
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('همه');
    setPriceRange([0, priceRangeData.defaultMax]);
    setShowInStockOnly(false);
    setSortBy('default');
  }, [priceRangeData.defaultMax]);

  return {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    showInStockOnly,
    setShowInStockOnly,
    sortBy,
    setSortBy,
    categoriesWithCount,
    priceRangeData,
    handleResetFilters
  };
};

export default useProductFilters;