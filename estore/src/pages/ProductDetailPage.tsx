import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">جزئیات محصول #{id}</h1>
            <p className="text-gray-600">این صفحه به زودی کامل می‌شود...</p>
        </div>
    );
};

export default ProductDetailPage;