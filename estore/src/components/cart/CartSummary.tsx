// src/components/cart/CartSummary.tsx
import React from 'react';
import { ShoppingBag, Package, Truck } from 'lucide-react';

interface CartSummaryProps {
  totalPrice: number;
  totalItems: number;
  formatPrice: (price: number) => string;
  onOpenLogin: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalPrice,
  totalItems,
  formatPrice,
  onOpenLogin
}) => {
  const deliveryCost = 0; // رایگان
  const finalPrice = totalPrice + deliveryCost;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-100">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-blue-500" />
          خلاصه سفارش
        </h3>
        <span className="text-sm text-gray-500">
          {totalItems} کالا
        </span>
      </div>

      {/* اطلاعات قیمت */}
      <div className="space-y-4 mb-6">
        {/* قیمت کالاها */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">قیمت کالاها:</span>
          </div>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>

        {/* هزینه ارسال */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">هزینه ارسال:</span>
          </div>
          <span className={`font-medium ${deliveryCost === 0 ? 'text-green-600' : 'text-gray-800'}`}>
            {deliveryCost === 0 ? 'رایگان' : formatPrice(deliveryCost)}
          </span>
        </div>

        {/* جمع کل */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">مبلغ قابل پرداخت:</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(finalPrice)}
              </div>
              {deliveryCost === 0 && (
                <div className="text-xs text-green-600 mt-1">
                  ✓ ارسال رایگان
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* دکمه ادامه */}
      <button
        onClick={onOpenLogin}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        ادامه و تکمیل سفارش
      </button>

      {/* توضیحات */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="text-sm text-gray-500 space-y-2">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            امکان پرداخت در محل موجود است
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            بازگشت کالا تا ۷ روز
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            ضمانت اصالت کالا
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;