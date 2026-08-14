// src/components/product/ActionButtons.tsx
import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';

interface ActionButtonsProps {
  onAddToCart: () => void;
  onQuickBuy: () => void;
  stock: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddToCart,
  onQuickBuy,
  stock
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AddToCartButton 
        onClick={onAddToCart}
        disabled={stock === 0}
      />
      <QuickBuyButton 
        onClick={onQuickBuy}
        disabled={stock === 0}
      />
    </div>
  );
};

const AddToCartButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center text-lg font-bold"
  >
    <ShoppingCart className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
    افزودن به سبد خرید
  </button>
);

const QuickBuyButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="group bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center text-lg font-bold"
  >
    <Package className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
    خرید سریع
  </button>
);

export default ActionButtons;