// src/components/product/ErrorState.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center max-w-md mx-4 p-8 bg-white rounded-2xl shadow-lg">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">محصول یافت نشد</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          متأسفانه محصول مورد نظر شما وجود ندارد یا حذف شده است.
          لطفاً محصول دیگری را انتخاب کنید.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-medium shadow-md"
          >
            مشاهده همه محصولات
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            بازگشت
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;