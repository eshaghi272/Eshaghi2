// به جای این خط:
// import { ProductDetailLoader } from '../components/common/Loaders';

// از این استفاده کنید:
const ProductDetailLoader: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">در حال بارگذاری محصول...</p>
    </div>
  </div>
);