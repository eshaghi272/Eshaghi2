// src/components/cart/EmptyCartState.tsx
import React from 'react';
import { ShoppingBag, ArrowLeft, Truck, Shield, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyCartState: React.FC = () => (
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
              <BenefitCard 
                icon={Truck}
                title="ارسال سریع و رایگان"
                description="ارسال رایگان برای خریدهای بالای ۲ میلیون تومان"
              />
              <BenefitCard 
                icon={Shield}
                title="گارانتی ۱۸ ماهه"
                description="گارانتی اصل‌بودن کالا و بازگشت ۷ روزه"
              />
              <BenefitCard 
                icon={Package}
                title="پشتیبانی ۲۴ ساعته"
                description="پشتیبانی تلفنی و آنلاین در تمام ساعات"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BenefitCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <Icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default EmptyCartState;