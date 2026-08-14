// src/components/cart/CartItemCard.tsx
import React, { useCallback, useState } from 'react';
import { Trash2, Plus, Minus, AlertTriangle, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/index';

interface CartItemCardProps {
  item: { product: Product; quantity: number };
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  formatPrice: (price: number) => string;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  formatPrice 
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      alert(`موجودی محصول ${item.product.name} تنها ${item.product.stock} عدد است`);
      return;
    }
    setQuantity(newQuantity);
    onUpdateQuantity(item.product.id, newQuantity);
  }, [item, onUpdateQuantity]);

  const handleRemove = useCallback(async () => {
    if (!window.confirm(`آیا از حذف ${item.product.name} از سبد خرید مطمئن هستید؟`)) {
      return;
    }
    
    setIsRemoving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onRemove(item.product.id);
    } finally {
      setIsRemoving(false);
    }
  }, [item, onRemove]);

  const totalItemPrice = item.product.price * item.quantity;
  const hasDiscount = item.product.originalPrice && item.product.originalPrice > item.product.price;
  const discountAmount = hasDiscount ? 
    (item.product.originalPrice! - item.product.price) * item.quantity : 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden ${
      isRemoving ? 'opacity-50' : ''
    }`}>
      <div className="flex flex-col sm:flex-row p-4">
        {/* تصویر محصول */}
        <Link 
          to={`/products/${item.product.id}`}
          className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 self-center sm:self-start"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={item.product.imageUrl} 
              alt={item.product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {hasDiscount && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                {Math.round((item.product.originalPrice! - item.product.price) / item.product.originalPrice! * 100)}% تخفیف
              </div>
            )}
          </div>
        </Link>
        
        {/* اطلاعات محصول */}
        <div className="flex-grow">
          <ProductHeader 
            product={item.product}
            onRemove={handleRemove}
            isRemoving={isRemoving}
          />
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.product.description}
          </p>
          
          <PriceSection 
            totalItemPrice={totalItemPrice}
            quantity={quantity}
            product={item.product}
            hasDiscount={hasDiscount}
            discountAmount={discountAmount}
            formatPrice={formatPrice}
          />
          
          <QuantityAndStock 
            quantity={quantity}
            stock={item.product.stock}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </div>
    </div>
  );
};

// زیرکامپوننت هدر محصول
const ProductHeader: React.FC<{
  product: Product;
  onRemove: () => void;
  isRemoving: boolean;
}> = ({ product, onRemove, isRemoving }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
    <div className="flex-grow">
      <Link 
        to={`/products/${product.id}`}
        className="hover:text-blue-600 transition-colors inline-block"
      >
        <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
      </Link>
      <div className="flex items-center gap-2 mt-1">
        <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
          {product.category}
        </span>
        {product.is_new && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            جدید
          </span>
        )}
      </div>
    </div>
    
    <button 
      onClick={onRemove}
      disabled={isRemoving}
      className="self-end sm:self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      aria-label="حذف محصول"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  </div>
);

// زیرکامپوننت بخش قیمت
const PriceSection: React.FC<{
  totalItemPrice: number;
  quantity: number;
  product: Product;
  hasDiscount: boolean;
  discountAmount: number;
  formatPrice: (price: number) => string;
}> = ({ totalItemPrice, quantity, product, hasDiscount, discountAmount, formatPrice }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-gray-900">
          {formatPrice(totalItemPrice)}
        </span>
        {quantity > 1 && (
          <span className="text-sm text-gray-500">
            (هر عدد: {formatPrice(product.price)})
          </span>
        )}
      </div>
      
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(product.originalPrice! * quantity)}
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            {formatPrice(discountAmount)} صرفه‌جویی
          </span>
        </div>
      )}
    </div>
  </div>
);

// زیرکامپوننت کنترل تعداد و وضعیت موجودی
const QuantityAndStock: React.FC<{
  quantity: number;
  stock: number;
  onQuantityChange: (newQuantity: number) => void;
}> = ({ quantity, stock, onQuantityChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t">
    <div className="flex items-center justify-between sm:justify-start">
      <div className="flex items-center space-x-1">
        <button 
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="کاهش تعداد"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className="w-16 h-10 flex items-center justify-center border border-gray-300 rounded-lg mx-2 bg-gray-50">
          <span className="font-medium text-lg">{quantity}</span>
        </div>
        
        <button 
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={quantity >= stock}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="افزایش تعداد"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <StockStatus stock={stock} />
  </div>
);

// کامپوننت وضعیت موجودی
const StockStatus: React.FC<{ stock: number }> = ({ stock }) => {
  const getStatusConfig = () => {
    if (stock > 10) {
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: Check,
        message: 'موجود در انبار'
      };
    } else if (stock > 0) {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        icon: AlertTriangle,
        message: `تنها ${stock} عدد باقی‌مانده`
      };
    } else {
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: X,
        message: 'موجود نیست'
      };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`text-sm font-medium px-3 py-2 rounded-lg ${config.bg} ${config.text}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span>{config.message}</span>
      </div>
    </div>
  );
};

export default CartItemCard;