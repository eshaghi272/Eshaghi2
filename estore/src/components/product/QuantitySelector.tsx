// src/components/product/QuantitySelector.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  price: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  stock,
  price,
  onQuantityChange
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-gray-700 font-bold mb-1">تعداد</div>
          <div className="text-sm text-gray-500">موجودی: {stock} عدد</div>
        </div>
        <QuantityControls 
          quantity={quantity}
          stock={stock}
          onDecrease={() => onQuantityChange(Math.max(1, quantity - 1))}
          onIncrease={() => onQuantityChange(Math.min(stock, quantity + 1))}
        />
      </div>
      
      {/* قیمت کل */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <TotalPrice 
          quantity={quantity}
          price={price}
          formatPrice={formatPrice}
        />
        <StockIndicator stock={stock} />
      </div>
    </div>
  );
};

const QuantityControls: React.FC<{
  quantity: number;
  stock: number;
  onDecrease: () => void;
  onIncrease: () => void;
}> = ({ quantity, stock, onDecrease, onIncrease }) => (
  <div className="flex items-center bg-gray-100 rounded-xl">
    <button 
      onClick={onDecrease}
      disabled={quantity <= 1}
      className="px-5 py-3 text-xl text-gray-700 hover:bg-gray-200 disabled:opacity-30 transition rounded-r-xl"
    >
      -
    </button>
    <span className="px-6 py-3 text-xl font-bold min-w-[80px] text-center border-x border-gray-300">
      {quantity}
    </span>
    <button 
      onClick={onIncrease}
      disabled={quantity >= stock}
      className="px-5 py-3 text-xl text-gray-700 hover:bg-gray-200 disabled:opacity-30 transition rounded-l-xl"
    >
      +
    </button>
  </div>
);

const TotalPrice: React.FC<{
  quantity: number;
  price: number;
  formatPrice: (price: number) => string;
}> = ({ quantity, price, formatPrice }) => (
  <div>
    <div className="text-gray-600 text-sm">قیمت کل</div>
    <div className="text-2xl font-bold text-gray-900">
      {formatPrice(price * quantity)}
    </div>
  </div>
);

const StockIndicator: React.FC<{ stock: number }> = ({ stock }) => (
  <div className="text-green-600 text-sm flex items-center">
    <Check className="w-4 h-4 ml-1" />
    {stock > 10 ? 'موجود' : 'موجودی محدود'}
  </div>
);

export default QuantitySelector;