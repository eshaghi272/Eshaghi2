// src/features/products/components/ProductList/ProductList.tsx
import React, { useMemo, memo } from 'react';
import ProductCard from '../ProductCard';
import type { Product } from '@/types/index'; // استفاده از type import و alias

// Skeleton Loading Component برای استفاده مجدد
const ProductCardSkeleton: React.FC = memo(() => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
    <div className="relative h-56 bg-gray-200"></div>
    <div className="p-5 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  </div>
));

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

// Empty State Component
const EmptyState: React.FC<{ title: string; description: string }> = ({ 
  title, 
  description 
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 mb-6">
      <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500 max-w-md">{description}</p>
  </div>
);

// Error State Component
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 mb-6">
      <svg className="w-full h-full text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">خطا در بارگذاری</h3>
    <p className="text-gray-600 max-w-md mb-4">{error}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      تلاش مجدد
    </button>
  </div>
);

// اینترفیس Props کامپوننت ProductList
interface ProductListProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (productId: number) => void;
  loading?: boolean;
  error?: string | null;
  title?: string;
  showCount?: boolean;
  gridConfig?: {
    cols?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: 'sm' | 'md' | 'lg';
  };
}

// استفاده از memo برای جلوگیری از re-renderهای غیرضروری
const ProductList: React.FC<ProductListProps> = memo(({
  products,
  onAddToCart,
  onViewDetails,
  loading = false,
  error = null,
  title = 'محصولات',
  showCount = true,
  gridConfig = { cols: 4, gap: 'md' }
}) => {
  // استفاده از useMemo برای محاسبات heavy
  const gridClasses = useMemo(() => {
    const colsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };
    
    const gapMap = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    };
    
    return `${colsMap[gridConfig.cols || 4]} ${gapMap[gridConfig.gap || 'md']}`;
  }, [gridConfig.cols, gridConfig.gap]);

  // محاسبه تعداد اسکلتون‌های مورد نیاز
  const skeletonCount = useMemo(() => {
    return Math.min(products.length || 8, 12);
  }, [products.length]);

  // حالت لودینگ
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {title && (
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
        )}
        <div className={`grid ${gridClasses}`}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  // حالت خطا
  if (error) {
    return <ErrorState error={error} />;
  }

  // حالت خالی
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="محصولی یافت نشد"
        description="لطفاً فیلترهای جستجو را تغییر دهید یا دسته‌بندی دیگری را انتخاب کنید."
      />
    );
  }

  // حالت عادی
  return (
    <section className="container mx-auto px-4 py-8" aria-label="لیست محصولات">
      {/* هدر لیست */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showCount && (
            <p className="text-gray-600 mt-1">
              {products.length} محصول
            </p>
          )}
        </div>
        <div className="mt-2 sm:mt-0 text-sm text-gray-500">
          مرتب‌سازی بر اساس: 
          <select className="mr-2 bg-transparent border-none focus:outline-none">
            <option>پربازدیدترین</option>
            <option>گران‌ترین</option>
            <option>ارزان‌ترین</option>
            <option>جدیدترین</option>
          </select>
        </div>
      </div>

      {/* لیست محصولات */}
      <div className={`grid ${gridClasses}`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
            className="transition-all duration-300 hover:scale-[1.02]"
          />
        ))}
      </div>

      {/* Pagination یا Load More */}
      {products.length > 0 && (
        <div className="flex justify-center mt-12 pt-8 border-t border-gray-100">
          <button
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="بارگذاری محصولات بیشتر"
          >
            مشاهده محصولات بیشتر
          </button>
        </div>
      )}
    </section>
  );
});

// نمایش نام برای debugging در DevTools
ProductList.displayName = 'ProductList';

// تنظیمات پیش‌فرض
ProductList.defaultProps = {
  loading: false,
  error: null,
  showCount: true,
  gridConfig: {
    cols: 4,
    gap: 'md'
  }
};

export default ProductList;