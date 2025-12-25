// src/pages/CartPage.tsx
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useFormatters } from '../hooks/useFormatters';
import { Link } from 'react-router-dom';
import { Product } from '../types';
const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { formatPrice } = useFormatters();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">سبد خرید شما خالی است</h1>
        <p className="text-gray-600 mb-8">
          می‌توانید برای دیدن محصولات به صفحه محصولات مراجعه کنید.
        </p>
        <Link 
          to="/products" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سبد خرید شما</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* لیست محصولات */}
        <div className="lg:col-span-2">
          {items.map(item => (
            <div 
              key={item.product.id} 
              className="bg-white rounded-lg shadow p-4 mb-4 flex items-center"
            >
              {/* تصویر محصول */}
              <img 
                src={item.product.imageUrl} 
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              
              {/* اطلاعات محصول */}
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-gray-600">{formatPrice(item.product.price)}</p>
                <p className="text-sm text-gray-500">
                  موجودی: {item.product.stock} عدد
                </p>
              </div>
              
              {/* کنترل تعداد */}
              <div className="flex items-center space-x-3 mr-6">
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {/* قیمت کل این آیتم */}
              <div className="font-semibold text-lg ml-6">
                {formatPrice(item.product.price * item.quantity)}
              </div>
              
              {/* دکمه حذف */}
              <button 
                onClick={() => removeFromCart(item.product.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full ml-4"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {/* دکمه خالی کردن سبد */}
          <button 
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium mt-4"
          >
            خالی کردن سبد خرید
          </button>
        </div>
        
        {/* خلاصه سفارش */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">خلاصه سفارش</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>تعداد کالاها:</span>
                <span>{items.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>مجموع:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>هزینه ارسال:</span>
                <span className="text-green-600">رایگان</span>
              </div>
              
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>مبلغ قابل پرداخت:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
            
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold">
              ادامه فرآیند خرید
            </button>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              هزینه نهایی پس از ثبت آدرس مشخص می‌شود
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;