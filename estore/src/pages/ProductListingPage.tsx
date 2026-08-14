// src/pages/ProductListingPage.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductList from '../features/products/ProductList/ProductList';
import { ProductGridLoader } from '../components/common/Loaders';

// هوک‌های API
import { 
  useProducts, 
  useProductCategories 
} from '../features/products/data/productHooks';

import { useCart } from '../contexts/CartContext';

// کامپوننت‌های مستقل
import SearchHeader from '../components/products/SearchHeader';
import FilterSidebar from '../components/products/FilterSidebar';
import ResultsHeader from '../components/products/ResultsHeader';
import NoResults from '../components/products/NoResults';
import ErrorState from '../components/products/ErrorState';
import EmptyProductsState from '../components/products/EmptyProductsState';

// هوک فیلترها
import useProductFilters from '../hooks/useProductFilters';

const ProductListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // استفاده از هوک‌های API
  const { 
    products: allProducts, 
    loading: productsLoading, 
    error: productsError 
  } = useProducts();
  
  const { 
    categories: apiCategories, 
    loading: categoriesLoading 
  } = useProductCategories();
  
  // State برای نمایش فیلترها در موبایل
  const [showFilters, setShowFilters] = useState(false);
  
  // استفاده از هوک فیلترها
  const {
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
  } = useProductFilters({
    products: allProducts,
    initialCategory: 'همه'
  });

  // پیشنهادات جستجوی سریع
  const quickSearches = useMemo(() => [
    'موبایل', 'لپ‌تاپ', 'هدفون', 'تخفیف', 'جدید'
  ], []);

  // هندلرهای عملیات
  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product, 1);
    alert(`${product.name} به سبد خرید اضافه شد`);
  }, [addToCart]);

  const handleViewDetails = useCallback((productId: number) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

  const handleQuickSearch = useCallback((query: string) => {
    setSearchTerm(query);
  }, [setSearchTerm]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleResetAllFilters = useCallback(() => {
    handleResetFilters();
    navigate('/products'); // پاک کردن پارامترهای URL
  }, [handleResetFilters, navigate]);

  // نمایش Loader
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <ProductGridLoader count={12} />
      </div>
    );
  }

  // نمایش Error
  if (productsError) {
    return <ErrorState error={productsError} />;
  }

  // اگر محصولی وجود ندارد
  if (allProducts.length === 0) {
    return <EmptyProductsState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر و جستجو */}
      <SearchHeader
        title="فروشگاه محصولات"
        subtitle={`${allProducts.length} محصول با کیفیت برای انتخاب شما`}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        quickSearches={quickSearches}
        onQuickSearch={handleQuickSearch}
      />

      <div className="container mx-auto px-4 py-6">
        {/* بخش فیلترها و نتایج */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* سایدبار فیلترها */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categoriesWithCount}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            priceRangeData={priceRangeData}
            showInStockOnly={showInStockOnly}
            onStockFilterChange={setShowInStockOnly}
            onResetFilters={handleResetAllFilters}
          />

          {/* محتوی اصلی */}
          <div className="lg:w-3/4">
            {/* هدر نتایج */}
            <ResultsHeader
              filteredCount={filteredProducts.length}
              totalCount={allProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onToggleFilters={handleToggleFilters}
            />

            {/* لیست محصولات */}
            {filteredProducts.length > 0 ? (
              <ProductList
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                title=""
                gridConfig={{ cols: 3, gap: 'lg' }}
              />
            ) : (
              <NoResults onResetFilters={handleResetAllFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;