// src/components/ui/CartSummary.tsx
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useFormatters } from '../../hooks/useFormatters';

const CartSummary = () => {
  const { totalItems, totalPrice } = useCart();
  const { formatPrice } = useFormatters();

  return (
    <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
      <ShoppingCart className="w-5 h-5 text-gray-700" />
      <div className="text-sm">
        <span className="font-semibold">{totalItems}</span> کالا
      </div>
      <div className="h-6 w-px bg-gray-300"></div>
      <div className="text-sm font-semibold">
        {formatPrice(totalPrice)}
      </div>
    </div>
  );
};

export default CartSummary;
