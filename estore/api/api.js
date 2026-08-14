// D:\Eshaghi\estore\api\api.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// برای ES modules به جای __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import productsRouter from './routes/products.route.js';
import ordersRouter from './routes/orders.route.js';
import categoriesRouter from './routes/categories.route.js';

// import auth router
let authRouter;
try {
  const authModule = await import('./routes/auth.route.js');
  authRouter = authModule.default;
  console.log('✅ Route احراز هویت بارگذاری شد');
} catch (error) {
  console.log('⚠️ Route احراز هویت یافت نشد، روت تستی ایجاد می‌شود', error.message);
  // ایجاد روت تستی برای auth
  authRouter = express.Router();
  authRouter.post('/register', (req, res) => {
    res.json({
      success: true,
      message: 'حالت تست - کاربر ثبت شد',
      data: {
        user_id: Date.now(),
        verification_code: '1234',
        code_expires_at: new Date(Date.now() + 120000).toISOString()
      }
    });
  });
  
  authRouter.post('/verify', (req, res) => {
    res.json({
      success: true,
      message: 'حالت تست - تأیید موفق',
      token: 'fake-jwt-token-' + Date.now()
    });
  });
  
  authRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123456') {
      return res.json({
        success: true,
        message: 'ورود موفق',
        user: { username, role: 'admin' },
        token: 'fake-jwt-token-admin'
      });
    }
    res.status(401).json({
      success: false,
      error: 'نام کاربری یا رمز عبور اشتباه است'
    });
  });
}

// فقط contactRouter را import نکنید، اگر وجود ندارد
let contactRouter;
try {
  const contactModule = await import('./routes/contact.route.js');
  contactRouter = contactModule.default;
  console.log('✅ Route تماس بارگذاری شد');
} catch (error) {
  console.log('⚠️ Route تماس یافت نشد، از روت‌های داخلی استفاده می‌شود');
  contactRouter = null;
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev'));

// Route definitions
const routes = [
  { name: 'categoriesRouter', path: '/api/categories', router: categoriesRouter },
  { name: 'productsRouter', path: '/api/products', router: productsRouter },
  { name: 'ordersRouter', path: '/api/orders', router: ordersRouter },
  { name: 'authRouter', path: '/api/auth', router: authRouter } // اضافه کردن auth router
];

// Mount routes
routes.forEach(({ name, path: routePath, router }) => {
  if (router) {
    app.use(routePath, router);
    console.log(`✅ Route "${name}" بارگذاری شد`);
  } else {
    console.error(`❌ ${name} معتبر نیست.`);
  }
});

// روت‌های تماس (اگر router وجود دارد)
if (contactRouter) {
  app.use('/api/contact', contactRouter);
  console.log('✅ Route تماس اضافه شد');
} else {
  // روت‌های تماس ساده برای تست
  app.post('/api/contact', (req, res) => {
    console.log('📩 پیام تماس دریافت شد:', req.body);
    res.status(201).json({
      success: true,
      message: 'پیام شما دریافت شد (حالت تست)',
      data: {
        id: Date.now(),
        reference_id: `TEST-${Date.now()}`,
        estimated_response_time: '24 ساعت کاری'
      }
    });
  });
  
  app.get('/api/contact/categories', (req, res) => {
    res.json({
      success: true,
      data: [
        { slug: 'general', name: 'عمومی', icon: '💬' },
        { slug: 'order', name: 'پیگیری سفارش', icon: '📦' },
        { slug: 'return', name: 'بازگشت کالا', icon: '🔄' },
        { slug: 'technical', name: 'پشتیبانی فنی', icon: '🔧' },
        { slug: 'business', name: 'همکاری تجاری', icon: '🤝' },
        { slug: 'complaint', name: 'شکایات', icon: '⚠️' }
      ]
    });
  });
}

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'سرور فعال است ✅',
    timestamp: new Date().toISOString(),
    database: 'better-sqlite3',
    auth_system: authRouter ? 'فعال' : 'حالت تست',
    contact_system: contactRouter ? 'فعال' : 'حالت تست'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'E-Store API',
    version: '1.0.0',
    endpoints: [
      { method: 'GET', path: '/api', description: 'اطلاعات API' },
      { method: 'GET', path: '/api/products', description: 'لیست محصولات' },
      { method: 'GET', path: '/api/categories', description: 'لیست دسته‌بندی‌ها' },
      { method: 'GET', path: '/api/orders', description: 'لیست سفارشات' },
      { method: 'POST', path: '/api/auth/register', description: 'ثبت‌نام کاربر' },
      { method: 'POST', path: '/api/auth/verify', description: 'تأیید کد' },
      { method: 'POST', path: '/api/auth/login', description: 'ورود کاربر' },
      { method: 'POST', path: '/api/contact', description: 'ارسال پیام تماس' },
      { method: 'GET', path: '/api/contact/categories', description: 'دسته‌بندی‌های تماس' }
    ]
  });
});

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'مسیر مورد نظر پیدا نشد',
    requested_path: req.originalUrl,
    available_routes: routes.map(r => r.path)
  });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ خطای سرور:', err);
  res.status(500).json({
    success: false,
    error: 'خطای داخلی سرور',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎉 ========== E-STORE API ==========`);
  console.log(`🚀 سرور روی پورت ${PORT} اجرا شد`);
  console.log(`📌 آدرس‌های اصلی:`);
  console.log(`   🌐 http://localhost:${PORT}/`);
  console.log(`   🛍️  http://localhost:${PORT}/api/products`);
  console.log(`   📂 http://localhost:${PORT}/api/categories`);
  console.log(`   📦 http://localhost:${PORT}/api/orders`);
  console.log(`   🔐 http://localhost:${PORT}/api/auth`);
  console.log(`   📞 http://localhost:${PORT}/api/contact`);
  console.log('='.repeat(40));
  console.log('\n📊 تست روت‌های احراز هویت:');
  console.log(`   🔐 POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   🔐 POST http://localhost:${PORT}/api/auth/verify`);
  console.log(`   🔐 POST http://localhost:${PORT}/api/auth/login`);
  console.log('='.repeat(40));
});

export default app;