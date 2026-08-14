// src/components/cart/BenefitsSection.tsx
import React from 'react';
import { Truck, Shield, Package } from 'lucide-react';

const BenefitsSection: React.FC = () => (
  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
    <h3 className="font-bold text-2xl mb-8 text-center">مزایای خرید از ما</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BenefitCard 
        icon={Truck}
        title="ارسال رایگان"
        description="برای خریدهای بالای ۲ میلیون"
      />
      <BenefitCard 
        icon={Package}
        title="بسته‌بندی ویژه"
        description="ضد ضربه و ضد آب"
      />
      <BenefitCard 
        icon={Shield}
        title="گارانتی بازگشت"
        description="۷ روز مهلت تست محصول"
      />
    </div>
  </div>
);

const BenefitCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-white/20 rounded-xl">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <div className="font-bold text-lg">{title}</div>
        <div className="text-sm opacity-90">{description}</div>
      </div>
    </div>
  </div>
);

export default BenefitsSection;