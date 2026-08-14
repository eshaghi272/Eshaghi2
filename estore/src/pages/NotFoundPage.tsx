// src/pages/NotFoundPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Home, 
  ArrowLeft, 
  AlertTriangle, 
  Compass,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  const popularRoutes = [
    { path: '/', label: 'خانه', icon: Home, color: 'from-blue-500 to-blue-700' },
    { path: '/products', label: 'محصولات', icon: ShoppingBag, color: 'from-green-500 to-green-700' },
    { path: '/categories', label: 'دسته‌بندی‌ها', icon: Compass, color: 'from-purple-500 to-purple-700' },
  ];
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-3xl opacity-20 rounded-full"></div>
            <div className="relative w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center border-8 border-white shadow-2xl">
              <AlertTriangle className="w-24 h-24 text-orange-500" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
            404
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            صفحه مورد نظر یافت نشد!
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد، منتقل شده یا حذف شده است.
            لطفاً آدرس را بررسی کنید یا از گزینه‌های زیر استفاده کنید.
          </p>
        </div>

        {/* جستجوی محصولات */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">محصولات را جستجو کنید</h3>
          </div>
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              name="search"
              placeholder="نام محصول، دسته‌بندی یا برند مورد نظر خود را وارد کنید..."
              className="w-full pr-16 pl-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              جستجو
            </button>
          </form>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="text-gray-600 font-medium">پیشنهادات:</span>
            {['موبایل', 'لپ‌تاپ', 'هدفون', 'تخفیف', 'جدید', 'پرفروش'].map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/products?search=${encodeURIComponent(term)}`)}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all hover:scale-105 text-sm font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* مسیرهای محبوب */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {popularRoutes.map((route, index) => {
            const Icon = route.icon;
            return (
              <button
                key={route.path}
                onClick={() => navigate(route.path)}
                className={`group bg-gradient-to-br ${route.color} text-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{route.label}</h3>
                <p className="text-white/90 text-sm">
                  بازگشت به {route.label === 'خانه' ? 'صفحه اصلی' : `صفحه ${route.label}`}
                </p>
              </button>
            );
          })}
        </div>

        {/* راهنمای اضافی */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">راهنمای استفاده</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  <span>آدرس وارد شده را دوباره بررسی کنید</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="font-bold">2</span>
                  </div>
                  <span>از نوار بالای سایت برای پیمایش استفاده کنید</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="font-bold">3</span>
                  </div>
                  <span>صفحه را رفرش کنید یا بعداً مراجعه کنید</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold">بازگشت به صفحه قبل</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="group bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform" />
                <span className="font-bold">بارگذاری مجدد صفحه</span>
              </button>
            </div>
          </div>
        </div>

        {/* فوتر اطلاعات */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p className="mb-2">
            اگر فکر می‌کنید این خطا از سمت ماست، لطفاً با پشتیبانی تماس بگیرید
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <a href="mailto:support@estore.com" className="text-blue-600 hover:text-blue-800 transition">
              ✉️ support@estore.com
            </a>
            <a href="tel:+982155555555" className="text-blue-600 hover:text-blue-800 transition">
              📞 021-55555555
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              📝 صفحه تماس با ما
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;