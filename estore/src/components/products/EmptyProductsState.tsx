// src/components/products/EmptyProductsState.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyProductsState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">محصولی یافت نشد</h1>
        <p className="text-gray-600 mb-6">
          در حال حاضر هیچ محصولی در فروشگاه موجود نیست.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
};

export default EmptyProductsState;