// src/components/auth/RegisterModal.tsx
import { useState, useEffect } from 'react'; // تغییر این خط
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
  Shield,
  X
} from 'lucide-react';
import axios from 'axios';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromCart?: boolean;
  initialPhone?: string;
  initialNationalCode?: string;
}

interface RegisterFormData {
  national_code: string;
  phone: string;
  full_name: string;
  email?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  fromCart = false,
  initialPhone = '',
  initialNationalCode = ''
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    national_code: initialNationalCode || '',
    phone: initialPhone || '',
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
  
  const API_URL = 'http://localhost:3000/api/auth';

  // بستن مودال با Escape
  useEffect(() => { // تغییر این خط
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.national_code.trim()) {
      newErrors.national_code = 'کد ملی الزامی است';
    } else if (!/^\d{10}$/.test(formData.national_code)) {
      newErrors.national_code = 'کد ملی باید ۱۰ رقم باشد';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'شماره تلفن معتبر نیست (09123456789)';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'نام کامل الزامی است';
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'نام کامل باید حداقل ۳ حرف باشد';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (['national_code', 'phone'].includes(name)) {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // برای TypeScript ایمن‌تر
    if (errors[name as keyof typeof errors]) {
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
        phone: formData.phone,
        national_code: formData.national_code,
        verification_code: verificationCode
      });
      
      if (response.data.success) {
        setSubmitSuccess('حساب کاربری شما با موفقیت فعال شد!');
        
        // ذخیره اطلاعات کاربر در localStorage
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        localStorage.setItem('current_user', response.data.data.full_name);
        
        // بستن مودال بعد از 2 ثانیه
        setTimeout(() => {
          onClose();
          if (fromCart) {
            window.location.reload(); // رفرش صفحه برای آپدیت وضعیت
          }
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
    if (!formData.phone || !formData.national_code) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await axios.post(`${API_URL}/resend-code`, {
        phone: formData.phone,
        national_code: formData.national_code
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

  const handleBackToRegister = () => {
    setStep('register');
    setSubmitError('');
    setSubmitSuccess('');
    setVerificationCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                {step === 'register' ? (
                  <UserPlus className="h-6 w-6 text-blue-600" />
                ) : (
                  <Shield className="h-6 w-6 text-green-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
                {step === 'register' ? 'ثبت‌نام جدید' : 'تأیید کد'}
              </h3>
              <p className="text-sm text-gray-500">
                {step === 'register' 
                  ? 'لطفا اطلاعات خود را وارد کنید'
                  : `کد تأیید به شماره ${maskPhone(formData.phone)} ارسال شد`}
              </p>
              
              {fromCart && step === 'register' && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    برای تکمیل خرید نیاز به ثبت‌نام دارید
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 ml-2 flex-shrink-0" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            )}
            
            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400 ml-2 flex-shrink-0" />
                  <p className="text-sm text-green-700">{submitSuccess}</p>
                </div>
              </div>
            )}

            {step === 'register' ? (
              // Step 1: Registration Form
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className={`block w-full rounded-md border ${
                      errors.national_code ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } py-3 px-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest`}
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
                    className={`block w-full rounded-md border ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } py-3 px-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest`}
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
                    className={`block w-full rounded-md border ${
                      errors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } py-3 px-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                    className={`block w-full rounded-md border ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } py-3 px-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin ml-2" />
                      در حال پردازش...
                    </>
                  ) : (
                    'ثبت اطلاعات و دریافت کد تأیید'
                  )}
                </button>
              </form>
            ) : (
              // Step 2: Verification Form
              <div className="space-y-4">
                {/* User Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">{formData.full_name}</p>
                      <p className="text-sm text-blue-700 mt-1">
                        شماره: {maskPhone(formData.phone)} | کد ملی: {formData.national_code}
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
                    className="block w-full rounded-md border border-gray-300 py-3 px-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-bold"
                    placeholder="1234"
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
                    className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 text-sm"
                  >
                    ارسال مجدد کد
                  </button>
                </div>
                
                {/* Verify Button */}
                <button
                  onClick={handleVerifyCode}
                  disabled={isSubmitting || verificationCode.length !== 4}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin ml-2" />
                      در حال تأیید...
                    </>
                  ) : (
                    'تأیید کد و فعال‌سازی حساب'
                  )}
                </button>
                
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBackToRegister}
                  className="w-full flex justify-center items-center gap-2 text-gray-600 hover:text-gray-800 font-medium py-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  بازگشت و ویرایش اطلاعات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;