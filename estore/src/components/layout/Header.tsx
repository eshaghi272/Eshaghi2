// src/components/layout/Header.tsx (بخش سبد خرید را به‌روز کنید)
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import CartSummary from '../ui/CartSummary'; // اضافه کردن ایمپورت

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* لوگو */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          eStore
        </Link>

        {/* منوی ناوبری */}
        <nav className="hidden md:flex space-x-6">
          {/* ... منوها */}
        </nav>

        {/* سبد خرید و ورود */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {/* اضافه کردن CartSummary */}
          <CartSummary />
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            ورود / ثبت‌نام
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;