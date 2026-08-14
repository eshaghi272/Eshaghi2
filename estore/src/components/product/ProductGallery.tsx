// src/components/product/ProductGallery.tsx
import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import type { Product } from '../../types/index';

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  
  // تصاویر نمونه برای گالری
  const galleryImages = [
    product.imageUrl,
    `${product.imageUrl}?t=1`,
    `${product.imageUrl}?t=2`,
    `${product.imageUrl}?t=3`
  ];
  
  // دسته‌بندی رنگ بر اساس موجودی
  const stockStatus = product.stock === 0 
    ? { 
        text: 'ناموجود', 
        color: 'bg-red-100 text-red-800 border-red-200',
        bgColor: 'bg-gradient-to-r from-red-50 to-red-100',
        badgeColor: 'bg-red-500'
      }
    : product.stock < 10 
      ? { 
          text: `${product.stock} عدد باقیمانده`, 
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100',
          badgeColor: 'bg-orange-500'
        }
      : { 
          text: 'موجود در انبار', 
          color: 'bg-green-100 text-green-800 border-green-200',
          bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
          badgeColor: 'bg-green-500'
        };

  return (
    <div className="space-y-4">
      {/* تصویر اصلی */}
      <MainImage 
        imageUrl={selectedImage || product.imageUrl}
        productName={product.name}
        stockStatus={stockStatus}
      />
      
      {/* گالری تصاویر */}
      <ImageGallery 
        images={galleryImages}
        selectedImage={selectedImage}
        onSelectImage={setSelectedImage}
      />
      
      {/* تگ‌ها */}
      {product.tags && product.tags.length > 0 && (
        <ProductTags tags={product.tags} />
      )}
    </div>
  );
};

const MainImage: React.FC<{
  imageUrl: string;
  productName: string;
  stockStatus: any;
}> = ({ imageUrl, productName, stockStatus }) => (
  <div className={`${stockStatus.bgColor} rounded-2xl shadow-xl overflow-hidden border ${stockStatus.color.split(' ')[2]}`}>
    <div className="relative">
      <img 
        src={imageUrl} 
        alt={productName}
        className="w-full h-[400px] object-contain p-8"
      />
      <div className={`absolute top-4 left-4 ${stockStatus.color} px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5`}>
        <div className={`w-2 h-2 rounded-full ${stockStatus.badgeColor}`}></div>
        {stockStatus.text}
      </div>
    </div>
  </div>
);

const ImageGallery: React.FC<{
  images: string[];
  selectedImage: string;
  onSelectImage: (image: string) => void;
}> = ({ images, selectedImage, onSelectImage }) => (
  <div className="flex space-x-3 space-x-reverse overflow-x-auto pb-4">
    {images.map((img, index) => (
      <button
        key={index}
        onClick={() => onSelectImage(img)}
        className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
          selectedImage === img 
            ? 'border-blue-500 ring-2 ring-blue-200' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <img 
          src={img} 
          alt={`تصویر ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </button>
    ))}
  </div>
);

const ProductTags: React.FC<{ tags: string[] }> = ({ tags }) => (
  <div className="flex flex-wrap gap-2 mt-6">
    <Tag className="w-5 h-5 text-gray-500" />
    {tags.map((tag, index) => (
      <span 
        key={index}
        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
      >
        {tag}
      </span>
    ))}
  </div>
);

export default ProductGallery;