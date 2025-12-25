// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import ProductList from '../features/products/components/productlist/ProductList';
import { mockProducts } from '../features/products/data/mockProducts';
import { useCart } from '../contexts/CartContext';
import { Product } from '../features/products/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // محصولات ویژه (مثلاً ۴ محصول اول)
  const featuredProducts = mockProducts.slice(0, 4);
  const bestSellers = mockProducts.slice(1, 5);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    // می‌توانید یک toast یا notification اضافه کنید
    alert(`${product.name} به سبد خرید اضافه شد`);
  };

  const handleViewDetails = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          به eStore خوش آمدید
        </h1>
        <p className="text-xl mb-8 opacity-90">
          بهترین محصولات با بهترین قیمت‌ها را از ما بخواهید
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleViewAllProducts}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center"
          >
            مشاهده محصولات
            <ArrowLeft className="w-5 h-5 mr-2" />
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition"
          >
            جستجوی محصولات
          </button>
        </div>
      </div>
      
      {/* محصولات ویژه */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">محصولات ویژه</h2>
          <button 
            onClick={handleViewAllProducts}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            مشاهده همه
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>
        </div>
        <ProductList
          products={featuredProducts}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
        />
      </section>
      
      {/* پرفروش‌ترین‌ها */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">پرفروش‌ترین‌ها</h2>
          <button 
            onClick={handleViewAllProducts}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            مشاهده همه
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>
        </div>
        <ProductList
          products={bestSellers}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
        />
      </section>
      
      {/* مزایای فروشگاه */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-8">چرا eStore؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">ارسال رایگان</h3>
            <p className="text-gray-600">برای خریدهای بالای ۲۰۰ هزار تومان</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">گارانتی بازگشت</h3>
            <p className="text-gray-600">۷ روز مهلت تست و بازگشت کالا</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">پشتیبانی ۲۴/۷</h3>
            <p className="text-gray-600">پاسخگویی سریع به سوالات شما</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;