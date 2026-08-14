// src/pages/ProductDetailPage.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// import { useCart } from '../contexts/CartContext';
// import { useProduct, useSimilarProducts } from '../features/products/data/productHooks';
// import { ProductDetailLoader } from '../components/common/Loaders/PageLoader';
// import type { Product } from '../types/index';


import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useCart } from '../contexts/CartContext';
import { useProduct, useSimilarProducts } from '../features/products/data/productHooks';
import { ProductDetailLoader } from '../components/common/Loaders/PageLoader'; // اینجا اصلاح شده
import type { Product } from '../types/index';


// کامپوننت‌های مستقل
import ProductBreadcrumb from '../components/product/ProductBreadcrumb';
import ProductGallery from '../components/product/ProductGallery';
import ProductHeader from '../components/product/ProductHeader';
import ProductPricing from '../components/product/ProductPricing';
import QuantitySelector from '../components/product/QuantitySelector';
import ActionButtons from '../components/product/ActionButtons';
import StoreBenefits from '../components/product/StoreBenefits';
import ProductTabs from '../components/product/ProductTabs';
import SimilarProducts from '../components/product/SimilarProducts';
import ErrorState from '../components/product/ErrorState';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const productId = id ? parseInt(id) : 0;
  const { product, loading, error } = useProduct(productId);
  const { products: similarProducts } = useSimilarProducts(productId);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  if (loading) {
    return <ProductDetailLoader />;
  }
  
  if (error || !product) {
    return <ErrorState />;
  }
  
  const handleAddToCart = useCallback(() => {
    addToCart(product, quantity);
    alert(`✅ ${product.name} به سبد خرید اضافه شد`);
  }, [product, quantity, addToCart]);
  
  const handleQuickBuy = useCallback(() => {
    addToCart(product, quantity);
    navigate('/cart');
  }, [product, quantity, navigate, addToCart]);
  
  const handleWishlistToggle = useCallback(() => {
    setIsWishlisted(!isWishlisted);
    alert(isWishlisted ? 'از لیست علاقه‌مندی‌ها حذف شد' : 'به لیست علاقه‌مندی‌ها اضافه شد');
  }, [isWishlisted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <ProductBreadcrumb 
        productName={product.name}
        category={product.category}
      />
      
      {/* محتوای اصلی */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* بخش تصاویر */}
          <div>
            <ProductGallery product={product} />
          </div>
          
          {/* بخش اطلاعات */}
          <div className="space-y-6">
            {/* هدر */}
            <ProductHeader 
              productId={product.id}
              productName={product.name}
              category={product.category}
              rating={product.rating}
              reviewCount={product.reviewCount}
              isWishlisted={isWishlisted}
              onWishlistToggle={handleWishlistToggle}
            />
            
            {/* توضیحات کوتاه */}
            <p className="text-gray-700 leading-relaxed text-lg">
              {product.description}
            </p>
            
            {/* قیمت‌گذاری */}
            <ProductPricing 
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
            />
            
            {/* انتخاب تعداد */}
            <QuantitySelector 
              quantity={quantity}
              stock={product.stock}
              price={product.price}
              onQuantityChange={setQuantity}
            />
            
            {/* دکمه‌های اقدام */}
            <ActionButtons 
              onAddToCart={handleAddToCart}
              onQuickBuy={handleQuickBuy}
              stock={product.stock}
            />
            
            {/* مزایا */}
            <StoreBenefits />
          </div>
        </div>
        
        {/* تب‌های اطلاعات */}
        <div className="mt-12">
          <ProductTabs product={product} />
        </div>
        
        {/* محصولات مشابه */}
        <SimilarProducts 
          products={similarProducts}
          currentProduct={product}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;