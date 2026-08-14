// Path: backend/src/server.ts
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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Clinic Beauty API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});