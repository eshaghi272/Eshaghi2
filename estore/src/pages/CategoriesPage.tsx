// src/pages/CategoriesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Package, 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  Home,
  Smartphone,
  Laptop,
  Shirt,
  Book,
  Sofa,
  Dumbbell,
  Heart,
  ToyBrick,
  Apple,
  Search,
  Filter,
  Star
} from 'lucide-react';

// استفاده از هوک جدید - فقط از productHooks دسته‌بندی را import می‌کنیم
import { useProductCategories } from '../features/products/data/productHooks';
// نوع Category را از types/index import می‌کنیم
import type { Category } from '../../types/index';

// کامپوننت کارت دسته‌بندی
const CategoryCard: React.FC<{
  category: Category;
  level?: number;
  onSelect: (category: Category) => void;
}> = ({ category, level = 0, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  // آیکون بر اساس نام دسته‌بندی
  const getCategoryIcon = (name: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'الکترونیک': <Smartphone className="w-6 h-6" />,
      'موبایل': <Smartphone className="w-6 h-6" />,
      'لپ‌تاپ': <Laptop className="w-6 h-6" />,
      'تبلت': <Smartphone className="w-6 h-6" />,
      'هدفون': <Package className="w-6 h-6" />,
      'لباس': <Shirt className="w-6 h-6" />,
      'مردانه': <Shirt className="w-6 h-6" />,
      'زنانه': <Heart className="w-6 h-6" />,
      'بچگانه': <ToyBrick className="w-6 h-6" />,
      'کتاب': <Book className="w-6 h-6" />,
      'رمان': <Book className="w-6 h-6" />,
      'علمی': <Book className="w-6 h-6" />,
      'تاریخ': <Book className="w-6 h-6" />,
      'خانه': <Home className="w-6 h-6" />,
      'مبلمان': <Sofa className="w-6 h-6" />,
      'لوازم آشپزخانه': <Package className="w-6 h-6" />,
      'ورزشی': <Dumbbell className="w-6 h-6" />,
      'باشگاه': <Dumbbell className="w-6 h-6" />,
      'فوتبال': <Package className="w-6 h-6" />,
      'زیبایی': <Heart className="w-6 h-6" />,
      'آرایشی': <Heart className="w-6 h-6" />,
      'بهداشتی': <Package className="w-6 h-6" />,
      'اسباب‌بازی': <ToyBrick className="w-6 h-6" />,
      'پسرانه': <ToyBrick className="w-6 h-6" />,
      'دخترانه': <ToyBrick className="w-6 h-6" />,
      'خواربار': <Apple className="w-6 h-6" />,
      'خشکبار': <Apple className="w-6 h-6" />,
      'شکلات و شیرینی': <Apple className="w-6 h-6" />
    };

    return iconMap[name] || <Package className="w-6 h-6" />;
  };

  // رنگ‌های مختلف بر اساس سطح
  const getColorClass = (level: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-yellow-500 to-yellow-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
      'from-teal-500 to-teal-600'
    ];
    return colors[level % colors.length];
  };

  return (
    <div className="mb-4">
      {/* کارت اصلی دسته‌بندی */}
      <div
        className={`group bg-gradient-to-br ${getColorClass(level)} text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
          level > 0 ? 'ml-4 border-r-4 border-white/20' : ''
        }`}
        onClick={() => !hasChildren && onSelect(category)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              {getCategoryIcon(category.name)}
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg">{category.name}</h3>
              {category.description && (
                <p className="text-sm opacity-80">{category.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1 hover:bg-white/20 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            )}
            {!hasChildren && (
              <button 
                onClick={() => onSelect(category)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition"
              >
                مشاهده
              </button>
            )}
          </div>
        </div>
      </div>

      {/* زیردسته‌بندی‌ها */}
      {hasChildren && isExpanded && (
        <div className="mt-2 ml-8">
          {category.children!.map(child => (
            <CategoryCard
              key={child.id}
              category={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// تابع برای ساختار درختی دسته‌بندی‌ها
const buildCategoryTree = (categories: any[]): Category[] => {
  if (!Array.isArray(categories)) return [];
  
  // دسته‌بندی‌های اصلی (بدون parent)
  const mainCategories = categories
    .filter(cat => cat.parent_id === null)
    .map(cat => ({
      ...cat,
      children: categories.filter(child => child.parent_id === cat.id)
    }));
  
  return mainCategories;
};

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { detailedCategories, loading, error } = useProductCategories();

  // ساختار درختی دسته‌بندی‌ها
  const categoryTree = buildCategoryTree(detailedCategories || []);
  
  // همه دسته‌بندی‌ها (صاف شده)
  const allCategories = detailedCategories || [];

  // فیلتر دسته‌بندی‌ها بر اساس جستجو
  const filteredCategories = allCategories.filter(category =>
    category.name.includes(searchQuery) ||
    (category.description && category.description.includes(searchQuery))
  );

  // دسته‌بندی‌های اصلی
  const mainCategories = categoryTree.filter(cat => cat.parent_id === null);

  // تابع برای هدایت به صفحه محصولات
  const handleCategorySelect = (category: Category) => {
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
  };

  // دسته‌بندی‌های محبوب (نمونه)
  const popularCategories = mainCategories.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">در حال بارگذاری دسته‌بندی‌ها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">خطا در بارگذاری</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* هدر صفحه */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-200 hover:text-white mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 ml-1 group-hover:-translate-x-1 transition-transform" />
            بازگشت
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">دسته‌بندی‌های فروشگاه</h1>
              <p className="text-blue-100">
                {allCategories.length} دسته‌بندی متنوع برای انتخاب شما
              </p>
            </div>
            
            {/* جستجو */}
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجوی دسته‌بندی..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 pr-12 pl-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="container mx-auto px-4 py-8">
        {/* دسته‌بندی‌های محبوب */}
        {popularCategories.length > 0 && !searchQuery && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">دسته‌بندی‌های محبوب</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {popularCategories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="group bg-white rounded-2xl p-6 text-center border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description || `${category.children?.length || 0} زیردسته`}
                  </p>
                  <span className="inline-flex items-center text-blue-600 text-sm">
                    مشاهده محصولات
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* همه دسته‌بندی‌ها */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Grid className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">
              {searchQuery ? 'نتیجه جستجو' : 'همه دسته‌بندی‌ها'}
            </h2>
            {searchQuery && (
              <span className="text-gray-600 text-sm">
                ({filteredCategories.length} نتیجه)
              </span>
            )}
          </div>

          {/* فیلترها */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                <Filter className="w-4 h-4" />
                همه
              </button>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2">
                اصلی
              </button>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2">
                زیردسته
              </button>
            </div>
          )}

          {/* لیست دسته‌بندی‌ها */}
          {filteredCategories.length > 0 ? (
            <div className="space-y-4">
              {searchQuery ? (
                // نمایش صاف شده برای جستجو
                filteredCategories.map(category => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(category.name)}
                      </div>
                      <div>
                        <h3 className="font-bold">{category.name}</h3>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                  </div>
                ))
              ) : (
                // نمایش درختی برای حالت عادی
                categoryTree.map(category => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onSelect={handleCategorySelect}
                  />
                ))
              )}
            </div>
          ) : (
            // حالت خالی
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2">
                {searchQuery ? 'نتیجه‌ای یافت نشد' : 'دسته‌بندی‌ای یافت نشد'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? 'متأسفانه هیچ دسته‌بندی با این نام وجود ندارد. عبارت جستجوی خود را تغییر دهید.'
                  : 'در حال حاضر هیچ دسته‌بندی‌ای در فروشگاه تعریف نشده است.'
                }
              </p>
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  پاک کردن جستجو
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  بازگشت به صفحه اصلی
                </button>
              )}
            </div>
          )}

          {/* آمار */}
          {!searchQuery && allCategories.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{mainCategories.length}</div>
                  <div className="text-gray-600">دسته‌بندی اصلی</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {allCategories.length - mainCategories.length}
                  </div>
                  <div className="text-gray-600">زیردسته</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{allCategories.length}</div>
                  <div className="text-gray-600">کل دسته‌بندی‌ها</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {categoryTree.filter(c => c.children && c.children.length > 0).length}
                  </div>
                  <div className="text-gray-600">دارای زیرمجموعه</div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// تابع کمکی برای آیکون
const getCategoryIcon = (name: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'الکترونیک': <Smartphone className="w-6 h-6" />,
    'موبایل': <Smartphone className="w-6 h-6" />,
    'لپ‌تاپ': <Laptop className="w-6 h-6" />,
    'تبلت': <Smartphone className="w-6 h-6" />,
    'هدفون': <Package className="w-6 h-6" />,
    'لباس': <Shirt className="w-6 h-6" />,
    'مردانه': <Shirt className="w-6 h-6" />,
    'زنانه': <Heart className="w-6 h-6" />,
    'بچگانه': <ToyBrick className="w-6 h-6" />,
    'کتاب': <Book className="w-6 h-6" />,
    'رمان': <Book className="w-6 h-6" />,
    'علمی': <Book className="w-6 h-6" />,
    'تاریخ': <Book className="w-6 h-6" />,
    'خانه': <Home className="w-6 h-6" />,
    'مبلمان': <Sofa className="w-6 h-6" />,
    'لوازم آشپزخانه': <Package className="w-6 h-6" />,
    'ورزشی': <Dumbbell className="w-6 h-6" />,
    'باشگاه': <Dumbbell className="w-6 h-6" />,
    'فوتبال': <Package className="w-6 h-6" />,
    'زیبایی': <Heart className="w-6 h-6" />,
    'آرایشی': <Heart className="w-6 h-6" />,
    'بهداشتی': <Package className="w-6 h-6" />,
    'اسباب‌بازی': <ToyBrick className="w-6 h-6" />,
    'پسرانه': <ToyBrick className="w-6 h-6" />,
    'دخترانه': <ToyBrick className="w-6 h-6" />,
    'خواربار': <Apple className="w-6 h-6" />,
    'خشکبار': <Apple className="w-6 h-6" />,
    'شکلات و شیرینی': <Apple className="w-6 h-6" />
  };

  return iconMap[name] || <Package className="w-6 h-6" />;
};

export default CategoriesPage;