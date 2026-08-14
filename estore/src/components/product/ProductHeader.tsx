// src/components/product/ProductHeader.tsx
import React from 'react';
import { Heart, Star } from 'lucide-react';

interface ProductHeaderProps {
  productId: number;
  productName: string;
  category: string;
  rating: number;
  reviewCount: number;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  productId,
  productName,
  category,
  rating,
  reviewCount,
  isWishlisted,
  onWishlistToggle
}) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm text-gray-500">کد محصول: {productId}</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
            {productName}
          </h1>
        </div>
        <WishlistButton 
          isWishlisted={isWishlisted}
          onToggle={onWishlistToggle}
        />
      </div>
      
      {/* ریتینگ و دسته‌بندی */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <RatingDisplay rating={rating} reviewCount={reviewCount} />
        <CategoryBadge category={category} />
      </div>
    </div>
  );
};

const WishlistButton: React.FC<{
  isWishlisted: boolean;
  onToggle: () => void;
}> = ({ isWishlisted, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`p-3 rounded-xl transition ${
      isWishlisted 
        ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border border-red-200' 
        : 'bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50'
    }`}
  >
    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500' : ''}`} />
  </button>
);

const RatingDisplay: React.FC<{
  rating: number;
  reviewCount: number;
}> = ({ rating, reviewCount }) => (
  <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i}
          className={`w-5 h-5 ${i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
          }`}
        />
      ))}
    </div>
    <span className="mr-2 font-bold text-gray-800">{rating.toFixed(1)}</span>
    <span className="text-gray-600 text-sm">({reviewCount} نظر)</span>
  </div>
);

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => (
  <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl font-medium border border-blue-200">
    {category}
  </span>
);

export default ProductHeader;