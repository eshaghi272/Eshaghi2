// src/components/Dashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Package,
  CreditCard,
  MessageSquare,
  Star,
  TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">پنل مدیریت</h1>
                <p className="text-sm text-gray-600">
                  خوش آمدید، {user?.full_name || user?.username}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 font-medium rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                سلام {user?.full_name || user?.username} 👋
              </h2>
              <p className="text-blue-100">
                شما به عنوان <span className="font-bold">{user?.role === 'admin' ? 'مدیر سیستم' : 'کاربر'}</span> وارد شده‌اید
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link 
                to="/profile"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                پروفایل
              </Link>
              <Link 
                to="/orders"
                className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                سفارشات
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">سفارشات فعال</div>
                <div className="text-2xl font-bold text-gray-900 mt-2">12</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">موجودی حساب</div>
                <div className="text-2xl font-bold text-gray-900 mt-2">۲۵۰,۰۰۰ تومان</div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">نظرات ثبت شده</div>
                <div className="text-2xl font-bold text-gray-900 mt-2">۸</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">امتیاز شما</div>
                <div className="text-2xl font-bold text-gray-900 mt-2">۴.۸</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">دسترسی سریع</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/profile"
              className="p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-colors text-center"
            >
              <User className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">پروفایل</div>
            </Link>
            
            <Link 
              to="/orders"
              className="p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-colors text-center"
            >
              <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">سفارشات</div>
            </Link>
            
            <Link 
              to="/change-password"
              className="p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-colors text-center"
            >
              <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">تغییر رمز</div>
            </Link>
            
            <button className="p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-colors text-center">
              <TrendingUp className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">آمار</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;