// src/features/products/types.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  stock: number;
  category: string;
  rating: number;
  reviewCount: number;
  tags?: string[];
  specifications?: Record<string, string>;
}

// این خط حیاتی است:
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (productId: number) => void;
  className?: string;
}