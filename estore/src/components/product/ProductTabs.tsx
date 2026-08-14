// src/components/product/ProductTabs.tsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import type { Product } from '../../types/index';

interface ProductTabsProps {
  product: Product;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <TabContent 
        activeTab={activeTab}
        product={product}
      />
    </div>
  );
};

const TabHeader: React.FC<{
  activeTab: string;
  onTabChange: (tab: 'details' | 'specs' | 'reviews') => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'details', label: 'توضیحات کامل', icon: '📝' },
    { key: 'specs', label: 'مشخصات فنی', icon: '⚙️' },
    { key: 'reviews', label: 'نظرات کاربران', icon: '💬' }
  ];

  return (
    <div className="border-b">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key as any)}
            className={`flex-1 min-w-[150px] px-6 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.key 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const TabContent: React.FC<{
  activeTab: string;
  product: Product;
}> = ({ activeTab, product }) => {
  switch (activeTab) {
    case 'details':
      return <DetailsTab product={product} />;
    case 'specs':
      return <SpecsTab specifications={product.specifications} />;
    case 'reviews':
      return <ReviewsTab product={product} />;
    default:
      return null;
  }
};

const DetailsTab: React.FC<{ product: Product }> = ({ product }) => (
  <div className="p-8 space-y-6">
    <h3 className="text-2xl font-bold text-gray-900">درباره محصول</h3>
    <div className="prose max-w-none text-gray-700 leading-relaxed">
      <p className="text-lg">{product.description}</p>
      <ul className="space-y-3 mt-6">
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>کیفیت ساخت بالا و استانداردهای بین‌المللی</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>طراحی مدرن و کاربرپسند</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>گارانتی و خدمات پس از فروش کامل</span>
        </li>
      </ul>
    </div>
  </div>
);

const SpecsTab: React.FC<{ specifications?: Record<string, any> }> = ({ specifications }) => (
  <div className="p-8 space-y-6">
    <h3 className="text-2xl font-bold text-gray-900">مشخصات فنی</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {specifications && Object.entries(specifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-gray-600 font-medium">{key}</span>
          <span className="text-gray-900 font-bold">
            {Array.isArray(value) ? value.join('، ') : value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ReviewsTab: React.FC<{ product: Product }> = ({ product }) => (
  <div className="p-8 space-y-8">
    <ReviewSummary 
      rating={product.rating}
      reviewCount={product.reviewCount}
    />
    
    {/* نمونه نظرات */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SampleReview 
        name="علی محمدی"
        time="۲ روز پیش"
        rating={5}
        comment="کیفیت فوق‌العاده‌ای داره. واقعاً راضیم"
        color="from-blue-500 to-indigo-500"
      />
      <SampleReview 
        name="فاطمه کریمی"
        time="۱ هفته پیش"
        rating={4}
        comment="بسته‌بندی خیلی خوب بود"
        color="from-green-500 to-emerald-500"
      />
    </div>
  </div>
);

const ReviewSummary: React.FC<{
  rating: number;
  reviewCount: number;
}> = ({ rating, reviewCount }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
    <div className="text-center md:text-right">
      <div className="text-5xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
        {rating}
      </div>
      <div className="flex justify-center md:justify-end mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <div className="text-gray-600">بر اساس {reviewCount} نظر</div>
    </div>
    
    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition">
      ثبت نظر جدید
    </button>
  </div>
);

const SampleReview: React.FC<{
  name: string;
  time: string;
  rating: number;
  comment: string;
  color: string;
}> = ({ name, time, rating, comment, color }) => (
  <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-full`}></div>
      <div>
        <div className="font-bold">{name}</div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
    <div className="flex mb-3">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
    <p className="text-gray-700">{comment}</p>
  </div>
);

export default ProductTabs;