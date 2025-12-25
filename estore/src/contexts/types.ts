// src/contexts/types.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// این خط حیاتی است - حتماً export شده باشد:
export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}