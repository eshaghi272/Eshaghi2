// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  discount?: number;
  category?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // محاسبه تعداد کل آیتم‌ها
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // محاسبه قیمت کل با در نظر گرفتن تخفیف
  const totalPrice = items.reduce((total, item) => {
    const discount = item.product.discount || 0;
    const discountedPrice = item.product.price * (1 - discount / 100);
    return total + (discountedPrice * item.quantity);
  }, 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // اگر محصول موجود است، مقدار آن را افزایش بده
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        // بررسی موجودی انبار
        if (newQuantity > product.stock) {
          alert(`موجودی این محصول فقط ${product.stock} عدد است`);
          return prevItems;
        }
        
        updatedItems[existingItemIndex].quantity = newQuantity;
        return updatedItems;
      }
      
      // اگر محصول جدید است، آن را اضافه کن
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.product.id === productId) {
          // بررسی موجودی انبار
          if (quantity > item.product.stock) {
            alert(`موجودی این محصول فقط ${item.product.stock} عدد است`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};