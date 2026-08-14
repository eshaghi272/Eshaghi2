// src/components/product/SimilarProducts.tsx
import React from 'react';
import { ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/index';

interface SimilarProductsProps {
  products: Product[];
  currentProduct: Product;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ 
  products, 
  currentProduct 
}) => {
  const navigate = useNavigate();
  
  if (products.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="mt-12">
      <SectionHeader 
        currentProduct={currentProduct}
        onViewAll={() => navigate(`/products?category=${encodeURIComponent(currentProduct.category)}`)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            formatPrice={formatPrice}
            onClick={() => navigate(`/products/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{
  currentProduct: Product;
  onViewAll: () => void;
}> = ({ currentProduct, onViewAll }) => (
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-2xl font-bold text-gray-900">محصولات مشابه</h2>
    <button 
      onClick={onViewAll}
      className="text-blue-600 hover:text-blue-800 font-bold flex items-center"
    >
      مشاهده همه
      <ChevronLeft className="w-5 h-5 mr-2" />
    </button>
  </div>
);

const ProductCard: React.FC<{
  product: Product;
  formatPrice: (price: number) => string;
  onClick: () => void;
}> = ({ product, formatPrice, onClick }) => (
  <div 
    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
  >
    <div className="relative overflow-hidden">
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <button 
        onClick={onClick}
        className="absolute inset-0"
      ></button>
    </div>
    <div className="p-5">
      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
        {product.name}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-blue-600 font-bold">
          {formatPrice(product.price)}
        </span>
        <span className="text-gray-600 text-sm flex items-center">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
          {product.rating}
        </span>
      </div>
    </div>
  </div>
);

export default SimilarProducts;