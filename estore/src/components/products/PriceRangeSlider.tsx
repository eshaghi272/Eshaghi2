// src/components/products/PriceRangeSlider.tsx
import React from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ 
  min, 
  max, 
  values, 
  onChange 
}) => {
  const handleChange = (index: number, value: number) => {
    const newValues = [...values] as [number, number];
    newValues[index] = value;
    
    // اطمینان از صحیح بودن محدوده
    if (newValues[0] > newValues[1]) {
      if (index === 0) {
        newValues[1] = newValues[0];
      } else {
        newValues[0] = newValues[1];
      }
    }
    
    onChange(newValues);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">
          {values[0].toLocaleString('fa-IR')} تومان
        </span>
        <span className="text-sm text-gray-600">
          {values[1].toLocaleString('fa-IR')} تومان
        </span>
      </div>
      <div className="relative h-2">
        <div className="absolute h-1 bg-gray-200 rounded-full w-full"></div>
        <div 
          className="absolute h-1 bg-blue-500 rounded-full"
          style={{
            left: `${((values[0] - min) / (max - min)) * 100}%`,
            width: `${((values[1] - values[0]) / (max - min)) * 100}%`
          }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          value={values[0]}
          onChange={(e) => handleChange(0, parseInt(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={values[1]}
          onChange={(e) => handleChange(1, parseInt(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <span>کمترین: {min.toLocaleString('fa-IR')}</span>
        <span>بالاترین: {max.toLocaleString('fa-IR')}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;