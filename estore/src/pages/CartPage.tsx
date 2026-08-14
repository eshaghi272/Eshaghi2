// src/pages/CartPage.tsx
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartHeader from '../components/cart/CartHeader';
import ProductsListSection from '../components/cart/ProductsListSection';
import BenefitsSection from '../components/cart/BenefitsSection';
import CartSummary from '../components/cart/CartSummary';
import EmptyCartState from '../components/cart/EmptyCartState';
import CustomerSwitchModal from '../components/cart/CustomerSwitchModal';
import AuthModalManager from '../components/auth/AuthModalManager';

const CartPage: React.FC = () => {
  // استفاده از context
  const { 
    items, 
    totalItems, 
    totalPrice, 
    clearCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  
  const { isAuthenticated, user } = useAuth();
  
  // stateها
  const [isClearing, setIsClearing] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // توابع
  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleSwitchCustomer = () => {
    clearCart();
    setShowSwitchModal(false);
  };

  const handleOpenRegister = (identifier: string, method: 'phone' | 'nationalCode') => {
    setAuthModalTab('register');
    setShowAuthModal(true);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // نمایش حالت خالی
  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* هدر */}
        <CartHeader
          totalItems={totalItems}
          totalPrice={formatPrice(totalPrice)}
          isAuthenticated={isAuthenticated}
          onSwitchCustomer={() => setShowSwitchModal(true)}
          onClearCart={handleClearCart}
          isClearing={isClearing}
          onOpenLogin={() => {
            setAuthModalTab('login');
            setShowAuthModal(true);
          }}
          onOpenRegister={() => {
            setAuthModalTab('register');
            setShowAuthModal(true);
          }}
        />

        {/* محتوای اصلی */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* بخش چپ: لیست محصولات و مزایا */}
            <div className="lg:col-span-2 space-y-8">
              <ProductsListSection
                items={items}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                formatPrice={formatPrice}
              />
              <BenefitsSection />
            </div>

            {/* بخش راست: خلاصه سبد خرید */}
            <div className="lg:col-span-1">
              <CartSummary
                totalPrice={totalPrice}
                totalItems={totalItems}
                formatPrice={formatPrice}
                onOpenLogin={() => {
                  setAuthModalTab('login');
                  setShowAuthModal(true);
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* مودال تغییر مشتری */}
      {isAuthenticated && user && (
        <CustomerSwitchModal
          isOpen={showSwitchModal}
          onClose={() => setShowSwitchModal(false)}
          onConfirm={handleSwitchCustomer}
          user={user}
        />
      )}

      {/* مودال Auth */}
      <AuthModalManager
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
        fromCart={true}
      />
    </>
  );
};

export default CartPage;