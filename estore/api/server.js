// server.js (نسخه تضمینی)
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ابتدا Routeهای مستقیم را اضافه کنیم
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'سرور E-Store فعال است 🎉',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    message: 'محصولات',
    data: []
  });
});

app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    message: 'دسته‌بندی‌ها',
    data: []
  });
});

app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    message: 'سفارشات',
    data: []
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'مسیر یافت نشد',
    path: req.originalUrl
  });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 سرور E-Store روی پورت ${PORT} اجرا شد`);
  console.log(`📌 آدرس‌های اصلی:`);
  console.log(`   🌐 http://localhost:${PORT}/`);
  console.log(`   🛍️  http://localhost:${PORT}/api/products`);
  console.log(`   📂 http://localhost:${PORT}/api/categories`);
  console.log(`   📦 http://localhost:${PORT}/api/orders`);
  console.log('='.repeat(50));
});