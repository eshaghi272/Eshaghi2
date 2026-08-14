// src/pages/OrderHistoryPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Star,
  MessageSquare,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Package,
  Tag,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

// TypeScript Interfaces
interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

interface OrderStatistics {
  summary: {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    min_order_value: number;
    max_order_value: number;
  };
  byStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  dailyStats: Array<{
    date: string;
    order_count: number;
    daily_revenue: number;
  }>;
  period: string;
}

// Status Badge Component
const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'در انتظار پرداخت',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: <Clock className="w-4 h-4" />
        };
      case 'processing':
        return {
          label: 'در حال پردازش',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <ShoppingBag className="w-4 h-4" />
        };
      case 'shipped':
        return {
          label: 'ارسال شده',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200',
          icon: <Truck className="w-4 h-4" />
        };
      case 'delivered':
        return {
          label: 'تحویل داده شده',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'cancelled':
        return {
          label: 'لغو شده',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <XCircle className="w-4 h-4" />
        };
      default:
        return {
          label: 'نامشخص',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: null
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Order Card for Mobile View
const OrderCard: React.FC<{ 
  order: Order; 
  onViewDetails: (order: Order) => void;
}> = ({ order, onViewDetails }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'yyyy/MM/dd - HH:mm', { locale: faIR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 mb-4 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              سفارش #{order.order_number}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(order.created_at)}</span>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">تعداد کالا</div>
            <div className="text-base font-medium">{order.items.length} کالا</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">مبلغ کل</div>
            <div className="text-base font-bold text-blue-600">{formatPrice(order.final_amount)}</div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-blue-600 hover:text-blue-800 font-medium border border-blue-200 hover:border-blue-300 rounded-xl transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              بستن جزئیات
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              مشاهده جزئیات
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3">محصولات سفارش:</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-medium text-gray-900">{item.product_name}</div>
                    <div className="text-sm text-gray-500">{item.quantity} عدد</div>
                  </div>
                  <div className="text-left font-medium">{formatPrice(item.total_price)}</div>
                </div>
              ))}
            </div>
            
            {order.notes && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{order.notes}</span>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => onViewDetails(order)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" />
                مشاهده کامل
              </button>
              {order.status === 'delivered' && (
                <button className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 rounded-xl transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  ثبت نظر
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Order Details Modal
const OrderDetailsModal: React.FC<{
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}> = ({ isOpen, order, onClose }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEEE، d MMMM yyyy - HH:mm', { locale: faIR });
    } catch {
      return dateString;
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    جزئیات سفارش #{order.order_number}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Products List */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">محصولات سفارش</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div 
                        key={item.id}
                        className={`flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 ${
                          index < order.items.length - 1 ? 'mb-3' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>شناسه محصول: #{item.product_id}</span>
                              <span>تعداد: {item.quantity} عدد</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-gray-900">{formatPrice(item.total_price)}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formatPrice(item.unit_price)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Notes */}
                {order.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      یادداشت سفارش
                    </h3>
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Sidebar - Summary and Customer Info */}
              <div className="space-y-6">
                {/* Price Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">صورتحساب</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">مجموع کالاها</span>
                      <span className="font-medium">{formatPrice(order.total_amount)}</span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>تخفیف</span>
                        <span className="font-bold">-{formatPrice(order.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="text-lg font-bold text-gray-900">مبلغ نهایی</span>
                      <span className="text-xl font-bold text-blue-600">{formatPrice(order.final_amount)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">اطلاعات مشتری</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">نام مشتری</div>
                      </div>
                    </div>
                    
                    {order.customer_email && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{order.customer_email}</div>
                          <div className="text-sm text-gray-500">ایمیل</div>
                        </div>
                      </div>
                    )}
                    
                    {order.customer_phone && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{order.customer_phone}</div>
                          <div className="text-sm text-gray-500">تلفن</div>
                        </div>
                      </div>
                    )}
                    
                    {order.customer_address && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg mt-1">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{order.customer_address}</div>
                          <div className="text-sm text-gray-500">آدرس</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Payment Info */}
                {order.payment_method && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">اطلاعات پرداخت</h3>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CreditCard className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{order.payment_method}</div>
                        <div className="text-sm text-gray-500">روش پرداخت</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                چاپ فاکتور
              </button>
              {order.status === 'delivered' && (
                <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  ثبت نظر برای محصولات
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics Cards
const StatisticsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}> = ({ title, value, icon, color, change }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            change.startsWith('+') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 mt-1">{title}</div>
      </div>
    </div>
  );
};

// Main Component
const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'statistics'>('orders');

  // Mock data - در پروژه واقعی از API استفاده کنید
  const mockOrders: Order[] = [
    {
      id: 1,
      order_number: 'ORD-2401-8567',
      customer_name: 'علی محمدی',
      customer_email: 'ali@example.com',
      customer_phone: '09123456789',
      customer_address: 'تهران، خیابان ولیعصر',
      total_amount: 450000,
      discount_amount: 50000,
      final_amount: 400000,
      status: 'delivered',
      payment_method: 'کارت به کارت',
      notes: 'لطفا قبل از ساعت ۱۰ صبح ارسال شود',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-16T14:20:00Z',
      items: [
        {
          id: 1,
          product_id: 101,
          product_name: 'لپ تاپ ایسوس',
          quantity: 1,
          unit_price: 400000,
          total_price: 400000,
          created_at: '2024-01-15T10:30:00Z'
        }
      ]
    },
    {
      id: 2,
      order_number: 'ORD-2401-8568',
      customer_name: 'مریم کریمی',
      customer_email: 'maryam@example.com',
      customer_phone: '09129876543',
      customer_address: 'اصفهان، خیابان چهارباغ',
      total_amount: 280000,
      discount_amount: 30000,
      final_amount: 250000,
      status: 'shipped',
      payment_method: 'آنلاین',
      notes: null,
      created_at: '2024-01-14T15:45:00Z',
      updated_at: '2024-01-15T09:15:00Z',
      items: [
        {
          id: 2,
          product_id: 102,
          product_name: 'هدفون بلوتوث',
          quantity: 2,
          unit_price: 125000,
          total_price: 250000,
          created_at: '2024-01-14T15:45:00Z'
        }
      ]
    }
  ];

  const mockStatistics: OrderStatistics = {
    summary: {
      total_orders: 45,
      total_revenue: 12500000,
      average_order_value: 277777,
      min_order_value: 50000,
      max_order_value: 850000
    },
    byStatus: [
      { status: 'delivered', count: 30, revenue: 9000000 },
      { status: 'shipped', count: 8, revenue: 2000000 },
      { status: 'processing', count: 5, revenue: 1000000 },
      { status: 'pending', count: 2, revenue: 500000 }
    ],
    dailyStats: [
      { date: '2024-01-15', order_count: 5, daily_revenue: 1400000 },
      { date: '2024-01-14', order_count: 7, daily_revenue: 2100000 },
      { date: '2024-01-13', order_count: 4, daily_revenue: 1200000 }
    ],
    period: 'month'
  };

  useEffect(() => {
    // شبیه‌سازی دریافت داده از API
    setTimeout(() => {
      setOrders(mockOrders);
      setStatistics(mockStatistics);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'yyyy/MM/dd', { locale: faIR });
    } catch {
      return dateString;
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(searchLower) ||
        order.customer_name.toLowerCase().includes(searchLower) ||
        order.customer_phone?.toLowerCase().includes(searchLower) ||
        order.customer_email?.toLowerCase().includes(searchLower)
      );
    }
    if (statusFilter !== 'all') {
      return order.status === statusFilter;
    }
    return true;
  });

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const isMobile = window.innerWidth < 768;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">در حال بارگذاری سفارشات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">تاریخچه سفارشات</h1>
              <p className="text-blue-100 mt-2">مشاهده و مدیریت تمام سفارش‌های شما</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="بروزرسانی"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="px-4 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-xl transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                خروجی اکسل
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="flex space-x-1 space-x-reverse bg-white rounded-2xl shadow-sm p-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            سفارشات
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'statistics'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            آمار و گزارشات
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'orders' ? (
          <>
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="جستجو در سفارشات (شماره سفارش، نام مشتری، تلفن، ایمیل)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="pending">در انتظار پرداخت</option>
                    <option value="processing">در حال پردازش</option>
                    <option value="shipped">ارسال شده</option>
                    <option value="delivered">تحویل داده شده</option>
                    <option value="cancelled">لغو شده</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="all">همه تاریخ‌ها</option>
                    <option value="today">امروز</option>
                    <option value="week">هفته جاری</option>
                    <option value="month">ماه جاری</option>
                    <option value="year">امسال</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      جستجو: {searchTerm}
                      <button onClick={() => setSearchTerm('')} className="text-blue-600 hover:text-blue-800">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      وضعیت: {statusFilter === 'pending' ? 'در انتظار پرداخت' : 
                              statusFilter === 'processing' ? 'در حال پردازش' :
                              statusFilter === 'shipped' ? 'ارسال شده' :
                              statusFilter === 'delivered' ? 'تحویل داده شده' : 'لغو شده'}
                      <button onClick={() => setStatusFilter('all')} className="text-green-600 hover:text-green-800">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {dateFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      تاریخ: {dateFilter === 'today' ? 'امروز' :
                              dateFilter === 'week' ? 'هفته جاری' :
                              dateFilter === 'month' ? 'ماه جاری' : 'امسال'}
                      <button onClick={() => setDateFilter('all')} className="text-purple-600 hover:text-purple-800">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateFilter('all');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                  >
                    <FilterAltOff className="w-4 h-4" />
                    حذف همه فیلترها
                  </button>
                </div>
              )}
            </div>

            {/* Orders Count */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  سفارش‌های شما
                  <span className="text-blue-600 mr-2"> ({filteredOrders.length})</span>
                </h2>
                <div className="text-sm text-gray-500">
                  نمایش {Math.min((page - 1) * itemsPerPage + 1, filteredOrders.length)} تا{' '}
                  {Math.min(page * itemsPerPage, filteredOrders.length)} از {filteredOrders.length} سفارش
                </div>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">سفارشی یافت نشد</h3>
                <p className="text-gray-600 mb-6">با تغییر فیلترها دوباره امتحان کنید</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                >
                  حذف فیلترها
                </button>
              </div>
            ) : isMobile ? (
              // Mobile View - Cards
              <div>
                {paginatedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              // Desktop View - Table
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-4 px-6 text-right font-semibold text-gray-900">شماره سفارش</th>
                        <th className="py-4 px-6 text-right font-semibold text-gray-900">تاریخ</th>
                        <th className="py-4 px-6 text-right font-semibold text-gray-900">مشتری</th>
                        <th className="py-4 px-6 text-right font-semibold text-gray-900">محصولات</th>
                        <th className="py-4 px-6 text-right font-semibold text-gray-900">مبلغ</th>
                        <th className="py-4 px-6 text-right font-semibold text-gray-900">وضعیت</th>
                        <th className="py-4 px-6 text-right font-semibold text-gray-900">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-blue-600">{order.order_number}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm text-gray-900">{formatDate(order.created_at)}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <div className="font-medium text-gray-900">{order.customer_name}</div>
                              {order.customer_phone && (
                                <div className="text-sm text-gray-500">{order.customer_phone}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {order.items.length} کالا
                              </span>
                              {order.items.slice(0, 2).map((item) => (
                                <span key={item.id} className="text-sm text-gray-600">
                                  {item.product_name}
                                  {item.quantity > 1 && ` (${item.quantity})`}
                                </span>
                              ))}
                              {order.items.length > 2 && (
                                <span className="text-sm text-gray-400">
                                  +{order.items.length - 2} مورد دیگر
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-900">{formatPrice(order.final_amount)}</div>
                            {order.discount_amount > 0 && (
                              <div className="text-sm text-green-600">
                                تخفیف: {formatPrice(order.discount_amount)}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(order)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                title="مشاهده جزئیات"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                title="چاپ فاکتور"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              {order.status === 'delivered' && (
                                <button
                                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                  title="ثبت نظر"
                                >
                                  <MessageSquare className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  قبلی
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }, (_, i) => i + 1)
                    .slice(Math.max(0, page - 3), Math.min(Math.ceil(filteredOrders.length / itemsPerPage), page + 2))
                    .map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === Math.ceil(filteredOrders.length / itemsPerPage)}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  بعدی
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Statistics Tab */
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatisticsCard
                title="کل سفارشات"
                value={statistics?.summary.total_orders || 0}
                icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
                color="bg-blue-100"
                change="+12%"
              />
              <StatisticsCard
                title="درآمد کل"
                value={formatPrice(statistics?.summary.total_revenue || 0)}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                color="bg-green-100"
                change="+18%"
              />
              <StatisticsCard
                title="میانگین سفارش"
                value={formatPrice(statistics?.summary.average_order_value || 0)}
                icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
                color="bg-purple-100"
                change="+5%"
              />
              <StatisticsCard
                title="بیشترین سفارش"
                value={formatPrice(statistics?.summary.max_order_value || 0)}
                icon={<Star className="w-6 h-6 text-yellow-600" />}
                color="bg-yellow-100"
              />
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">توزیع سفارشات بر اساس وضعیت</h3>
              <div className="space-y-4">
                {statistics?.byStatus.map((stat) => (
                  <div key={stat.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={stat.status as Order['status']} />
                      <span className="text-gray-600">{stat.count} سفارش</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{formatPrice(stat.revenue)}</div>
                      <div className="text-sm text-gray-500">
                        {Math.round((stat.revenue / (statistics?.summary.total_revenue || 1)) * 100)}% از کل درآمد
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">آمار روزانه ۷ روز گذشته</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-right font-semibold text-gray-900">تاریخ</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-900">تعداد سفارش</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-900">درآمد روز</th>
                      <th className="py-3 px-4 text-right font-semibold text-gray-900">میانگین هر سفارش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics?.dailyStats.map((daily) => (
                      <tr key={daily.date} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{formatDate(daily.date)}</td>
                        <td className="py-3 px-4 font-medium">{daily.order_count}</td>
                        <td className="py-3 px-4 font-bold text-green-600">
                          {formatPrice(daily.daily_revenue)}
                        </td>
                        <td className="py-3 px-4">
                          {formatPrice(Math.round(daily.daily_revenue / daily.order_count))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default OrderHistoryPage;