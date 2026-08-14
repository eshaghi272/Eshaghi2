// src/components/common/Loaders/PageLoader.tsx
import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

// کامپوننت اصلی PageLoader
const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" color="primary" />
        <p className="mt-4 text-gray-700 font-medium">در حال بارگذاری...</p>
      </div>
    </div>
  );
};

// سایر Loaderها
export const ProductDetailLoader: React.FC = () => {
  // ... کد قبلی بدون تغییر
};

export const ProductGridLoader: React.FC<{ count?: number }> = ({ count = 12 }) => {
  // ... کد قبلی بدون تغییر
};

export const ProductListLoader: React.FC<{ count?: number }> = ({ count = 8 }) => {
  // ... کد قبلی بدون تغییر
};

export const CartLoader: React.FC = () => {
  // ... کد قبلی بدون تغییر
};

export default PageLoader;