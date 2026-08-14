// src/pages/CheckoutPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Lock, 
  ArrowLeft,
  User,
  Phone,
  Mail,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('online');
  const [address, setAddress] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address_line: '',
    city: 'تهران',
    postal_code: ''
  });
  
  // اگر کاربر لاگین نباشد، به صفحه سبد خرید هدایت شود
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/cart');
    }
  }, [isAuthenticated, navigate]);
  
  // اگر سبد خرید خالی باشد، به صفحه سبد خرید هدایت شود
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);
  
  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }, []);
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitOrder = async () => {
    if (!address.address_line.trim()) {
      alert('لطفا آدرس کامل خود را وارد کنید');
      return;
    }
    
    if (!address.phone.trim()) {
      alert('لطفا شماره تلفن خود را وارد کنید');
      return;
    }
    
    setIsProcessing(true);
    try {
      // شبیه‌سازی ثبت سفارش در API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ثبت سفارش موفق
      const orderId = Math.floor(Math.random() * 1000000) + 1000;
      
      // پاک کردن سبد خرید
      clearCart();
      
      // هدایت به صفحه موفقیت
      navigate(`/order-success/${orderId}`);
      
    } catch (error) {
      console.error('خطا در ثبت سفارش:', error);
      alert('خطایی در ثبت سفارش رخ داد. لطفا مجددا تلاش کنید.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const subtotal = totalPrice;
  const shippingFee = subtotal > 200000 ? 0 : 25000;
  const total = subtotal + shippingFee;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <CreditCard className="w-8 h-8 ml-3 text-blue-600" />
                تکمیل فرآیند خرید
              </h1>
              <p className="text-gray-600 mt-1">
                لطفا اطلاعات خود را تکمیل و پرداخت را انجام دهید
              </p>
            </div>
            <Link 
              to="/cart"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 ml-1" />
              بازگشت به سبد خرید
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* فرم اطلاعات */}
          <div className="lg:col-span-2 space-y-8">
            {/* بخش اطلاعات کاربر */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                اطلاعات شخصی
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام کامل
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={address.full_name}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      placeholder="نام و نام خانوادگی"
                      dir="auto"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شماره تلفن *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      placeholder="09123456789"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    آدرس کامل *
                  </label>
                  <textarea
                    name="address_line"
                    value={address.address_line}
                    onChange={handleAddressChange as any}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors h-32"
                    placeholder="خیابان، کوچه، پلاک، واحد"
                    dir="auto"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شهر
                    </label>
                    <select
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                    >
                      <option value="تهران">تهران</option>
                      <option value="اصفهان">اصفهان</option>
                      <option value="مشهد">مشهد</option>
                      <option value="شیراز">شیراز</option>
                      <option value="تبریز">تبریز</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کد پستی
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={address.postal_code}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      placeholder="1234567890"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* بخش روش پرداخت */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                روش پرداخت
              </h2>
              
              <div className="space-y-4">
                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'online' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('online')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'online' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'online' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">پرداخت آنلاین</div>
                      <div className="text-sm text-gray-500 mt-1">
                        پرداخت امن از طریق درگاه بانکی
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cash' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cash' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'cash' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">پرداخت در محل</div>
                      <div className="text-sm text-gray-500 mt-1">
                        پرداخت نقدی در زمان تحویل
                      </div>
                    </div>
                    <Truck className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                
                {paymentMethod === 'online' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-blue-800">پرداخت امن</div>
                        <div className="text-sm text-blue-700 mt-1">
                          پس از تایید سفارش، به درگاه امن بانکی منتقل خواهید شد.
                          اطلاعات پرداخت شما رمزنگاری شده و نزد بانک محفوظ می‌ماند.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* خلاصه سفارش */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* خلاصه سفارش */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b">خلاصه سفارش</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">تعداد کالاها</span>
                    <span className="font-medium">{items.length} کالا</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">مجموع قیمت کالاها</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">هزینه ارسال</span>
                    <span className={shippingFee === 0 ? 'text-green-600 font-bold' : 'font-medium'}>
                      {shippingFee === 0 ? 'رایگان' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  
                  {shippingFee === 0 && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                      ✓ هدیه ارسال رایگان برای شما فعال شد
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>مبلغ قابل پرداخت</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      در حال ثبت سفارش...
                    </>
                  ) : paymentMethod === 'online' ? (
                    <>
                      <CreditCard className="w-5 h-5" />
                      پرداخت آنلاین
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      ثبت سفارش
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    با کلیک بر روی دکمه، قوانین و مقررات را پذیرفته‌اید.
                  </p>
                </div>
              </div>
              
              {/* امنیت و تضمین */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">تضمین اصالت کالا</h3>
                      <p className="text-blue-800 text-sm">
                        کلیه کالاها با گارانتی اصالت و سلامت فیزیکی عرضه می‌شوند.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-green-900 mb-1">تحویل سریع</h3>
                      <p className="text-green-800 text-sm">
                        ارسال در تهران ۲۴ ساعته و سایر شهرها ۲-۳ روز کاری.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-orange-900 mb-1">گارانتی بازگشت</h3>
                      <p className="text-orange-800 text-sm">
                        ۷ روز مهلت تست و بازگشت کالا در صورت عدم رضایت.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;