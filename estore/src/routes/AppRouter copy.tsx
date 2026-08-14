// src/routes/AppRouter.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from '../components/layout/Layout';

// Loading Components
import { PageLoader } from '../components/common/Loaders';

// Error Boundary
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Lazy Loading برای صفحات (Code Splitting)
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

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = false; // اینجا باید منطق authentication خود را اضافه کنید
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// PublicOnlyRoute برای صفحاتی که نباید برای کاربران authenticated نمایش داده شوند
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = false; // اینجا باید منطق authentication خود را اضافه کنید
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Scroll to Top on Route Change
const ScrollToTop: React.FC = () => {
  const { pathname } = window.location;
  
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Layout اصلی */}
            <Route path="/" element={<Layout />}>
              {/* صفحه اصلی */}
              <Route index element={<HomePage />} />
              
              {/* محصولات */}
              <Route path="products">
                <Route index element={<ProductListingPage />} />
                <Route path=":id" element={<ProductDetailPage />} />
                <Route path="category/:category" element={<ProductListingPage />} />
              </Route>
              
              {/* دسته‌بندی‌ها */}
              <Route path="categories" element={<CategoriesPage />} />
              
              {/* سبد خرید */}
              <Route path="cart" element={<CartPage />} />
              
              {/* فرآیند پرداخت */}
              <Route 
                path="checkout" 
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* حساب کاربری */}
              <Route path="account">
                <Route 
                  index 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="orders" 
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              {/* صفحات اطلاعاتی */}
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              
              {/* بازنشانی (برای فیلترها) */}
              <Route path="reset-password" element={<PublicOnlyRoute><div>Reset Password Page</div></PublicOnlyRoute>} />
              
              {/* خطاها */}
              <Route path="404" element={<NotFoundPage />} />
              <Route path="500" element={<div>خطای سرور</div>} />
              
              {/* Redirects */}
              <Route path="home" element={<Navigate to="/" replace />} />
              <Route path="shop" element={<Navigate to="/products" replace />} />
              <Route path="store" element={<Navigate to="/products" replace />} />
              
              {/* 404 Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            
            {/* Routeهای بدون Layout */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <div>Admin Panel</div>
                </ProtectedRoute>
              } 
            />
            
            {/* Auth Routes بدون Layout */}
            <Route path="/auth">
              <Route path="login" element={<PublicOnlyRoute><div>Login Page</div></PublicOnlyRoute>} />
              <Route path="register" element={<PublicOnlyRoute><div>Register Page</div></PublicOnlyRoute>} />
              <Route path="forgot-password" element={<PublicOnlyRoute><div>Forgot Password</div></PublicOnlyRoute>} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

// تنظیمات پیش‌فرض
AppRouter.displayName = 'AppRouter';

export default AppRouter;