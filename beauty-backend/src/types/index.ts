// Path: backend/src/types/index.ts
export interface Clinic {
  id: number;
  clinicName: string;
  clinicCode: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  managerName: string;
  managerPhone: string;
  logo: string;
  description: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  clinicId: number;
  fullName: string;
  nationalCode: string;
  mobile: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: number;
  clinicId: number;
  userId: number;
  specialty: string;
  biography: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  createdAt: string;
}

export interface Appointment {
  id: number;
  clinicId: number;
  patientId: number;
  doctorId: number;
  serviceId: number;
  fdate: string;
  appointmentTime: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: number;
  clinicId: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  imageUrl: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: number;
  clinicId: number;
  patientId: number;
  doctorId: number;
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  discountAmount: number;
  discountPercent: number;
  finalPrice: number;
  description: string;
  status: string;
  totalMaterialsCost: number;
  totalMedicinesCost: number;
  totalExtraCosts: number;
  doctorWage: number;
  clinicProfit: number;
  finalTotal: number;
  paymentStatus: string;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: string;
  appointmentId: number;
  performedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentItem {
  id: number;
  clinicId: number;
  treatmentId: number;
  itemType: 'material' | 'medicine';
  itemId: number;
  itemName: string;
  unit: string;
  quantityUsed: number;
  pricePerUnit: number;
  totalPrice: number;
  dosage: string;
  instructions: string;
  createdAt: string;
}

export interface TreatmentExtraCost {
  id: number;
  clinicId: number;
  treatmentId: number;
  description: string;
  amount: number;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  clinicId: number;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  order: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: number;
  clinicId: number;
  productName: string;
  category: string;
  quantity: number;
  minThreshold: number;
  unitPrice: number;
  supplier: string;
  fdate: string;
  lastUpdated: string;
}

export interface WorkingHours {
  id: number;
  clinicId: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}