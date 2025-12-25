// src/features/products/components/ProductCard/ProductCard.tsx
import React from 'react';
import { ShoppingCart, Eye, Star, Truck, Shield } from 'lucide-react';
import { ProductCardProps } from '../../../../types';

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails,
  className = ''
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };
  
  const handleViewDetails = () => {
    onViewDetails?.(product.id);
  };
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };
  
  const hasDiscount = product.discount && product.discount > 0;
  const isOutOfStock = product.stock === 0;
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 ${className} ${
        isOutOfStock ? 'opacity-70' : ''
      }`}
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleViewDetails()}
    >
      {/* بخش تصویر محصول */}
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-56 object-cover"
        />
        
        {/* نشانگر تخفیف */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {product.discount}% تخفیف
          </div>
        )}
        
        {/* نشانگر اتمام موجودی */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-bold text-gray-800">
              اتمام موجودی
            </span>
          </div>
        )}
        
        {/* دکمه‌های سریع روی تصویر */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="افزودن به سبد خرید"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>
          
          <button 
            onClick={handleViewDetails}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            title="مشاهده جزئیات"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* اطلاعات محصول */}
      <div className="p-4">
        {/* دسته‌بندی */}
        <div className="text-sm text-gray-500 mb-1">
          {product.category}
        </div>
        
        {/* نام محصول */}
        <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-blue-600 transition">
          {product.name}
        </h3>
        
        {/* توضیح کوتاه */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* رتبه‌بندی */}
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 mr-2">
            ({product.reviewCount} نظر)
          </span>
        </div>
        
        {/* قیمت */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {hasDiscount ? (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {product.originalPrice && formatPrice(product.originalPrice)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* وضعیت موجودی */}
          <div className={`text-sm font-medium ${
            product.stock > 10 ? 'text-green-600' : 
            product.stock > 0 ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {product.stock > 10 ? 'موجود' : 
             product.stock > 0 ? `${product.stock} عدد باقی‌مانده` : 
             'ناموجود'}
          </div>
        </div>
        
        {/* مشخصات اضافی */}
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-1" />
            <span>ارسال رایگان</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            <span>گارانتی</span>
          </div>
        </div>
        
        {/* دکمه اصلی افزودن به سبد */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center transition ${
            isOutOfStock 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ShoppingCart className="w-5 h-5 ml-2" />
          {isOutOfStock ? 'اتمام موجودی' : 'افزودن به سبد خرید'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;