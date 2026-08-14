// src/components/common/Loaders/ContentLoader.tsx
import React from 'react';

interface ContentLoaderProps {
  count?: number;       // تعداد آیتم‌های لودر
  type?: 'card' | 'list' | 'text' | 'product-card';
  className?: string;
}

export const ContentLoader: React.FC<ContentLoaderProps> = ({
  count = 1,
  type = 'card',
  className = ''
}) => {
  const loaders = Array.from({ length: count }, (_, i) => i);
  
  // انواع مختلف لودر
  const getLoaderByType = () => {
    switch (type) {
      case 'list':
        return (
          <div className="space-y-4">
            {loaders.map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-3 animate-pulse">
            {loaders.map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            ))}
          </div>
        );
      
      case 'product-card':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loaders.map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      default: // 'card'
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loaders.map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        );
    }
  };

  return <div className={className}>{getLoaderByType()}</div>;
};

ContentLoader.displayName = 'ContentLoader';

// واریانت‌های از پیش تعریف شده
export const ProductCardLoader: React.FC<{ count?: number; className?: string }> = (props) => (
  <ContentLoader {...props} type="product-card" />
);

export const TextLoader: React.FC<{ count?: number; className?: string }> = (props) => (
  <ContentLoader {...props} type="text" />
);

export const ListLoader: React.FC<{ count?: number; className?: string }> = (props) => (
  <ContentLoader {...props} type="list" />
);