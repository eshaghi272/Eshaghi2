// src/server.js
// src/server.js - نسخه ES Module
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import ProductAPI from '../api/api.js'; // دقت: .js اضافه شد

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Route برای اطلاعات API
app.get('/api', ProductAPI.getApiInfo);

// Route‌های محصولات
app.get('/api/products', ProductAPI.getAllProducts);
app.get('/api/products/advanced-search', ProductAPI.advancedSearch);
app.get('/api/products/search', ProductAPI.searchProducts);
app.get('/api/products/featured', ProductAPI.getFeaturedProducts);
app.get('/api/products/discounted', ProductAPI.getDiscountedProducts);
app.get('/api/products/category/:category', ProductAPI.getProductsByCategory);
app.get('/api/products/:id', ProductAPI.getProductById);
app.post('/api/products', ProductAPI.createProduct);
app.put('/api/products/:id', ProductAPI.updateProduct);
app.delete('/api/products/:id', ProductAPI.deleteProduct);

// Route‌های دسته‌بندی‌ها
app.get('/api/categories', ProductAPI.getCategories);

// Route‌های سفارشات
app.get('/api/orders', ProductAPI.getOrders);
app.post('/api/orders', ProductAPI.createOrder);

// Route‌های آمار
app.get('/api/stats', ProductAPI.getProductStats);

// Route برای تست اتصال
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API در حال اجراست',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route برای مستندات
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    documentation: {
      baseUrl: 'http://localhost:3000/api',
      endpoints: [
        { method: 'GET', path: '/products', description: 'دریافت تمام محصولات با صفحه‌بندی' },
        { method: 'GET', path: '/products/:id', description: 'دریافت محصول بر اساس شناسه' },
        { method: 'GET', path: '/products/search', description: 'جستجوی ساده محصولات' },
        { method: 'GET', path: '/products/advanced-search', description: 'جستجوی پیشرفته محصولات' },
        { method: 'GET', path: '/products/featured', description: 'دریافت محصولات ویژه' },
        { method: 'GET', path: '/products/discounted', description: 'دریافت محصولات تخفیف‌دار' },
        { method: 'GET', path: '/products/category/:category', description: 'دریافت محصولات بر اساس دسته‌بندی' },
        { method: 'POST', path: '/products', description: 'ایجاد محصول جدید' },
        { method: 'PUT', path: '/products/:id', description: 'به‌روزرسانی محصول' },
        { method: 'DELETE', path: '/products/:id', description: 'حذف محصول' },
        { method: 'GET', path: '/categories', description: 'دریافت دسته‌بندی‌ها' },
        { method: 'GET', path: '/orders', description: 'دریافت سفارشات' },
        { method: 'POST', path: '/orders', description: 'ایجاد سفارش جدید' },
        { method: 'GET', path: '/stats', description: 'دریافت آمار محصولات' },
        { method: 'GET', path: '/health', description: 'بررسی سلامت API' },
        { method: 'GET', path: '/docs', description: 'مستندات API' }
      ]
    }
  });
});

// Middleware برای خطاهای 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'مسیر یافت نشد'
  });
});

// Middleware برای خطاهای سرور
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'خطای داخلی سرور'
  });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`🚀 سرور API در حال اجرا روی پورت ${PORT}`);
  console.log(`📚 مستندات: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 سلامت: http://localhost:${PORT}/api/health`);
  console.log(`🛍️  محصولات: http://localhost:${PORT}/api/products`);
});