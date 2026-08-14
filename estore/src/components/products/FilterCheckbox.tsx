// src/components/products/FilterCheckbox.tsx
import React from 'react';

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ 
  label, 
  checked, 
  onChange, 
  count 
}) => (
  <label className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded">
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span className="mr-2">{label}</span>
    </div>
    {count !== undefined && (
      <span className="text-gray-500 text-sm">{count}</span>
    )}
  </label>
);

export default FilterCheckbox;