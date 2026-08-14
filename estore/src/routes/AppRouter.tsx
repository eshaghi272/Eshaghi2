// src/AppRouter.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layout
import Layout from '../components/layout/Layout';

// Error Boundary
import ErrorBoundary from '../components/common/ErrorBoundary';

// Auth Components
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

// Import PageLoader از Loaders
import { PageLoader } from '../components/common/Loaders';

// Lazy Loading برای صفحات
const HomePage = lazy(() => import('../pages/HomePage'));
const ProductListingPage = lazy(() => import('../pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const OrderHistoryPage = lazy(() => import('../pages/OrderHistoryPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage'));

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    localStorage.setItem('redirect_after_login', currentPath);
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (isAuthenticated) {
    const savedRedirect = localStorage.getItem('redirect_after_login');
    if (savedRedirect) {
      localStorage.removeItem('redirect_after_login');
      return <Navigate to={savedRedirect} replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            <Route path="products">
              <Route index element={<ProductListingPage />} />
              <Route path=":id" element={<ProductDetailPage />} />
              <Route path="category/:category" element={<ProductListingPage />} />
            </Route>
            
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="cart" element={<CartPage />} />
            
            <Route 
              path="checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="order-success/:orderId" 
              element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          <Route path="/auth">
            <Route 
              path="login" 
              element={
                <PublicOnlyRoute>
                  <LoginForm />
                </PublicOnlyRoute>
              } 
            />
            <Route 
              path="register" 
              element={
                <PublicOnlyRoute>
                  <RegisterForm />
                </PublicOnlyRoute>
              } 
            />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRouter;