// src/components/products/FilterSidebar.tsx
import React from 'react';
import { Sliders, X } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';
import FilterCheckbox from './FilterCheckbox';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Array<{ name: string; count: number }>;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  priceRangeData: { min: number; max: number };
  showInStockOnly: boolean;
  onStockFilterChange: (checked: boolean) => void;
  onResetFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  categories,
  priceRange,
  onPriceRangeChange,
  priceRangeData,
  showInStockOnly,
  onStockFilterChange,
  onResetFilters
}) => (
  <div className={`lg:w-1/4 ${isOpen ? 'block' : 'hidden lg:block'}`}>
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Sliders className="w-5 h-5 ml-2" />
          فیلترها
        </h2>
        <button
          onClick={onResetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <X className="w-4 h-4 ml-1" />
          پاک کردن همه
        </button>
      </div>

      {/* فیلتر دسته‌بندی */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />

      {/* فیلتر محدوده قیمت */}
      <PriceFilter 
        priceRange={priceRange}
        onPriceRangeChange={onPriceRangeChange}
        priceRangeData={priceRangeData}
      />

      {/* فیلتر وضعیت موجودی */}
      <StockFilter 
        showInStockOnly={showInStockOnly}
        onStockFilterChange={onStockFilterChange}
      />

      {/* دکمه بستن در موبایل */}
      <button
        onClick={onClose}
        className="lg:hidden w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
      >
        اعمال فیلترها
      </button>
    </div>
  </div>
);

const CategoryFilter: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Array<{ name: string; count: number }>;
}> = ({ selectedCategory, onCategoryChange, categories }) => (
  <div className="mb-8">
    <h3 className="font-semibold mb-4 text-gray-700">دسته‌بندی</h3>
    <div className="space-y-1 max-h-60 overflow-y-auto">
      {categories.map(({ name, count }) => (
        <button
          key={name}
          onClick={() => onCategoryChange(name)}
          className={`w-full text-right py-2 px-3 rounded-lg transition ${
            selectedCategory === name
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{name}</span>
            <span className="text-sm text-gray-500">{count}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const PriceFilter: React.FC<{
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  priceRangeData: { min: number; max: number };
}> = ({ priceRange, onPriceRangeChange, priceRangeData }) => (
  <div className="mb-8">
    <h3 className="font-semibold mb-4 text-gray-700">محدوده قیمت</h3>
    <PriceRangeSlider
      min={priceRangeData.min}
      max={priceRangeData.max}
      values={priceRange}
      onChange={onPriceRangeChange}
    />
  </div>
);

const StockFilter: React.FC<{
  showInStockOnly: boolean;
  onStockFilterChange: (checked: boolean) => void;
}> = ({ showInStockOnly, onStockFilterChange }) => (
  <div className="mb-8">
    <h3 className="font-semibold mb-4 text-gray-700">وضعیت موجودی</h3>
    <FilterCheckbox
      label="فقط محصولات موجود"
      checked={showInStockOnly}
      onChange={onStockFilterChange}
    />
  </div>
);

export default FilterSidebar;