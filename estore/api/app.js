import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import db from './db.js';

import authRouter from './routes/auth.routes.js';
import patientRouter from './routes/patient.routes.js';
import visitRouter from './routes/visit.routes.js';
import patientIdRoutes from './routes/patient-id.routes.js';

import { createDashboardRouter } from './routes/dashboard.routes.js';
import { createUserRouter } from './routes/user.routes.js';
import { report } from 'process';
dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev'));

function assertRouter(name, router) {
  if (!router || typeof router.handle !== 'function') {
    console.error(`❌ ${name} معتبر نیست.`, router);
    process.exit(1);
  }
  console.log(`📌 Mounted [${name}]`);
  return router;
}

const staticRoutes = [
  ['insuranceRoutes', '/api/insurances', './routes/insurance.routes.js'],
  ['serviceRoutes', '/api/services', './routes/service.routes.js'],
  ['doctorRoutes', '/api/doctors', './routes/doctor.routes.js'],
  ['scheduleRoutes', '/api/schedules', './routes/schedule.routes.js'],
  ['appointmentRoutes', '/api/appointments', './routes/appointment.routes.js'],
  ['slotRoutes', '/api/slots', './routes/slot.routes.js'],
  ['medicalrecordsRoutes', '/api/medicalrecords', './routes/medicalrecord.routes.js'],
  ['drugRoutes', '/api/drugs', './routes/drugs.routes.js'],
  ['testRoutes', '/api/tests', './routes/test.routes.js'],
  ['symptomRoutes', '/api/symptoms', './routes/symptoms.routes.js'],
  ['frequentRoutes', '/api', './routes/frequent.routes.js'],
  ['chatRoutes', '/api/chat', './routes/chat.routes.js'],
  ['vitalsRoutes', '/api/vitals', './routes/vitals.routes.js'],
  ['historyRoutes', '/api/history', './routes/history.routes.js'],
  ['imagingRoutes', '/api/imaging', './routes/imaging.routes.js'],
  ['contactRoutes', '/api/contact', './routes/contact.routes.js'],
  ['uiRoutes', '/api/ui', './routes/ui.routes.js'],
  ['patientSummaryRoutes', '/api/patient-summary', './routes/patientSummary.routes.js'],
  ['diseasesRoutes', '/api/diseases', './routes/diseases.routes.js'],
  ['clinicsRoutes', '/api/clinics', './routes/clinic.routes.js'],
  ['consultationsRoutes', '/api/consultations', './routes/consultations.routes.js'],
  ['reportsRoutes', '/api/reports', './routes/reports.routes.js']
];

async function mountRoutes() {
  // Mount dynamic routes
  for (const [name, mountPath, file] of staticRoutes) {
    const mod = await import(file);
    const router = mod.default || mod.router || mod;
    app.use(mountPath, assertRouter(name, router));
  }

  // ✅ اصلاح: انتقال route بررسی کد ملی به مسیر صحیح
  // Mount auth routes در مسیر صحیح
  app.use('/api/auth', assertRouter('authRouter', authRouter));
  app.use('/api/patients', assertRouter('patientRouter', patientRouter));
  app.use('/api/visits', assertRouter('visitRouter', visitRouter));
  app.use('/api/patient-id', assertRouter('patientIdRoutes', patientIdRoutes));

  // Mount factory routers
  app.use('/api/users', assertRouter('userRouter', createUserRouter(db)));
  app.use('/api/dashboard', assertRouter('dashboardRouter', createDashboardRouter(db)));

  // Default routes
  app.get('/', (_, res) => res.send('سرور فعال است ✅'));
  app.use((_, res) => res.status(404).send('مسیر مورد نظر پیدا نشد ❌'));
}

await mountRoutes();

export default app;