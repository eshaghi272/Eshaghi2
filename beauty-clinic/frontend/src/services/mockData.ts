// Path: frontend/src/services/mockData.ts
import { getTodayPersian } from '../utils/persianDate'

export interface User {
  id: number
  full_name: string
  national_code: string
  mobile: string
  email: string | null
  role: string
  is_active: boolean
}

export interface Service {
  id: number
  name: string
  description: string | null
  price: number
  duration_minutes: number
  category: string | null
  is_active: boolean
}

export interface Doctor {
  id: number
  user_id: number
  specialty: string
  biography: string | null
  experience_years: number
  consultation_fee: number
  rating: number
  user?: User
}

export interface Appointment {
  id: number
  patient_id: number
  doctor_id: number
  service_id: number
  fdate: string
  appointment_time: string
  status: string
  notes: string | null
  service?: Service
  doctor?: Doctor
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    full_name: 'مدیر سیستم',
    national_code: '1234567890',
    mobile: '09120000001',
    email: 'admin@clinic.com',
    role: 'admin',
    is_active: true
  },
  {
    id: 2,
    full_name: 'دکتر علی محمدی',
    national_code: '1234567891',
    mobile: '09120000002',
    email: 'dr.mohammadi@clinic.com',
    role: 'doctor',
    is_active: true
  },
  {
    id: 3,
    full_name: 'دکتر سارا احمدی',
    national_code: '1234567892',
    mobile: '09120000003',
    email: 'dr.ahmadi@clinic.com',
    role: 'doctor',
    is_active: true
  },
  {
    id: 4,
    full_name: 'دکتر رضا کریمی',
    national_code: '1234567893',
    mobile: '09120000004',
    email: 'dr.karimi@clinic.com',
    role: 'doctor',
    is_active: true
  },
  {
    id: 5,
    full_name: 'دکتر نرگس حسینی',
    national_code: '1234567894',
    mobile: '09120000005',
    email: 'dr.hosseini@clinic.com',
    role: 'doctor',
    is_active: true
  },
  {
    id: 6,
    full_name: 'احمد رضایی',
    national_code: '1234567895',
    mobile: '09120000006',
    email: null,
    role: 'patient',
    is_active: true
  },
  {
    id: 7,
    full_name: 'مریم کریمی',
    national_code: '1234567896',
    mobile: '09120000007',
    email: null,
    role: 'patient',
    is_active: true
  },
  {
    id: 8,
    full_name: 'حسین موسوی',
    national_code: '1234567897',
    mobile: '09120000008',
    email: null,
    role: 'patient',
    is_active: true
  }
]

// Mock Services
export const mockServices: Service[] = [
  {
    id: 1,
    name: 'بوتاکس',
    description: 'رفع چین و چروک صورت',
    price: 5000000,
    duration_minutes: 30,
    category: 'تزریقات',
    is_active: true
  },
  {
    id: 2,
    name: 'فیلر',
    description: 'پر کردن خطوط صورت و لب',
    price: 3000000,
    duration_minutes: 20,
    category: 'تزریقات',
    is_active: true
  },
  {
    id: 3,
    name: 'لیزر موهای زائد',
    description: 'حذف دائمی موهای زائد',
    price: 2000000,
    duration_minutes: 45,
    category: 'لیزر',
    is_active: true
  },
  {
    id: 4,
    name: 'مزوتراپی',
    description: 'درمان پوست با مزوتراپی',
    price: 2500000,
    duration_minutes: 35,
    category: 'پوست',
    is_active: true
  },
  {
    id: 5,
    name: 'کربوکسی تراپی',
    description: 'درمان پوست با CO2',
    price: 1500000,
    duration_minutes: 25,
    category: 'پوست',
    is_active: true
  },
  {
    id: 6,
    name: 'هایفو',
    description: 'لیفت صورت با امواج اولتراسوند',
    price: 4000000,
    duration_minutes: 40,
    category: 'لیفتینگ',
    is_active: true
  },
  {
    id: 7,
    name: 'ژل لب',
    description: 'پر کردن لب با ژل',
    price: 2500000,
    duration_minutes: 20,
    category: 'تزریقات',
    is_active: true
  },
  {
    id: 8,
    name: 'کاشت مو',
    description: 'کاشت موی طبیعی',
    price: 8000000,
    duration_minutes: 180,
    category: 'مو',
    is_active: true
  }
]

// Mock Doctors (with user data)
export const mockDoctors: Doctor[] = [
  {
    id: 1,
    user_id: 2,
    specialty: 'پوست و مو',
    biography: 'متخصص پوست و مو با ۱۵ سال سابقه',
    experience_years: 15,
    consultation_fee: 250000,
    rating: 4.8,
    user: mockUsers[1]
  },
  {
    id: 2,
    user_id: 3,
    specialty: 'زیبایی',
    biography: 'متخصص زیبایی و لیزر با ۱۰ سال سابقه',
    experience_years: 10,
    consultation_fee: 300000,
    rating: 4.9,
    user: mockUsers[2]
  },
  {
    id: 3,
    user_id: 4,
    specialty: 'پوست',
    biography: 'متخصص پوست با ۸ سال سابقه',
    experience_years: 8,
    consultation_fee: 200000,
    rating: 4.7,
    user: mockUsers[3]
  },
  {
    id: 4,
    user_id: 5,
    specialty: 'مو',
    biography: 'متخصص مو و ترمیم مو با ۱۲ سال سابقه',
    experience_years: 12,
    consultation_fee: 280000,
    rating: 4.6,
    user: mockUsers[4]
  }
]

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    patient_id: 6,
    doctor_id: 1,
    service_id: 1,
    fdate: getTodayPersian(),
    appointment_time: '10:00',
    status: 'confirmed',
    notes: 'اولین جلسه',
    service: mockServices[0],
    doctor: mockDoctors[0]
  },
  {
    id: 2,
    patient_id: 6,
    doctor_id: 2,
    service_id: 2,
    fdate: getTodayPersian(),
    appointment_time: '14:30',
    status: 'pending',
    notes: null,
    service: mockServices[1],
    doctor: mockDoctors[1]
  },
  {
    id: 3,
    patient_id: 6,
    doctor_id: 3,
    service_id: 3,
    fdate: '14030515',
    appointment_time: '09:00',
    status: 'confirmed',
    notes: 'جلسه دوم',
    service: mockServices[2],
    doctor: mockDoctors[2]
  },
  {
    id: 4,
    patient_id: 6,
    doctor_id: 4,
    service_id: 4,
    fdate: '14030520',
    appointment_time: '16:00',
    status: 'completed',
    notes: 'انجام شد',
    service: mockServices[3],
    doctor: mockDoctors[3]
  },
  {
    id: 5,
    patient_id: 6,
    doctor_id: 1,
    service_id: 6,
    fdate: '14030425',
    appointment_time: '11:30',
    status: 'cancelled',
    notes: 'لغو شد',
    service: mockServices[5],
    doctor: mockDoctors[0]
  }
]

// Mock Dashboard Stats
export const mockDashboardStats = {
  total_patients: 10,
  today_appointments: 2,
  monthly_revenue: 12500000,
  month: 3,
  year: 1403
}

// Available slots for a doctor on a specific date
export const getAvailableSlots = (doctorId: number, date: string): string[] => {
  const allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ]
  
  // Get booked slots for this doctor and date
  const bookedSlots = mockAppointments
    .filter(a => a.doctor_id === doctorId && a.fdate === date && a.status !== 'cancelled')
    .map(a => a.appointment_time)
  
  // Return available slots
  return allSlots.filter(slot => !bookedSlots.includes(slot))
}