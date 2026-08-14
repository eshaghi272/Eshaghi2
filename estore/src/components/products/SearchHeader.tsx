// src/components/products/SearchHeader.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface SearchHeaderProps {
  title: string;
  subtitle: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  quickSearches: string[];
  onQuickSearch: (query: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  quickSearches,
  onQuickSearch
}) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
      <p className="text-blue-100 text-lg">{subtitle}</p>
    </div>
    
    <div className="container mx-auto px-4 -mt-4 pb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="چه محصولی را جستجو می‌کنید؟ مثلاً 'گوشی سامسونگ'..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
          />
        </div>
        
        {/* جستجوی سریع */}
        <QuickSearchTags 
          quickSearches={quickSearches}
          onQuickSearch={onQuickSearch}
        />
      </div>
    </div>
  </div>
);

const QuickSearchTags: React.FC<{
  quickSearches: string[];
  onQuickSearch: (query: string) => void;
}> = ({ quickSearches, onQuickSearch }) => (
  <div className="mt-4 flex flex-wrap gap-2">
    <span className="text-gray-500 text-sm ml-2">پیشنهادات:</span>
    {quickSearches.map((query) => (
      <button
        key={query}
        onClick={() => onQuickSearch(query)}
        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition"
      >
        {query}
      </button>
    ))}
  </div>
);

export default SearchHeader;