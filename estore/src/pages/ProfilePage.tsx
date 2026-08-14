// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Calendar,
  CreditCard,
  Package,
  Star,
  Edit,
  Save,
  LogOut,
  Lock,
  Bell,
  Globe,
  Heart,
  ShoppingBag,
  ChevronRight,
  UserPlus,
  Key,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// تایپ‌های TypeScript
interface Customer {
  id: string;
  nationalCode: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  address?: string;
  city?: string;
  postalCode?: string;
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  device: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security' | 'activity'>('profile');
  
  // اطلاعات مشتری
  const [customer, setCustomer] = useState<Customer>({
    id: 'CUST-001',
    nationalCode: '0012345678',
    phone: '09121234567',
    email: 'customer@example.com',
    firstName: 'علی',
    lastName: 'محمدی',
    birthDate: '1365-05-15',
    gender: 'male',
    address: 'تهران، خیابان ولیعصر، پلاک ۱۰۰۰',
    city: 'تهران',
    postalCode: '1234567890',
    avatar: '👨',
    joinDate: '1400-03-15',
    lastLogin: '1402-12-20 ۱۴:۳۰',
    status: 'active'
  });

  // سفارشات
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-001', date: '1402-12-15', total: 1250000, status: 'delivered', items: 3 },
    { id: 'ORD-002', date: '1402-12-10', total: 850000, status: 'shipped', items: 2 },
    { id: 'ORD-003', date: '1402-12-05', total: 450000, status: 'processing', items: 1 },
    { id: 'ORD-004', date: '1402-11-28', total: 2100000, status: 'delivered', items: 5 },
    { id: 'ORD-005', date: '1402-11-20', total: 750000, status: 'cancelled', items: 2 }
  ]);

  // لاگ فعالیت‌ها
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: 'LOG-001', action: 'ورود به حساب', timestamp: '1402-12-20 ۱۴:۳۰', ip: '192.168.1.100', device: 'Chrome - Windows' },
    { id: 'LOG-002', action: 'تغییر رمز عبور', timestamp: '1402-12-15 ۱۰:۱۵', ip: '192.168.1.100', device: 'Chrome - Windows' },
    { id: 'LOG-003', action: 'ثبت سفارش جدید', timestamp: '1402-12-15 ۰۹:۴۵', ip: '192.168.1.100', device: 'Chrome - Windows' },
    { id: 'LOG-004', action: 'بروزرسانی پروفایل', timestamp: '1402-12-10 ۱۶:۲۰', ip: '192.168.1.101', device: 'Mobile - Safari' },
    { id: 'LOG-005', action: 'افزودن به علاقه‌مندی‌ها', timestamp: '1402-12-05 ۱۱:۳۰', ip: '192.168.1.102', device: 'Chrome - Android' }
  ]);

  // وضعیت سفارش
  const getOrderStatus = (status: Order['status']) => {
    const statusConfig = {
      pending: { text: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-800' },
      processing: { text: 'در حال پردازش', color: 'bg-blue-100 text-blue-800' },
      shipped: { text: 'ارسال شده', color: 'bg-purple-100 text-purple-800' },
      delivered: { text: 'تحویل شده', color: 'bg-green-100 text-green-800' },
      cancelled: { text: 'لغو شده', color: 'bg-red-100 text-red-800' }
    };
    return statusConfig[status];
  };

  // محاسبه آمار
  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length
  };

  // هندل ویرایش
  const handleInputChange = (field: keyof Customer, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // در حالت واقعی اینجا API فراخوانی می‌شود
    console.log('Saving customer data:', customer);
    setIsEditing(false);
    
    // لاگ فعالیت
    setActivityLogs(prev => [{
      id: `LOG-${Date.now()}`,
      action: 'بروزرسانی پروفایل',
      timestamp: new Date().toLocaleString('fa-IR'),
      ip: '192.168.1.100',
      device: 'Chrome - Windows'
    }, ...prev.slice(0, 9)]);
  };

  const handleLogout = () => {
    // در حالت واقعی توکن پاک می‌شود
    alert('با موفقیت خارج شدید');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <button 
                onClick={() => navigate('/')}
                className="hover:text-blue-600 transition"
              >
                خانه
              </button>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-blue-600 font-medium">حساب کاربری</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                سفارشات
              </button>
              
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* سایدبار سمت راست */}
          <div className="lg:col-span-1">
            {/* کارت پروفایل */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-5xl mb-6">
                  {customer.avatar || '👤'}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {customer.firstName} {customer.lastName}
                </h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">
                    {customer.status === 'active' ? 'حساب فعال' : 'حساب غیرفعال'}
                  </span>
                </div>
                
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">عضویت از:</span>
                    <span className="font-medium">{customer.joinDate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">آخرین ورود:</span>
                    <span className="font-medium">{customer.lastLogin}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">وضعیت:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : customer.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 'active' ? 'فعال' : 
                       customer.status === 'inactive' ? 'غیرفعال' : 'تعلیق'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-6">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-5 h-5" />
                      ذخیره تغییرات
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5" />
                      ویرایش پروفایل
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* منو */}
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-200">
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'پروفایل', icon: User, active: activeTab === 'profile' },
                  { id: 'orders', label: 'سفارشات', icon: Package, active: activeTab === 'orders' },
                  { id: 'security', label: 'امنیت', icon: Lock, active: activeTab === 'security' },
                  { id: 'activity', label: 'فعالیت‌ها', icon: Bell, active: activeTab === 'activity' },
                  { id: 'wishlist', label: 'علاقه‌مندی‌ها', icon: Heart, active: false },
                  { id: 'addresses', label: 'آدرس‌ها', icon: MapPin, active: false }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                        item.active
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          
          {/* محتوای اصلی */}
          <div className="lg:col-span-3">
            {/* آمار */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">{stats.totalOrders}</div>
                <div className="text-sm opacity-90">کل سفارشات</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">
                  {stats.totalSpent.toLocaleString('fa-IR')}
                </div>
                <div className="text-sm opacity-90">کل خریدها (تومان)</div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">{stats.completedOrders}</div>
                <div className="text-sm opacity-90">سفارشات تکمیل شده</div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">{stats.pendingOrders}</div>
                <div className="text-sm opacity-90">در انتظار</div>
              </div>
            </div>
            
            {/* تب‌ها */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* تب پروفایل */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-600" />
                    اطلاعات شخصی
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* کد ملی */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        کد ملی
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customer.nationalCode}
                          onChange={(e) => handleInputChange('nationalCode', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          dir="ltr"
                        />
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                    </div>
                    
                    {/* شماره تلفن */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        شماره تماس
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          dir="ltr"
                        />
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                    </div>
                    
                    {/* نام */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">نام</label>
                      <input
                        type="text"
                        value={customer.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    
                    {/* نام خانوادگی */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">نام خانوادگی</label>
                      <input
                        type="text"
                        value={customer.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    
                    {/* ایمیل */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        ایمیل
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          dir="ltr"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                    </div>
                    
                    {/* تاریخ تولد */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        تاریخ تولد
                      </label>
                      <input
                        type="text"
                        value={customer.birthDate || ''}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        disabled={!isEditing}
                        placeholder="۱۳۶۵-۰۵-۱۵"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        dir="ltr"
                      />
                    </div>
                    
                    {/* جنسیت */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">جنسیت</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={customer.gender === 'male'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>آقا</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={customer.gender === 'female'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>خانم</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* آدرس */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      آدرس
                    </label>
                    <textarea
                      value={customer.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">شهر</label>
                      <input
                        type="text"
                        value={customer.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">کد پستی</label>
                      <input
                        type="text"
                        value={customer.postalCode || ''}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        disabled={!isEditing}
                        dir="ltr"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  {/* دکمه‌های اقدام */}
                  {isEditing && (
                    <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-3"
                      >
                        <Save className="w-5 h-5" />
                        ذخیره تغییرات
                      </button>
                      
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold flex items-center gap-3"
                      >
                        <XCircle className="w-5 h-5" />
                        انصراف
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* تب سفارشات */}
              {activeTab === 'orders' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Package className="w-6 h-6 text-purple-600" />
                    تاریخچه سفارشات
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-4 px-4 font-bold text-gray-900">شماره سفارش</th>
                          <th className="text-right py-4 px-4 font-bold text-gray-900">تاریخ</th>
                          <th className="text-right py-4 px-4 font-bold text-gray-900">مبلغ</th>
                          <th className="text-right py-4 px-4 font-bold text-gray-900">وضعیت</th>
                          <th className="text-right py-4 px-4 font-bold text-gray-900">اقدامات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const status = getOrderStatus(order.status);
                          return (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="font-bold text-gray-900">{order.id}</div>
                                <div className="text-sm text-gray-500">{order.items} کالا</div>
                              </td>
                              <td className="py-4 px-4">{order.date}</td>
                              <td className="py-4 px-4 font-bold">
                                {order.total.toLocaleString('fa-IR')} تومان
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                                  {status.text}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                                >
                                  جزئیات
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">سفارشی یافت نشد</h3>
                      <p className="text-gray-600 mb-6">هنوز سفارشی ثبت نکرده‌اید</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition"
                      >
                        شروع خرید
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* تب امنیت */}
              {activeTab === 'security' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Lock className="w-6 h-6 text-red-600" />
                    تنظیمات امنیتی
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Shield className="w-8 h-8 text-blue-600" />
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">تغییر رمز عبور</h3>
                            <p className="text-gray-600">برای افزایش امنیت، رمز عبور خود را به‌طور دوره‌ای تغییر دهید</p>
                          </div>
                        </div>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                          تغییر رمز
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Bell className="w-8 h-8 text-green-600" />
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">اعلان‌های امنیتی</h3>
                            <p className="text-gray-600">در صورت ورود از دستگاه جدید یا تغییرات مهم، اعلان دریافت کنید</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-12 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Globe className="w-8 h-8 text-purple-600" />
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">ورود دو مرحله‌ای</h3>
                            <p className="text-gray-600">با فعال‌سازی این قابلیت، امنیت حساب خود را افزایش دهید</p>
                          </div>
                        </div>
                        <button className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium">
                          فعال‌سازی
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <AlertCircle className="w-8 h-8 text-red-600" />
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">جلسات فعال</h3>
                            <p className="text-gray-600">جلسات ورود فعال خود را مدیریت و مشاهده کنید</p>
                          </div>
                        </div>
                        <button className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium">
                          مشاهده جلسات
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* تب فعالیت‌ها */}
              {activeTab === 'activity' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Bell className="w-6 h-6 text-orange-600" />
                    لاگ فعالیت‌ها
                  </h2>
                  
                  <div className="space-y-4">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              log.action.includes('ورود') ? 'bg-blue-100 text-blue-600' :
                              log.action.includes('تغییر') ? 'bg-yellow-100 text-yellow-600' :
                              log.action.includes('سفارش') ? 'bg-green-100 text-green-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {log.action.includes('ورود') ? '🔐' :
                               log.action.includes('تغییر') ? '🔧' :
                               log.action.includes('سفارش') ? '🛒' : '📝'}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{log.action}</h3>
                              <div className="text-sm text-gray-500">{log.timestamp}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {log.device}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>IP: {log.ip}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>موفق</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => {
                        // در حالت واقعی API فراخوانی می‌شود
                        const newLogs = [...activityLogs];
                        newLogs.shift();
                        setActivityLogs(newLogs);
                      }}
                      className="text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center gap-2"
                    >
                      پاک‌سازی لاگ‌های قدیمی
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;