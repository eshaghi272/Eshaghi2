// src/components/product/StoreBenefits.tsx
import React from 'react';
import { Truck, Shield, RefreshCw, Clock } from 'lucide-react';

const StoreBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'ارسال سریع',
      desc: 'تحویل در تهران ۲۴ ساعت',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Shield,
      title: 'گارانتی',
      desc: '۱۸ ماه ضمانت',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: RefreshCw,
      title: 'بازگشت',
      desc: '۷ روز مهلت بازگشت',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Clock,
      title: 'پشتیبانی',
      desc: '۲۴ ساعته',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {benefits.map((benefit, index) => (
        <BenefitCard 
          key={index}
          icon={benefit.icon}
          title={benefit.title}
          description={benefit.desc}
          color={benefit.color}
          bgColor={benefit.bgColor}
        />
      ))}
    </div>
  );
};

const BenefitCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}> = ({ icon: Icon, title, description, color, bgColor }) => (
  <div 
    className={`${bgColor} p-4 rounded-xl text-center border ${color.replace('text', 'border')}-200`}
  >
    <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
    <div className="font-bold text-gray-800 text-sm">{title}</div>
    <div className="text-gray-600 text-xs">{description}</div>
  </div>
);

export default StoreBenefits;