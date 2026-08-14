// Path: backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import siteRoutes from './routes/site.routes';
import doctorRoutes from './routes/doctor.routes';
import clinicRoutes from './routes/clinic.routes';
import serviceRoutes from './routes/service.routes';
import appointmentRoutes from './routes/appointment.routes';
import workingHoursRoutes from './routes/workingHours.routes';
import treatmentRoutes from './routes/treatment.routes';
import dashboardRoutes from './routes/dashboard.routes';
import inventoryRoutes from './routes/inventory.routes';
import contactRoutes from './routes/contact.routes';
import financialRoutes from './routes/financial.routes';
import galleryRoutes from './routes/gallery.routes';

dotenv.config();

const app = express();

// ===== تبدیل PORT به عدد =====
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// ============================================
// ===== تنظیمات CORS برای Render =====
// ============================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://eshaghi2.onrender.com',
  'https://beautyclinic.vercel.app',
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      console.log(`✅ CORS allowed: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked: ${origin}`);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// ============================================
// ===== Middleware =====
// ============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// ===== Routes =====
// ============================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/site', siteRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/clinics', clinicRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/working-hours', workingHoursRoutes);
app.use('/api/v1/treatments', treatmentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/financial', financialRoutes);
app.use('/api/v1/gallery', galleryRoutes);

// ============================================
// ===== Health Check =====
// ============================================
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// ===== Root =====
// ============================================
app.get('/', (_req, res) => {
  res.json({ 
    message: '💎 Beauty Clinic API is running on Render!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      doctors: '/api/v1/doctors',
      services: '/api/v1/services',
      appointments: '/api/v1/appointments',
      treatments: '/api/v1/treatments',
      dashboard: '/api/v1/dashboard',
      inventory: '/api/v1/inventory',
      contact: '/api/v1/contact',
      financial: '/api/v1/financial',
      gallery: '/api/v1/gallery'
    }
  });
});

// ============================================
// ===== 404 Handler =====
// ============================================
app.use((_req, res) => {
  res.status(404).json({ 
    message: 'مسیر مورد نظر یافت نشد',
    status: 404 
  });
});

// ============================================
// ===== Error Handler =====
// ============================================
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'خطای داخلی سرور',
    status: err.status || 500
  });
});

// ============================================
// ===== Start Server =====
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});