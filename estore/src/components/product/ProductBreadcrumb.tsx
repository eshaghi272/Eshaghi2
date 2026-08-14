// src/components/product/ProductBreadcrumb.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductBreadcrumbProps {
  productName: string;
  category: string;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ 
  productName, 
  category 
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center text-sm text-gray-600">
          <BreadcrumbItem 
            label="خانه"
            onClick={() => navigate('/')}
          />
          <BreadcrumbItem 
            label="محصولات"
            onClick={() => navigate('/products')}
          />
          <BreadcrumbItem 
            label={category}
            onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
          />
          <CurrentPage label={productName} />
        </div>
      </div>
    </div>
  );
};

const BreadcrumbItem: React.FC<{
  label: string;
  onClick: () => void;
}> = ({ label, onClick }) => (
  <>
    <button 
      onClick={onClick}
      className="hover:text-blue-600 transition"
    >
      {label}
    </button>
    <ChevronRight className="w-4 h-4 mx-2" />
  </>
);

const CurrentPage: React.FC<{ label: string }> = ({ label }) => (
  <span className="text-blue-600 font-medium truncate max-w-xs">
    {label}
  </span>
);

export default ProductBreadcrumb;