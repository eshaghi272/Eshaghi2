// Path: frontend/src/config/api.ts

// ===== دریافت URL از محیط =====
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ===== تنظیمات Axios =====
export const API_CONFIG = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
}

// ===== تابع برای بررسی محیط =====
export const isProduction = import.meta.env.PROD
export const isDevelopment = import.meta.env.DEV

export default API_CONFIG