// src/components/cart/CartHeader.tsx
import React from 'react';
import { ShoppingCart, User, LogOut, Trash2 } from 'lucide-react';

interface CartHeaderProps {
  totalItems: number;
  totalPrice: string;
  isAuthenticated: boolean;
  onSwitchCustomer: () => void;
  onClearCart: () => void;
  isClearing: boolean;
  onOpenLogin: () => void; // اضافه شده
}

const CartHeader: React.FC<CartHeaderProps> = ({
  totalItems,
  totalPrice,
  isAuthenticated,
  onSwitchCustomer,
  onClearCart,
  isClearing,
  onOpenLogin
}) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">سبد خرید</h1>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">{totalItems}</span> کالا - مجموع: {' '}
                <span className="font-bold text-blue-600">{totalPrice}</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* دکمه‌های کاربر */}
            <div className="flex gap-3">
              {isAuthenticated ? (
                <button
                  onClick={onSwitchCustomer}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  تغییر مشتری
                </button>
              ) : (
                <button
                  onClick={onOpenLogin} // تغییر به onOpenLogin
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  ورود / ثبت‌نام
                </button>
              )}
              
              <button
                onClick={onClearCart}
                disabled={isClearing}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                {isClearing ? 'در حال خالی کردن...' : 'خالی کردن سبد'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CartHeader;