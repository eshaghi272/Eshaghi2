// src/pages/CartPage.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Truck, 
  Shield, 
  Package,
  LogIn,
  Lock,
  UserCog,
  AlertTriangle,
  Check,
  X,
  ShoppingCart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import type { Product } from '../types/index';

// کامپوننت آیتم سبد خرید
const CartItemCard: React.FC<{
  item: { product: Product; quantity: number };
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  formatPrice: (price: number) => string;
}> = ({ item, onUpdateQuantity, onRemove, formatPrice }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      alert(`موجودی محصول ${item.product.name} تنها ${item.product.stock} عدد است`);
      return;
    }
    setQuantity(newQuantity);
    onUpdateQuantity(item.product.id, newQuantity);
  }, [item, onUpdateQuantity]);

  const handleRemove = useCallback(async () => {
    if (!window.confirm(`آیا از حذف ${item.product.name} از سبد خرید مطمئن هستید؟`)) {
      return;
    }
    
    setIsRemoving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onRemove(item.product.id);
    } finally {
      setIsRemoving(false);
    }
  }, [item, onRemove]);

  const totalItemPrice = item.product.price * item.quantity;
  const hasDiscount = item.product.originalPrice && item.product.originalPrice > item.product.price;
  const discountAmount = hasDiscount ? 
    (item.product.originalPrice! - item.product.price) * item.quantity : 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden ${
      isRemoving ? 'opacity-50' : ''
    }`}>
      <div className="flex flex-col sm:flex-row p-4">
        {/* تصویر محصول */}
        <Link 
          to={`/products/${item.product.id}`}
          className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 self-center sm:self-start"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={item.product.imageUrl} 
              alt={item.product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {hasDiscount && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                {Math.round((item.product.originalPrice! - item.product.price) / item.product.originalPrice! * 100)}% تخفیف
              </div>
            )}
          </div>
        </Link>
        
        {/* اطلاعات محصول */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
            <div className="flex-grow">
              <Link 
                to={`/products/${item.product.id}`}
                className="hover:text-blue-600 transition-colors inline-block"
              >
                <h3 className="font-bold text-lg line-clamp-1">{item.product.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                  {item.product.category}
                </span>
                {item.product.is_new && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    جدید
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleRemove}
              disabled={isRemoving}
              className="self-end sm:self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              aria-label="حذف محصول"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.product.description}
          </p>
          
          {/* قیمت‌ها */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(totalItemPrice)}
                </span>
                {quantity > 1 && (
                  <span className="text-sm text-gray-500">
                    (هر عدد: {formatPrice(item.product.price)})
                  </span>
                )}
              </div>
              
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(item.product.originalPrice! * item.quantity)}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {formatPrice(discountAmount)} صرفه‌جویی
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* کنترل تعداد و وضعیت موجودی */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="flex items-center justify-between sm:justify-start">
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <div className="w-16 h-10 flex items-center justify-center border border-gray-300 rounded-lg mx-2 bg-gray-50">
                  <span className="font-medium text-lg">{quantity}</span>
                </div>
                
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= item.product.stock}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="افزایش تعداد"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* وضعیت موجودی */}
            <div className={`text-sm font-medium px-3 py-2 rounded-lg ${
              item.product.stock > 10 ? 'bg-green-50 text-green-700' :
              item.product.stock > 0 ? 'bg-yellow-50 text-yellow-700' :
              'bg-red-50 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                {item.product.stock > 10 && <Check className="w-4 h-4" />}
                {item.product.stock > 0 && item.product.stock <= 10 && <AlertTriangle className="w-4 h-4" />}
                {item.product.stock <= 0 && <X className="w-4 h-4" />}
                <span>
                  {item.product.stock > 10 ? 'موجود در انبار' :
                   item.product.stock > 0 ? `تنها ${item.product.stock} عدد باقی‌مانده` :
                   'موجود نیست'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// کامپوننت مودال تغییر مشتری
const CustomerSwitchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: any;
}> = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl">
              <UserCog className="text-amber-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">تغییر مشتری</h3>
              <p className="text-gray-600 text-sm mt-1">آیا می‌خواهید مشتری فعلی را تغییر دهید؟</p>
            </div>
          </div>

          {/* اطلاعات کاربر فعلی */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {user.full_name?.charAt(0) || user.username?.charAt(0) || 'م'}
                </span>
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-900">{user.full_name || user.username}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.phone && (
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                      📞 {user.phone}
                    </span>
                  )}
                  {user.email && (
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                      ✉️ {user.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* هشدارها */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 mb-2">توجه مهم</p>
                <ul className="text-sm text-red-700 list-disc pr-5 space-y-1">
                  <li>اطلاعات مشتری فعلی حذف خواهد شد</li>
                  <li>سبد خرید شما ذخیره می‌شود</li>
                  <li>به صفحه ورود منتقل خواهید شد</li>
                  <li>برای بازگشت باید مجددا وارد شوید</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <ShoppingCart className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 mb-1">سبد خرید شما حفظ می‌شود</p>
                <p className="text-sm text-blue-700">
                  محصولات انتخابی شما ذخیره خواهند شد و می‌توانید بعد از ورود مجدد مشاهده کنید.
                </p>
              </div>
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 active:scale-95"
            >
              انصراف
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <UserCog className="w-5 h-5" />
              تغییر مشتری
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart, totalItems } = useCart();
  const { isAuthenticated, user, switchToGuest } = useAuth();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  
  // فرمت‌دهنده قیمت
  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }, []);
  
  // محاسبات خلاصه سفارش
  const summary = useMemo(() => {
    const subtotal = totalPrice;
    const shippingFee = subtotal > 2000000 ? 0 : 25000;
    const discount = items.reduce((total, item) => {
      if (item.product.originalPrice) {
        return total + ((item.product.originalPrice - item.product.price) * item.quantity);
      }
      return total;
    }, 0);
    const total = subtotal + shippingFee;
    
    return {
      subtotal,
      shippingFee,
      discount,
      total,
      hasShippingDiscount: subtotal > 2000000,
      hasItemsWithDiscount: discount > 0,
      finalTotal: total - discount > 0 ? total - discount : 0
    };
  }, [items, totalPrice]);
  
  // تابع برای ادامه فرآیند خرید
  const handleContinueToCheckout = useCallback(async () => {
    if (!isAuthenticated) {
      localStorage.setItem('cart_redirect', '/checkout');
      if (window.confirm('برای ادامه فرآیند خرید، باید وارد حساب کاربری خود شوید. آیا مایل به ورود هستید؟')) {
        navigate('/auth/login');
      }
      return;
    }
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/checkout');
    } catch (error) {
      console.error('خطا در ادامه فرآیند خرید:', error);
      alert('خطایی در ادامه فرآیند خرید رخ داد. لطفا مجددا تلاش کنید.');
    } finally {
      setIsProcessing(false);
    }
  }, [isAuthenticated, navigate]);
  
  // تابع تغییر مشتری
  const handleSwitchCustomer = useCallback(() => {
    // ذخیره سبد خرید فعلی
    const cartData = {
      items: items,
      total: totalPrice,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('pending_cart', JSON.stringify(cartData));
    
    // پاک کردن مشتری فعلی
    switchToGuest();
    
    // بستن مودال
    setShowSwitchModal(false);
    
    // پیام موفقیت
    setTimeout(() => {
      alert('اطلاعات مشتری قبلی پاک شد. اکنون می‌توانید با حساب کاربری دیگری وارد شوید.');
      navigate('/auth/login');
    }, 300);
  }, [switchToGuest, navigate, items, totalPrice]);
  
  // خالی کردن سبد خرید
  const handleClearCart = useCallback(() => {
    if (!window.confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) {
      return;
    }
    
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 500);
  }, [clearCart]);
  
  // Empty State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="relative mb-8">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-blue-300" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full blur-2xl opacity-70"></div>
              <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-70"></div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">سبد خرید شما خالی است</h1>
            <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">
              هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید
            </p>
            
            <div className="space-y-6">
              <Link 
                to="/products" 
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl text-lg"
              >
                <span>مشاهده محصولات</span>
                <ArrowLeft className="w-6 h-6 mr-3" />
              </Link>
              
              <div className="pt-10 border-t border-gray-200">
                <h3 className="text-2xl font-semibold mb-8">چرا خرید از ما؟</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <Truck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">ارسال سریع و رایگان</h4>
                    <p className="text-gray-600">ارسال رایگان برای خریدهای بالای ۲ میلیون تومان</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">گارانتی ۱۸ ماهه</h4>
                    <p className="text-gray-600">گارانتی اصل‌بودن کالا و بازگشت ۷ روزه</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <Package className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">پشتیبانی ۲۴ ساعته</h4>
                    <p className="text-gray-600">پشتیبانی تلفنی و آنلاین در تمام ساعات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* هدر */}
        <header className="bg-white shadow-lg border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">سبد خرید</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {totalItems} کالا
                    </span>
                    <span className="text-gray-600">
                      مجموع: {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* دکمه تغییر مشتری در هدر */}
                {isAuthenticated && user && (
                  <button
                    onClick={() => setShowSwitchModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <UserCog className="w-5 h-5" />
                    <span>تغییر مشتری</span>
                  </button>
                )}
                
                <button 
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                  {isClearing ? 'در حال خالی کردن...' : 'خالی کردن سبد'}
                </button>
                
                <Link 
                  to="/products"
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                  ادامه خرید
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* لیست محصولات */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <ShoppingCart className="w-7 h-7 text-blue-500" />
                    کالاهای انتخابی شما
                  </h2>
                  <div className="text-sm text-gray-500">
                    {items.length} محصول
                  </div>
                </div>
                
                <div className="space-y-6">
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
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
                <h3 className="font-bold text-2xl mb-8 text-center">مزایای خرید از ما</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Truck className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">ارسال رایگان</div>
                        <div className="text-sm opacity-90">برای خریدهای بالای ۲ میلیون</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Package className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">بسته‌بندی ویژه</div>
                        <div className="text-sm opacity-90">ضد ضربه و ضد آب</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Shield className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">گارانتی بازگشت</div>
                        <div className="text-sm opacity-90">۷ روز مهلت تست محصول</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* خلاصه سفارش */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-8">
                {/* کارت خلاصه سفارش */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">خلاصه سفارش</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Shield className="w-5 h-5" />
                      <span className="text-sm opacity-90">خرید امن و تضمین شده</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* وضعیت لاگین کاربر */}
                    {!isAuthenticated ? (
                      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <Lock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-yellow-800">نیاز به ورود به حساب</div>
                            <div className="text-sm text-yellow-700 mt-1">
                              برای ادامه فرآیند خرید، لطفا وارد حساب کاربری خود شوید.
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link 
                            to="/auth/login"
                            className="py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-center rounded-lg font-bold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <LogIn className="w-4 h-4" />
                            ورود
                          </Link>
                          <Link 
                            to="/auth/register"
                            className="py-3 border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 text-center rounded-lg font-bold transition-all duration-200 hover:scale-105"
                          >
                            ثبت‌نام
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <div className="font-bold text-green-800">ورود موفق</div>
                              <div className="text-sm text-green-700 mt-1">
                                سلام <span className="font-bold">{user?.full_name || user?.username}</span>، خوش آمدید
                              </div>
                            </div>
                          </div>
                          
                          {/* دکمه تغییر مشتری */}
                          <button
                            onClick={() => setShowSwitchModal(true)}
                            className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 hover:from-amber-100 hover:to-orange-100 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <UserCog className="w-4 h-4" />
                            تغییر مشتری
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* جزئیات قیمت */}
                    <div className="space-y-4">
                      <div className="flex justify-between py-3">
                        <span className="text-gray-600">قیمت کالاها ({totalItems} عدد)</span>
                        <span className="font-bold text-lg">{formatPrice(summary.subtotal)}</span>
                      </div>
                      
                      {summary.hasItemsWithDiscount && (
                        <div className="flex justify-between py-3 bg-green-50 p-3 rounded-lg">
                          <span className="text-green-700 font-medium">تخفیف کالاها</span>
                          <span className="font-bold text-lg text-green-600">
                            -{formatPrice(summary.discount)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between py-3">
                        <span className="text-gray-600">هزینه ارسال</span>
                        <span className={`font-bold text-lg ${summary.hasShippingDiscount ? 'text-green-600' : ''}`}>
                          {summary.hasShippingDiscount ? 'رایگان 🎉' : formatPrice(summary.shippingFee)}
                        </span>
                      </div>
                      
                      {summary.hasShippingDiscount && (
                        <div className="text-sm text-green-600 bg-green-50 p-4 rounded-xl border border-green-200">
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            <span>هزینه ارسال برای شما رایگان شد!</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="border-t pt-6 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">مبلغ قابل پرداخت</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatPrice(summary.finalTotal)}
                            </div>
                            {summary.hasItemsWithDiscount && (
                              <div className="text-sm text-gray-500 line-through mt-1">
                                {formatPrice(summary.total)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* دکمه ادامه خرید */}
                    <button 
                      onClick={handleContinueToCheckout}
                      disabled={isProcessing || (!isAuthenticated && items.length > 0)}
                      className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 ${
                        isAuthenticated 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white' 
                          : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                      } ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          در حال پردازش...
                        </>
                      ) : (
                        <>
                          <Lock className="w-6 h-6" />
                          {isAuthenticated ? 'ادامه فرآیند خرید' : 'لطفا ابتدا وارد شوید'}
                        </>
                      )}
                    </button>
                    
                    {/* توضیحات پایین */}
                    <div className="mt-6 pt-6 border-t text-center">
                      <p className="text-sm text-gray-500">
                        {isAuthenticated 
                          ? 'هزینه نهایی پس از ثبت آدرس و انتخاب روش ارسال محاسبه می‌شود'
                          : 'برای مشاهده قیمت نهایی و ادامه خرید، ابتدا وارد حساب کاربری خود شوید'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* کارت امنیت */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Shield className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">خرید ۱۰۰٪ امن</h3>
                      <p className="text-sm opacity-90">
                        اطلاعات شما کاملاً محفوظ است. از درگاه‌های امن شاپرک برای پرداخت استفاده می‌کنیم.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* دکمه بازگشت */}
                <div className="text-center">
                  <Link 
                    to="/products"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold text-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 ml-2" />
                    بازگشت و ادامه خرید از فروشگاه
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* مودال تغییر مشتری */}
      <CustomerSwitchModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        onConfirm={handleSwitchCustomer}
        user={user || {}}
      />
    </>
  );
};

export default CartPage;