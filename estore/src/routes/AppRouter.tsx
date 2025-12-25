import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import ProductListingPage from '../pages/ProductListingPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* صفحه اصلی */}
                    <Route index element={<HomePage />} />

                    {/* صفحه محصولات */}
                    <Route path="products" element={<ProductListingPage />} />

                    {/* صفحه جزئیات محصول */}
                    <Route path="products/:id" element={<ProductDetailPage />} />

                    {/* صفحه سبد خرید */}
                    <Route path="cart" element={<CartPage />} />

                    {/* صفحه 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;