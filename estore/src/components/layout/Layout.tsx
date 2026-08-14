// src/components/layout/Layout.tsx
import React from 'react'; // این خط را اضافه کنید
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'خانه', path: '/' },
    { name: 'محصولات', path: '/products' },
    { name: 'دسته‌بندی‌ها', path: '/categories' },
    { name: 'درباره ما', path: '/about' },
    { name: 'تماس با ما', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* هدر */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* لوگو */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ES</span>
              </div>
              <span className="text-xl font-bold text-gray-900">eStore</span>
            </Link>

            {/* ناوبری دسکتاپ */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition ${
                    isActive(item.path)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* آیکون‌های سمت چپ */}
            <div className="flex items-center space-x-4">
              {/* جستجو */}
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* حساب کاربری */}
              <Link
                to="/profile"
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <User className="w-5 h-5 text-gray-600" />
              </Link>

              {/* سبد خرید */}
              <Link
                to="/cart"
                className="p-2 hover:bg-gray-100 rounded-full transition relative"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* منوی موبایل */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* منوی موبایل */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* فوتر */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* درباره */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ES</span>
                </div>
                <span className="text-xl font-bold">eStore</span>
              </div>
              <p className="text-gray-400">
                فروشگاه آنلاین با بهترین کیفیت و قیمت
              </p>
            </div>

            {/* لینک‌های سریع */}
            <div>
              <h3 className="font-bold text-lg mb-4">لینک‌های سریع</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-white transition">
                    محصولات
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-gray-400 hover:text-white transition">
                    دسته‌بندی‌ها
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition">
                    درباره ما
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition">
                    تماس با ما
                  </Link>
                </li>
              </ul>
            </div>

            {/* خدمات */}
            <div>
              <h3 className="font-bold text-lg mb-4">خدمات</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">ارسال رایگان</li>
                <li className="text-gray-400">گارانتی بازگشت</li>
                <li className="text-gray-400">پشتیبانی ۲۴/۷</li>
                <li className="text-gray-400">پرداخت امن</li>
              </ul>
            </div>

            {/* تماس */}
            <div>
              <h3 className="font-bold text-lg mb-4">تماس با ما</h3>
              <ul className="space-y-2 text-gray-400">
                <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
                <li>ایمیل: info@estore.com</li>
                <li>آدرس: تهران، خیابان ولیعصر</li>
              </ul>
            </div>
          </div>

          {/* کپی‌رایت */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© ۲۰۲۴ eStore. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;