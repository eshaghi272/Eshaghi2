// src/components/products/ErrorState.tsx
import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <Search className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">خطا در بارگذاری محصولات</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            تلاش مجدد
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            بازگشت به خانه
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;