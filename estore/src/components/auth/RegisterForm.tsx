// src/pages/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  Hash, 
  Phone, 
  User, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  Loader2,
  Shield
} from 'lucide-react';
import axios from 'axios';

interface RegisterFormData {
  national_code: string;
  phone: string;
  full_name: string;
  email?: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    national_code: '',
    phone: '',
    full_name: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [userId, setUserId] = useState<number | null>(null);
  const [userPhone, setUserPhone] = useState<string>('');
  const [userNationalCode, setUserNationalCode] = useState<string>('');
  
  const navigate = useNavigate();
  const API_URL = 'http://localhost:3000/api/auth';

  // اعتبارسنجی فرم
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // اعتبارسنجی کد ملی
    if (!formData.national_code.trim()) {
      newErrors.national_code = 'کد ملی الزامی است';
    } else if (!/^\d{10}$/.test(formData.national_code)) {
      newErrors.national_code = 'کد ملی باید ۱۰ رقم باشد';
    }
    
    // اعتبارسنجی شماره تلفن
    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'شماره تلفن معتبر نیست (09123456789)';
    }
    
    // اعتبارسنجی نام کامل
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'نام کامل الزامی است';
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'نام کامل باید حداقل ۳ حرف باشد';
    }
    
    // اعتبارسنجی ایمیل (اختیاری)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // فقط اعداد برای کد ملی و تلفن
    if (['national_code', 'phone'].includes(name)) {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // پاک کردن خطا
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      const response = await axios.post(`${API_URL}/register`, formData);
      
      if (response.data.success) {
        setUserId(response.data.data.user_id);
        setUserPhone(formData.phone);
        setUserNationalCode(formData.national_code);
        setSubmitSuccess(response.data.message);
        setStep('verify');
        
        // نمایش کد تأیید برای تست
        alert(`کد تأیید (برای تست): ${response.data.data.verification_code}`);
      } else {
        setSubmitError(response.data.error || 'خطا در ثبت‌نام');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.error) {
        setSubmitError(error.response.data.error);
      } else if (error.response?.status === 400) {
        setSubmitError('اطلاعات وارد شده معتبر نیست');
      } else {
        setSubmitError('خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 4) {
      setSubmitError('کد تأیید باید ۴ رقم باشد');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await axios.post(`${API_URL}/verify`, {
        phone: userPhone,
        national_code: userNationalCode,
        verification_code: verificationCode
      });
      
      if (response.data.success) {
        setSubmitSuccess('حساب کاربری شما با موفقیت فعال شد!');
        
        // ذخیره توکن و اطلاعات کاربر
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        localStorage.setItem('current_user', response.data.data.full_name);
        
        // هدایت به صفحه اصلی بعد از 2 ثانیه
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setSubmitError(response.data.error || 'خطا در تأیید کد');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      if (error.response?.data?.error) {
        setSubmitError(error.response.data.error);
      } else {
        setSubmitError('خطا در تأیید کد. لطفا دوباره تلاش کنید.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!userPhone || !userNationalCode) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await axios.post(`${API_URL}/resend-code`, {
        phone: userPhone,
        national_code: userNationalCode
      });
      
      if (response.data.success) {
        setSubmitSuccess('کد جدید ارسال شد');
        alert(`کد جدید (برای تست): ${response.data.data.verification_code}`);
      } else {
        setSubmitError(response.data.error || 'خطا در ارسال مجدد کد');
      }
    } catch (error: any) {
      console.error('Resend code error:', error);
      setSubmitError('خطا در ارسال مجدد کد');
    } finally {
      setIsSubmitting(false);
    }
  };

  const maskPhone = (phone: string) => {
    if (phone.length === 11) {
      return `${phone.substring(0, 4)}***${phone.substring(7)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
            {step === 'register' ? (
              <UserPlus className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {step === 'register' ? 'ثبت‌نام جدید' : 'تأیید کد'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'register' 
              ? 'لطفا اطلاعات خود را وارد کنید'
              : `کد تأیید به شماره ${maskPhone(userPhone)} ارسال شد`}
          </p>
        </div>
        
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{submitError}</span>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{submitSuccess}</span>
              </div>
            </div>
          )}
          
          {step === 'register' ? (
            // Step 1: Registration Form
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* National Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    کد ملی *
                  </div>
                </label>
                <input
                  type="text"
                  name="national_code"
                  value={formData.national_code}
                  onChange={handleChange}
                  maxLength={10}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-center text-2xl tracking-widest ${
                    errors.national_code ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="۰۰۰۰۰۰۰۰۰۰"
                  dir="ltr"
                />
                {errors.national_code && (
                  <p className="mt-2 text-sm text-red-600">{errors.national_code}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    شماره تلفن *
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={11}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-center text-2xl tracking-widest ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    نام کامل *
                  </div>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                    errors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="نام و نام خانوادگی"
                  dir="auto"
                />
                {errors.full_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>
              
              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    ایمیل (اختیاری)
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="example@email.com"
                  dir="ltr"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Terms */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  با{' '}
                  <a href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                    شرایط استفاده
                  </a>
                  {' '}و{' '}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                    حریم خصوصی
                  </a>
                  {' '}موافقت می‌کنم
                </label>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    در حال پردازش...
                  </div>
                ) : (
                  'ثبت اطلاعات و دریافت کد تأیید'
                )}
              </button>
            </form>
          ) : (
            // Step 2: Verification Form
            <div className="space-y-5">
              {/* User Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">{formData.full_name}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      شماره: {maskPhone(userPhone)} | کد ملی: {userNationalCode}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Verification Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کد ۴ رقمی تأیید *
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setVerificationCode(value);
                    setSubmitError('');
                  }}
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-center text-3xl tracking-widest font-bold"
                  placeholder="ـــ  ـــ  ـــ  ـــ"
                  dir="ltr"
                  autoFocus
                />
                <p className="mt-2 text-sm text-gray-500">
                  کد ۴ رقمی ارسال شده به شماره شما را وارد کنید
                </p>
              </div>
              
              {/* Resend Code */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                >
                  ارسال مجدد کد
                </button>
              </div>
              
              {/* Verify Button */}
              <button
                onClick={handleVerifyCode}
                disabled={isSubmitting || verificationCode.length !== 4}
                className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    در حال تأیید...
                  </div>
                ) : (
                  'تأیید کد و فعال‌سازی حساب'
                )}
              </button>
              
              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setStep('register');
                  setSubmitError('');
                  setSubmitSuccess('');
                  setVerificationCode('');
                }}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-medium py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت و ویرایش اطلاعات
              </button>
            </div>
          )}
          
          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <Link
                to="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                قبلاً ثبت‌نام کرده‌اید؟ ورود
              </Link>
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-800"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
        
        {/* Info Box */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">روند ثبت‌نام:</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal pr-5">
            <li>ورود کد ملی و شماره تلفن معتبر</li>
            <li>تأیید اطلاعات و ذخیره در دیتابیس</li>
            <li>دریافت کد ۴ رقمی از طریق پیامک</li>
            <li>ورود کد و تکمیل ثبت‌نام</li>
            <li>ورود خودکار به سیستم</li>
          </ol>
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-600">
              💡 کد تأیید برای تست در پیام alert نمایش داده می‌شود
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;