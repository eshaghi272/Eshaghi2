// src/features/products/components/ProductList/ProductList.tsx
import React from 'react';
import ProductCard from '../ProductCard';
import { Product } from '../../../../types';

interface ProductListProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (productId: number) => void;
  loading?: boolean;
  error?: string | null;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  onViewDetails,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-500 text-xl mb-4">خطا در بارگذاری محصولات</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-gray-500 text-xl mb-4">محصولی یافت نشد</div>
        <p className="text-gray-400">لطفاً فیلترهای جستجو را تغییر دهید.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;