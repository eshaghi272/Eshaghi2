// src/pages/OrderSuccessPage.tsx
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ShoppingBag, 
  Home, 
  Package, 
  Clock, 
  User,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // اگر orderId وجود نداشته باشد، به صفحه اصلی هدایت شود
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* هدر */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              سفارش شما با موفقیت ثبت شد!
            </h1>
            <p className="text-gray-600 text-lg">
              سفارش شما در سیستم ثبت شده و در حال پردازش است.
            </p>
          </div>
          
          {/* کارت اطلاعات سفارش */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              اطلاعات سفارش
            </h2>
            
            <div className="space-y-6">
              {/* شماره سفارش */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">شماره سفارش</div>
                    <div className="text-sm text-gray-500">کد پیگیری سفارش شما</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-blue-600">{orderId}</div>
                </div>
              </div>
              
              {/* وضعیت سفارش */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">وضعیت سفارش</div>
                    <div className="text-sm text-gray-500">مرحله فعلی پردازش</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="px-3 py-1 bg-green-100 text-green-800 font-medium rounded-full">
                    در انتظار پردازش
                  </div>
                </div>
              </div>
              
              {/* اطلاعات کاربر */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  اطلاعات تحویل
                </h3>
                
                <div className="space-y-3">
                  {user?.full_name && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-gray-500">نام تحویل گیرنده</div>
                      </div>
                    </div>
                  )}
                  
                  {user?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{user.phone}</div>
                        <div className="text-sm text-gray-500">شماره تماس</div>
                      </div>
                    </div>
                  )}
                  
                  {user?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-gray-500">ایمیل</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* مراحل بعدی */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">مراحل بعدی</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  ۱
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">پیامک تایید</h3>
                  <p className="text-gray-600 mt-1">
                    در صورت نیاز به اطلاعات بیشتر، همکاران ما با شما تماس خواهند گرفت.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  ۲
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">آماده‌سازی سفارش</h3>
                  <p className="text-gray-600 mt-1">
                    سفارش شما در انبار آماده و بسته‌بندی می‌شود.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  ۳
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">تحویل به پست</h3>
                  <p className="text-gray-600 mt-1">
                    مرسوله شما به مامور پست تحویل داده می‌شود.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  ۴
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">دریافت کالا</h3>
                  <p className="text-gray-600 mt-1">
                    کالا در آدرس شما تحویل داده خواهد شد.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* دکمه‌های اقدام */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/orders"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              مشاهده سفارشات
            </Link>
            
            <Link 
              to="/"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              بازگشت به صفحه اصلی
            </Link>
          </div>
          
          {/* پیام پایانی */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              از اعتماد شما سپاسگزاریم. در صورت هرگونه سوال، با پشتیبانی تماس بگیرید.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              شماره پشتیبانی: <span className="font-medium">۰۲۱-۱۲۳۴۵۶۷۸</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;