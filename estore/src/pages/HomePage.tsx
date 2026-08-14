// src/pages/HomePage.tsx
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Shield, 
  Headphones, 
  ArrowLeft, 
  Sparkles,
  TrendingUp,
  BadgeCheck,
  Star,
  Package,
  CreditCard,
  RefreshCw
} from 'lucide-react';

// هوک‌های جدید برای دریافت داده از API
import { 
  useProducts, 
  useBestSellingProducts,
  useDiscountedProducts,
  useProductCategories 
} from '../features/products/data/productHooks';

import ProductList from '../features/products/ProductList/ProductList';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types/index';

// کامپوننت مزایا برای استفاده مجدد
const BenefitCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => (
  <div className="group text-center p-6 transition-all duration-300 hover:-translate-y-2">
    <div className={`${color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110`}>
      {icon}
    </div>
    <h3 className="font-bold text-xl mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// کامپوننت دسته‌بندی
const CategoryCard: React.FC<{
  name: string;
  count: number;
  icon: string;
  onClick: () => void;
}> = ({ name, count, icon, onClick }) => (
  <button
    onClick={onClick}
    className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-center"
  >
    <div className="text-3xl mb-3">{icon}</div>
    <div className="font-medium mb-1">{name}</div>
    <div className="text-sm text-gray-500">{count} محصول</div>
  </button>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // استفاده از هوک‌های API
  const { 
    products: allProducts, 
    loading: productsLoading, 
    error: productsError 
  } = useProducts();
  
  const { 
    products: bestSellingProducts, 
    loading: bestSellersLoading 
  } = useBestSellingProducts(6);
  
  const { 
    products: discountedProducts 
  } = useDiscountedProducts(4);
  
  const { 
    categories: productCategories 
  } = useProductCategories();
  
  // استفاده از useMemo برای محاسبات
  const featuredProducts = useMemo(() => {
    // نمایش 4 محصول اول یا بر اساس ریتینگ
    if (allProducts.length === 0) return [];
    return [...allProducts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [allProducts]);
  
  // دسته‌بندی‌های محبوب
  const popularCategories = useMemo(() => {
    // استفاده از دسته‌بندی‌های واقعی از API
    const categoryIcons: Record<string, string> = {
      'موبایل': '📱',
      'لپ‌تاپ': '💻',
      'هدفون': '🎧',
      'ساعت هوشمند': '⌚',
      'تبلت': '📱',
      'دوربین': '📷',
      'لوازم جانبی': '🔌',
      'کامپیوتر': '🖥️'
    };
    
    // محاسبه تعداد محصولات در هر دسته‌بندی
    const categoryCounts: Record<string, number> = {};
    allProducts.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    
    // تبدیل به آرایه و مرتب‌سازی
    return Object.entries(categoryCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 6)
      .map(([category, count]) => ({
        name: category,
        count,
        icon: categoryIcons[category] || '📦'
      }));
  }, [allProducts]);

  // استفاده از useCallback برای جلوگیری از re-render
  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product, 1);
    // می‌توانید یک toast یا notification اضافه کنید
    // toast.success(`${product.name} به سبد خرید اضافه شد`);
  }, [addToCart]);

  const handleViewDetails = useCallback((productId: number) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

  const handleViewAllProducts = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleCategoryClick = useCallback((category: string) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  }, [navigate]);

  // نمایش Loader
  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">در حال بارگذاری فروشگاه...</p>
        </div>
      </div>
    );
  }

  // نمایش Error
  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">خطا در بارگذاری فروشگاه</h1>
          <p className="text-gray-600 mb-6">{productsError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}

<section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
  <div className="absolute inset-0 bg-black opacity-10"></div>
  <div className="container relative mx-auto px-4 py-12 md:py-16">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
      {/* متن سمت راست */}
      <div className="flex-1 max-w-2xl">
        <div className="flex items-center mb-4">
          <BadgeCheck className="w-6 h-6 mr-2" />
          <span className="text-blue-200 text-sm font-medium">تضمین بهترین قیمت</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          تجربه خریدی <span className="text-yellow-300">استثنایی</span> 
          <br className="hidden sm:block" /> با eStore
        </h1>
        
        <p className="text-gray-200 mb-8 leading-relaxed">
          {allProducts.length} محصول با کیفیت، قیمت مناسب و تحویل سریع
        </p>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleViewAllProducts}
            className="group bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg flex items-center text-sm md:text-base"
          >
            <span>شروع خرید</span>
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/categories')}
            className="group bg-transparent border border-white/50 px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:scale-105 flex items-center text-sm md:text-base"
          >
            <span>دسته‌بندی‌ها</span>
            <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
        
        {/* آمار فروشگاه - کامپکت‌تر */}
        <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{allProducts.length}+</div>
            <div className="text-blue-200 text-sm">محصول متنوع</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">۹۸٪</div>
            <div className="text-blue-200 text-sm">رضایت مشتریان</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">۲۴h</div>
            <div className="text-blue-200 text-sm">ارسال در تهران</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">۷ روز</div>
            <div className="text-blue-200 text-sm">بازگشت کالا</div>
          </div>
        </div>
      </div>
      
      {/* دکوریشن سمت چپ */}
      <div className="relative w-full lg:w-auto flex justify-center">
        <div className="relative w-64 h-64 md:w-72 md:h-72">
          {/* دایره‌های تزیینی */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-2xl opacity-20"></div>
          
          {/* آیفون استایل با محصول */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-48 h-80 bg-gray-900 rounded-[2rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
              {/* ناچ */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-b-2xl z-10"></div>
              
              {/* صفحه نمایش */}
              <div className="absolute inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[1.5rem] overflow-hidden">
                {/* شبیه‌سازی محصول */}
                <div className="p-4 h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white text-center">
                    <div className="font-bold text-lg">eStore</div>
                    <div className="text-sm opacity-90 mt-1">محصولات ویژه</div>
                  </div>
                  
                  {/* قیمت */}
                  <div className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-bold">۱,۲۹۰,۰۰۰</span>
                      <span className="text-sm">تومان</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* عناصر شناور */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-400 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* دسته‌بندی‌های محبوب */}
      {popularCategories.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">محبوب‌ترین دسته‌بندی‌ها</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                count={category.count}
                icon={category.icon}
                onClick={() => handleCategoryClick(category.name)}
              />
            ))}
          </div>
        </section>
      )}

      {/* محصولات ویژه */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold">محصولات ویژه</h2>
            </div>
            <button 
              onClick={handleViewAllProducts}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
          <ProductList
            products={featuredProducts}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            title=""
            gridConfig={{ cols: 4, gap: 'lg' }}
          />
        </section>
      )}
      
      {/* پرفروش‌ترین‌ها */}
      {bestSellingProducts.length > 0 && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold">پرفروش‌ترین‌ها</h2>
              </div>
              <button 
                onClick={handleViewAllProducts}
                className="text-orange-600 hover:text-orange-800 font-medium flex items-center group"
              >
                <span>مشاهده همه</span>
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            <ProductList
              products={bestSellingProducts}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
              title=""
              gridConfig={{ cols: 4, gap: 'lg' }}
            />
          </div>
        </section>
      )}
      
      {/* تخفیف‌های ویژه */}
      {discountedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">٪</span>
              </div>
              <h2 className="text-2xl font-bold">تخفیف‌های ویژه</h2>
            </div>
            <button 
              onClick={handleViewAllProducts}
              className="text-red-600 hover:text-red-800 font-medium flex items-center group"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
          <ProductList
            products={discountedProducts}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            title=""
            gridConfig={{ cols: 4, gap: 'lg' }}
          />
        </section>
      )}

      {/* مزایای فروشگاه */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">چرا eStore را انتخاب کنید؟</h2>
            <p className="text-gray-300 text-lg">ما بهترین تجربه خرید آنلاین را برای شما فراهم کرده‌ایم</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <BenefitCard
              icon={<Truck className="w-10 h-10 text-blue-600" />}
              title="ارسال سریع و رایگان"
              description="تحویل در کمتر از ۲۴ ساعت در تهران و ۷۲ ساعت در سایر شهرها - رایگان برای خریدهای بالای ۲۰۰ هزار تومان"
              color="bg-blue-100"
            />
            
            <BenefitCard
              icon={<Shield className="w-10 h-10 text-green-600" />}
              title="تضمین اصالت کالا"
              description="کلیه محصولات با گارانتی اصلی - ۷ روز مهلت تست و بازگشت کالا"
              color="bg-green-100"
            />
            
            <BenefitCard
              icon={<CreditCard className="w-10 h-10 text-purple-600" />}
              title="پرداخت امن"
              description="پرداخت آنلاین با امنیت بالا - پشتیبانی از کلیه کارت‌های بانکی"
              color="bg-purple-100"
            />
            
            <BenefitCard
              icon={<RefreshCw className="w-10 h-10 text-orange-600" />}
              title="بازگشت آسان"
              description="امکان بازگشت کالا تا ۷ روز پس از تحویل بدون هیچ دردسری"
              color="bg-orange-100"
            />
          </div>
          
          {/* امتیاز مشتریان */}
          <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-right">
                <div className="text-5xl font-bold mb-2">۴.۹</div>
                <div className="flex justify-center md:justify-end mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-gray-300">امتیاز از بیش از ۱۰۰۰ نظر</div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4">نظرات مشتریان راضی</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <div className="font-medium">محمد احمدی</div>
                        <div className="text-sm text-gray-400">۲ روز پیش</div>
                      </div>
                    </div>
                    <p className="text-gray-300">تحویل فوق‌العاده سریع بود. ممنون از خدمات خوبتون</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <div className="font-medium">فاطمه کریمی</div>
                        <div className="text-sm text-gray-400">۱ هفته پیش</div>
                      </div>
                    </div>
                    <p className="text-gray-300">کیفیت محصول عالی بود. حتماً دوباره خرید می‌کنم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA آخر */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">آماده خرید هستید؟</h2>
          <p className="text-xl mb-8 opacity-90">
            همین حالا به خانواده بزرگ مشتریان eStore بپیوندید
          </p>
          <button 
            onClick={handleViewAllProducts}
            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl inline-flex items-center"
          >
            <span>شروع خرید از eStore</span>
            <ArrowLeft className="w-6 h-6 mr-3" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;