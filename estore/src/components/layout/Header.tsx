// src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Moon, Sun } from 'lucide-react';
import { useTheme, ThemeSwitcher } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <header className="sticky top-0 z-50 bg-card shadow-md border-b border-theme">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            فروشگاه
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-body hover:text-primary font-medium transition">
              خانه
            </Link>
            <Link to="/products" className="text-body hover:text-primary font-medium transition">
              محصولات
            </Link>
            <Link to="/categories" className="text-body hover:text-primary font-medium transition">
              دسته‌بندی‌ها
            </Link>
            <Link to="/about" className="text-body hover:text-primary font-medium transition">
              درباره ما
            </Link>
            <Link to="/contact" className="text-body hover:text-primary font-medium transition">
              تماس با ما
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* جستجو */}
            <button className="p-2 hover:bg-surface rounded-lg transition">
              <Search className="w-5 h-5 text-body" />
            </button>
            
            {/* تغییر تم */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-surface rounded-lg transition"
              aria-label={isDarkMode ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {/* سبد خرید */}
            <Link to="/cart" className="relative p-2 hover:bg-surface rounded-lg transition">
              <ShoppingCart className="w-5 h-5 text-body" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error-color text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* کاربر */}
            <Link 
              to={isAuthenticated ? "/account" : "/login"} 
              className="p-2 hover:bg-surface rounded-lg transition"
            >
              <User className="w-5 h-5 text-body" />
            </Link>
            
            {/* منو در موبایل */}
            <button className="md:hidden p-2 hover:bg-surface rounded-lg transition">
              <Menu className="w-5 h-5 text-body" />
            </button>
          </div>
        </div>
        
        {/* تنظیمات پیشرفته تم (اختیاری) */}
        <div className="hidden lg:flex justify-end mt-2 pb-2">
          <div className="text-sm text-muted">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;