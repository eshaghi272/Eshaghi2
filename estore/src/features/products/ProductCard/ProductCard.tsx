// src/features/products/components/ProductCard/ProductCard.tsx
import React, { useCallback, useMemo } from 'react';
import { ShoppingCart, Eye, Star, Truck, Shield, Package } from 'lucide-react';
import type { ProductCardProps } from '@/types/index'; // استفاده از alias یا مسیر صحیح

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  onAddToCart,
  onViewDetails,
  className = ''
}) => {
  // استفاده از useCallback برای جلوگیری از re-render غیرضروری
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  }, [onAddToCart, product]);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(product.id);
  }, [onViewDetails, product.id]);

  // استفاده از useMemo برای فرمت‌دهی قیمت
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('fa-IR').format(product.price) + ' تومان';
  }, [product.price]);

  const formattedOriginalPrice = useMemo(() => {
    return product.originalPrice 
      ? new Intl.NumberFormat('fa-IR').format(product.originalPrice) + ' تومان'
      : '';
  }, [product.originalPrice]);

  // استفاده از useMemo برای محاسبات شرطی
  const hasDiscount = useMemo(() => 
    product.discount && product.discount > 0, 
    [product.discount]
  );

  const isOutOfStock = useMemo(() => 
    product.stock === 0, 
    [product.stock]
  );

  const stockStatus = useMemo(() => {
    if (product.stock > 10) return { text: 'موجود', color: 'text-green-600' };
    if (product.stock > 0) return { 
      text: `${product.stock} عدد باقی‌مانده`, 
      color: 'text-yellow-600' 
    };
    return { text: 'ناموجود', color: 'text-red-600' };
  }, [product.stock]);

  // تابع برای مدیریت keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewDetails();
    }
  }, [handleViewDetails]);

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-lg overflow-hidden 
        border border-gray-100 transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1
        ${isOutOfStock ? 'opacity-70' : ''}
        ${className}
      `}
      onClick={handleViewDetails}
      role="article"
      aria-label={`محصول ${product.name}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Image Section */}
      <div className="relative group">
        <div className="relative h-56 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </div>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {product.discount}% تخفیف
            </span>
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-2xl">
              <Package className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <span className="font-bold text-gray-800 text-lg">
                اتمام موجودی
              </span>
            </div>
          </div>
        )}
        
        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`
              bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg 
              hover:bg-white hover:scale-110 active:scale-95
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-200
            `}
            aria-label={`افزودن ${product.name} به سبد خرید`}
          >
            <ShoppingCart className="w-5 h-5 text-gray-800" />
          </button>
          
          <button 
            onClick={handleViewDetails}
            className="
              bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg
              hover:bg-white hover:scale-110 active:scale-95
              transition-all duration-200
            "
            aria-label={`مشاهده جزئیات ${product.name}`}
          >
            <Eye className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </div>
      
      {/* Product Info Section */}
      <div className="p-5">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {product.category}
          </span>
        </div>
        
        {/* Product Name */}
        <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center ml-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`
                  w-4 h-4 ${i < Math.floor(product.rating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                  } ${i < product.rating ? 'scale-110' : ''}
                `}
              />
            ))}
          </div>
          <div className="flex items-center text-gray-500">
            <span className="text-sm font-medium ml-1">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs mr-2">
              ({product.reviewCount})
            </span>
          </div>
        </div>
        
        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-1">
            {/* Current Price */}
            <div className="text-2xl font-bold text-gray-900">
              {formattedPrice}
            </div>
            
            {/* Original Price (if discounted) */}
            {hasDiscount && product.originalPrice && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 line-through">
                  {formattedOriginalPrice}
                </span>
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                  صرفه‌جویی {product.discount}%
                </span>
              </div>
            )}
          </div>
          
          {/* Stock Status */}
          <div className={`text-sm font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </div>
        </div>
        
        {/* Features */}
        <div className="flex items-center justify-around mb-5 border-t border-b border-gray-100 py-3">
          <div className="flex flex-col items-center text-center">
            <Truck className="w-5 h-5 text-blue-500 mb-1" />
            <span className="text-xs text-gray-600">ارسال رایگان</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Shield className="w-5 h-5 text-green-500 mb-1" />
            <span className="text-xs text-gray-600">گارانتی</span>
          </div>
          {product.tags?.includes('جدید') && (
            <div className="flex flex-col items-center text-center">
              <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-xs font-bold text-yellow-600">N</span>
              </div>
              <span className="text-xs text-gray-600">جدید</span>
            </div>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`
            w-full py-3.5 rounded-xl font-semibold flex items-center justify-center
            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            ${isOutOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
            }
          `}
          aria-disabled={isOutOfStock}
        >
          <ShoppingCart className="w-5 h-5 ml-2" />
          {isOutOfStock ? 'اتمام موجودی' : 'افزودن به سبد خرید'}
        </button>
      </div>
    </div>
  );
};

// اضافه کردن propTypes برای توسعه بهتر
ProductCard.defaultProps = {
  className: '',
  onAddToCart: undefined,
  onViewDetails: undefined
};

export default ProductCard;