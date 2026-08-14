// src/components/product/ProductPricing.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface ProductPricingProps {
  price: number;
  originalPrice?: number;
  discount?: number;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ 
  price, 
  originalPrice, 
  discount 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
      {originalPrice ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900">
                {formatPrice(price)}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 line-through text-lg">
                  {formatPrice(originalPrice)}
                </span>
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-lg font-bold shadow-lg">
                  {discount}% تخفیف
                </span>
              </div>
            </div>
            <SavingsDisplay 
              savings={originalPrice - price}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      ) : (
        <RegularPrice 
          price={price}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
};

const SavingsDisplay: React.FC<{
  savings: number;
  formatPrice: (price: number) => string;
}> = ({ savings, formatPrice }) => (
  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-5 py-3 rounded-xl">
    <div className="text-green-800 font-bold text-lg">
      {formatPrice(savings)}
    </div>
    <div className="text-green-600 text-sm">صرفه‌جویی شما</div>
  </div>
);

const RegularPrice: React.FC<{
  price: number;
  formatPrice: (price: number) => string;
}> = ({ price, formatPrice }) => (
  <div className="flex items-center justify-between">
    <div className="text-4xl font-bold text-gray-900">
      {formatPrice(price)}
    </div>
    <div className="flex items-center text-green-600">
      <Check className="w-6 h-6 ml-2" />
      <span className="font-medium">قیمت نهایی</span>
    </div>
  </div>
);

export default ProductPricing;