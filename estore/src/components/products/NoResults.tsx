// src/components/products/NoResults.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface NoResultsProps {
  onResetFilters: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ onResetFilters }) => (
  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-bold mb-2">محصولی یافت نشد</h3>
    <p className="text-gray-600 mb-6">
      متأسفانه هیچ محصولی با مشخصات جستجوی شما مطابقت ندارد.
    </p>
    <button
      onClick={onResetFilters}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
    >
      پاک کردن همه فیلترها
    </button>
  </div>
);

export default NoResults;