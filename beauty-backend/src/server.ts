// Path: beauty-backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
const PORT = parseInt(process.env.PORT || '10000', 10);

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

app.get('/', (_req, res) => {
  res.json({ 
    message: '💎 Beauty Clinic API is running on Render!',
    version: '1.0.0',
    port: PORT
  });
});

app.use((_req, res) => {
  res.status(404).json({ message: 'مسیر مورد نظر یافت نشد' });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'خطای داخلی سرور'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});