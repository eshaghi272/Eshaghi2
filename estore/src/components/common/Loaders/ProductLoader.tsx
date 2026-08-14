// src/components/common/Loaders/ProductLoader.tsx
import React from 'react';

interface ProductLoaderProps {
  count?: number;
  layout?: 'grid' | 'list';
  showHeader?: boolean;
  className?: string;
}

export const ProductLoader: React.FC<ProductLoaderProps> = ({
  count = 4,
  layout = 'grid',
  showHeader = true,
  className = ''
}) => {
  const products = Array.from({ length: count }, (_, i) => i);
  
  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'space-y-4';

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      )}
      
      <div className={gridClasses}>
        {products.map((_, index) => (
          <div 
            key={index} 
            className={`
              bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse
              ${layout === 'list' ? 'flex' : ''}
            `}
          >
            {/* تصویر */}
            <div className={`
              ${layout === 'list' ? 'w-32 h-32' : 'h-48'} 
              bg-gray-200 ${layout === 'list' ? 'flex-shrink-0' : ''}
            `}></div>
            
            {/* محتوا */}
            <div className={`${layout === 'list' ? 'p-4 flex-1' : 'p-5'}`}>
              {/* دسته‌بندی */}
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
              
              {/* نام */}
              <div className={`h-5 bg-gray-200 rounded ${layout === 'list' ? 'w-3/4' : 'w-3/4'} mb-2`}></div>
              
              {/* توضیحات */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              
              {/* ریتینگ */}
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-3 bg-gray-200 rounded w-12 mr-3"></div>
              </div>
              
              {/* قیمت و دکمه */}
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-7 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ProductLoader.displayName = 'ProductLoader';

// واریانت‌های مختلف
export const ProductGridLoader: React.FC<Omit<ProductLoaderProps, 'layout'>> = (props) => (
  <ProductLoader {...props} layout="grid" />
);

export const ProductListLoader: React.FC<Omit<ProductLoaderProps, 'layout'>> = (props) => (
  <ProductLoader {...props} layout="list" />
);