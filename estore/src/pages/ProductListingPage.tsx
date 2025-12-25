// src/pages/ProductListingPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../features/products/components/productlist/ProductList';
import { mockProducts } from '../features/products/data/mockProducts';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import { Filter, Search } from 'lucide-react';

const ProductListingPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  
  const categories = ['همه', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'همه') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    alert(`${product.name} به سبد خرید اضافه شد`);
  };

  const handleViewDetails = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">محصولات</h1>
      <p className="text-gray-600 mb-8">بهترین محصولات با بهترین قیمت‌ها</p>
      
      {/* نوار فیلتر و جستجو */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="جستجوی محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">{filteredProducts.length} محصول یافت شد</p>
      </div>
      
      <ProductList
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default ProductListingPage;