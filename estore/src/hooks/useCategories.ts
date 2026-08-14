// src/hooks/useCategories.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  children?: Category[];
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:3000/api/categories');
      
      if (response.data.success) {
        // گروه‌بندی دسته‌بندی‌ها به صورت درختی
        const allCategories = response.data.data;
        const parentCategories = allCategories.filter((cat: Category) => cat.parent_id === null);
        
        const categorized = parentCategories.map((parent: Category) => ({
          ...parent,
          children: allCategories.filter((child: Category) => child.parent_id === parent.id)
        }));
        
        setCategories(categorized);
      } else {
        setError('خطا در دریافت دسته‌بندی‌ها');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ارتباط با سرور');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // همه دسته‌بندی‌ها (صاف شده)
  const allCategories = categories.flatMap(cat => [cat, ...(cat.children || [])]);

  return {
    categories, // ساختار درختی
    allCategories, // لیست صاف شده
    loading,
    error,
    refresh: fetchCategories
  };
};