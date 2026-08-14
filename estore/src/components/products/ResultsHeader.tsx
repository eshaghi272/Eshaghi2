// src/components/products/ResultsHeader.tsx
import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface ResultsHeaderProps {
  filteredCount: number;
  totalCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onToggleFilters: () => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  filteredCount,
  totalCount,
  sortBy,
  onSortChange,
  onToggleFilters
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold mb-1">نتایج جستجو</h2>
        <p className="text-gray-600">
          <span className="font-medium">{filteredCount}</span> محصول از{' '}
          <span className="font-medium">{totalCount}</span> محصول یافت شد
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* دکمه نمایش/مخفی کردن فیلترها در موبایل */}
        <button
          onClick={onToggleFilters}
          className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg"
        >
          <Filter className="w-4 h-4 ml-2" />
          فیلترها
        </button>
        
        {/* مرتب‌سازی */}
        <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />
      </div>
    </div>
  </div>
);

const SortDropdown: React.FC<{
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}> = ({ sortBy, onSortChange }) => (
  <div className="flex items-center">
    <span className="text-gray-600 ml-2">مرتب‌سازی:</span>
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className="bg-transparent border-none focus:outline-none font-medium"
    >
      <option value="default">پیش‌فرض</option>
      <option value="price_asc">ارزان‌ترین</option>
      <option value="price_desc">گران‌ترین</option>
      <option value="rating">بالاترین امتیاز</option>
    </select>
    <ChevronDown className="w-4 h-4 text-gray-500" />
  </div>
);

export default ResultsHeader;