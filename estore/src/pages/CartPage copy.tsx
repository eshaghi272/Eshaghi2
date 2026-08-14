// src/pages/CartPage.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, Shield, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types/index';

// کامپوننت جداگانه برای آیتم سبد خرید
const CartItemCard: React.FC<{
  item: { product: Product; quantity: number };
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  formatPrice: (price: number) => string;
}> = ({ item, onUpdateQuantity, onRemove, formatPrice }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  
  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      alert(`موجودی محصول ${item.product.name} تنها ${item.product.stock} عدد است`);
      return;
    }
    setQuantity(newQuantity);
    onUpdateQuantity(item.product.id, newQuantity);
  }, [item, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    if (window.confirm(`آیا از حذف ${item.product.name} از سبد خرید مطمئن هستید؟`)) {
      onRemove(item.product.id);
    }
  }, [item, onRemove]);

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row p-4">
        {/* تصویر محصول */}
        <Link 
          to={`/products/${item.product.id}`}
          className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6"
        >
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden">
            <img 
              src={item.product.imageUrl} 
              alt={item.product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {item.product.discount && item.product.discount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.product.discount}% تخفیف
              </div>
            )}
          </div>
        </Link>
        
        {/* اطلاعات محصول */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <Link 
              to={`/products/${item.product.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              <h3 className="font-bold text-lg line-clamp-1">{item.product.name}</h3>
            </Link>
            <button 
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="حذف محصول"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-sm text-gray-500 mb-2">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              {item.product.category}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.product.description}
          </p>
          
          {/* قیمت‌ها */}
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(item.product.price * item.quantity)}
              </span>
              {item.quantity > 1 && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-500">
                    هر عدد: {formatPrice(item.product.price)}
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* کنترل تعداد و وضعیت موجودی */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="کاهش تعداد"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="w-12 h-10 flex items-center justify-center border border-gray-300 rounded-lg mx-2">
                <span className="font-medium text-lg">{quantity}</span>
              </div>
              
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= item.product.stock}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="افزایش تعداد"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* وضعیت موجودی */}
            <div className={`text-sm font-medium ${
              item.product.stock > 10 ? 'text-green-600' :
              item.product.stock > 0 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {item.product.stock > 10 ? 'موجود' :
               item.product.stock > 0 ? `${item.product.stock} عدد باقی‌مانده` :
               'ناموجود'}
            </div>
          </div>
        </div>
      </div>
      
      {/* تخفیف اگر وجود داشته باشد */}
      {item.product.originalPrice && (
        <div className="bg-blue-50 border-t border-blue-100 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">تخفیف این محصول:</span>
            <span className="font-bold text-green-600">
              {formatPrice((item.product.originalPrice - item.product.price) * item.quantity)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart, totalItems } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  
  // فرمت‌دهنده قیمت
  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }, []);
  
  // محاسبات خلاصه سفارش
  const summary = useMemo(() => {
    const subtotal = totalPrice;
    const shippingFee = subtotal > 200000 ? 0 : 25000;
    const discount = items.reduce((total, item) => {
      if (item.product.originalPrice) {
        return total + ((item.product.originalPrice - item.product.price) * item.quantity);
      }
      return total;
    }, 0);
    const total = subtotal + shippingFee - discount;
    
    return {
      subtotal,
      shippingFee,
      discount,
      total,
      hasShippingDiscount: subtotal > 200000,
      hasItemsWithDiscount: discount > 0
    };
  }, [items, totalPrice]);
  
  // Empty State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">سبد خرید شما خالی است</h1>
            <p className="text-gray-600 mb-8 text-lg">
              محصولات مورد علاقه خود را به سبد خرید اضافه کنید
            </p>
            
            <div className="space-y-4">
              <Link 
                to="/products" 
                className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>مشاهده محصولات</span>
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
              
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">چرا خرید از ما؟</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">ارسال رایگان</span>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">گارانتی بازگشت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const handleClearCart = useCallback(() => {
    if (window.confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) {
      setIsClearing(true);
      setTimeout(() => {
        clearCart();
        setIsClearing(false);
      }, 300);
    }
  }, [clearCart]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <ShoppingBag className="w-8 h-8 ml-3 text-blue-600" />
                سبد خرید شما
              </h1>
              <p className="text-gray-600 mt-1">
                {totalItems} کالا در سبد خرید شما وجود دارد
              </p>
            </div>
            <Link 
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 ml-1" />
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* لیست محصولات */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">کالاهای انتخابی شما</h2>
                <button 
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-red-600 hover:text-red-800 font-medium flex items-center disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 ml-1" />
                  {isClearing ? 'در حال خالی کردن...' : 'خالی کردن سبد'}
                </button>
              </div>
              
              <div className="space-y-4">
                {items.map(item => (
                  <CartItemCard
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </div>
            
            {/* مزایای خرید */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Shield className="w-5 h-5 ml-2 text-green-600" />
                مزایای خرید از ما
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-white rounded-lg">
                  <Truck className="w-6 h-6 text-green-600 ml-3" />
                  <div>
                    <div className="font-medium">ارسال رایگان</div>
                    <div className="text-sm text-gray-500">برای خریدهای بالای ۲۰۰ هزار تومان</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg">
                  <Package className="w-6 h-6 text-blue-600 ml-3" />
                  <div>
                    <div className="font-medium">بسته‌بندی ویژه</div>
                    <div className="text-sm text-gray-500">ضد ضربه و ضد آب</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600 ml-3" />
                  <div>
                    <div className="font-medium">گارانتی بازگشت</div>
                    <div className="text-sm text-gray-500">۷ روز مهلت تست محصول</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* خلاصه سفارش */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* کارت خلاصه سفارش */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b">خلاصه سفارش</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">قیمت کالاها ({totalItems} عدد)</span>
                    <span className="font-medium">{formatPrice(summary.subtotal)}</span>
                  </div>
                  
                  {summary.hasItemsWithDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>تخفیف کالاها</span>
                      <span className="font-bold">-{formatPrice(summary.discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">هزینه ارسال</span>
                    <span className={summary.hasShippingDiscount ? 'text-green-600 font-bold' : 'font-medium'}>
                      {summary.hasShippingDiscount ? 'رایگان' : formatPrice(summary.shippingFee)}
                    </span>
                  </div>
                  
                  {summary.hasShippingDiscount && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                      ✓ هزینه ارسال برای شما رایگان شد
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>مبلغ قابل پرداخت</span>
                      <span className="text-blue-600">{formatPrice(summary.total)}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  ادامه فرآیند خرید
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    هزینه نهایی پس از ثبت آدرس محاسبه می‌شود
                  </p>
                </div>
              </div>
              
              {/* کارت امنیت */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-blue-600 ml-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">خرید امن</h3>
                    <p className="text-blue-800 text-sm">
                      اطلاعات شما نزد ما کاملاً محفوظ است. از درگاه‌های امن بانکی برای پرداخت استفاده می‌کنیم.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* پیشنهاد ادامه خرید */}
              <div className="text-center">
                <Link 
                  to="/products"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 ml-1" />
                  بازگشت و ادامه خرید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;