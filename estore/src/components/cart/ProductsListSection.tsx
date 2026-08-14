// src/components/cart/ProductsListSection.tsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import CartItemCard from './CartItemCard';
import type { Product } from '../../types/index';

interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductsListSectionProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  formatPrice: (price: number) => string;
}

const ProductsListSection: React.FC<ProductsListSectionProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  formatPrice
}) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
      {/* هدر بخش */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ShoppingCart className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              کالاهای انتخابی شما
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              می‌توانید تعداد یا مشخصات کالاها را تغییر دهید
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">تعداد کالاها</div>
            <div className="text-lg font-bold text-blue-600">{totalItems} عدد</div>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div className="text-right">
            <div className="text-sm text-gray-500">تعداد اقلام</div>
            <div className="text-lg font-bold text-blue-600">{items.length} قلم</div>
          </div>
        </div>
      </div>
      
      {/* لیست محصولات */}
      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">سبد خرید شما خالی است</p>
          </div>
        ) : (
          items.map(item => (
            <CartItemCard
              key={item.product.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
              formatPrice={formatPrice}
            />
          ))
        )}
      </div>

      {/* فوتر */}
      {items.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                if (confirm('آیا از حذف تمامی کالاها از سبد خرید مطمئن هستید؟')) {
                  items.forEach(item => onRemove(item.product.id));
                }
              }}
              className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-2"
            >
              حذف همه کالاها
            </button>
            <div className="text-sm text-gray-500">
              برای ادامه خرید، روی دکمه "ادامه و تکمیل سفارش" کلیک کنید
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsListSection;