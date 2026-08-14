// src/components/auth/LoginModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  Smartphone,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Key,
  X,
  Mail,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromCart?: boolean;
  onOpenRegister?: (identifier: string, method: 'phone' | 'nationalCode') => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  fromCart = false,
  onOpenRegister 
}) => {
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(120);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'nationalCode'>('phone');
  const [currentIdentifier, setCurrentIdentifier] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const { login, isAuthenticated } = useAuth();

  // تایمر برای کد تأیید
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // بستن مودال وقتی کاربر لاگین کرد
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      setTimeout(() => {
        onClose();
        if (fromCart) {
          window.location.reload();
        }
      }, 1000);
    }
  }, [isAuthenticated, isOpen, onClose, fromCart]);

  // بستن مودال با Escape
  useEffect(() => {
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

  // اعتبارسنجی شماره موبایل
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  // اعتبارسنجی کد ملی
  const validateNationalCode = (code: string): boolean => {
    if (code.length !== 10) return false;
    
    // الگوریتم ساده اعتبارسنجی کد ملی
    const sum = code.split('').slice(0, 9).reduce((acc, digit, index) => {
      return acc + (parseInt(digit) * (10 - index));
    }, 0);
    
    const remainder = sum % 11;
    const lastDigit = parseInt(code[9]);
    
    return (remainder < 2 && lastDigit === remainder) || 
           (remainder >= 2 && lastDigit === 11 - remainder);
  };

  // اعتبارسنجی کد تأیید
  const validateVerificationCode = (code: string): boolean => {
    return /^\d{4}$/.test(code);
  };

  // ارسال کد تأیید
  const handleSendCode = async () => {
    setError('');
    setSuccess('');

    const identifier = loginMethod === 'phone' ? phoneNumber : nationalCode;
    setCurrentIdentifier(identifier);
    
    // اعتبارسنجی ورودی
    if (loginMethod === 'phone' && !validatePhoneNumber(phoneNumber)) {
      setError('شماره موبایل معتبر نیست (فرمت: 09123456789)');
      return;
    }

    if (loginMethod === 'nationalCode' && !validateNationalCode(nationalCode)) {
      setError('کد ملی معتبر نیست');
      return;
    }

    setIsLoading(true);

    try {
      // شبیه‌سازی بررسی کاربر در دیتابیس
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // لیست کاربران موجود در دیتابیس (برای تست)
      const existingUsers = [
        { phone: '09120000001', national_code: '0012345678' },
        { phone: '09121234567', national_code: '0023456789' },
        { phone: '09112582972', national_code: '2142367364' },
        { phone: '09112582971', national_code: '2142367321' },
        { phone: '09117833992', national_code: '2130420303' },
        { phone: '09131234567', national_code: '0067890123' }
      ];

      let userExists = false;
      if (loginMethod === 'phone') {
        userExists = existingUsers.some(user => user.phone === identifier);
      } else {
        userExists = existingUsers.some(user => user.national_code === identifier);
      }

      if (!userExists) {
        // کاربر جدید - باز کردن مودال ثبت‌نام
        setError('');
        setSuccess('کاربر جدید شناسایی شد. در حال هدایت به ثبت‌نام...');
        
        setTimeout(() => {
          onClose(); // بستن مودال لاگین
          if (onOpenRegister) {
            onOpenRegister(identifier, loginMethod); // باز کردن مودال ثبت‌نام
          }
        }, 1500);
        return;
      }
      
      // کاربر موجود - تولید و نمایش کد تأیید
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code);
      
      setSuccess(`کد تأیید تولید شد: ${code}`);
      setStep('verify');
      setTimer(120);
      
    } catch (err: any) {
      setError('خطا در ارسال کد تأیید. لطفا مجددا تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  // تأیید کد و لاگین
  const handleVerifyCode = async () => {
    setError('');
    setSuccess('');

    if (!validateVerificationCode(verificationCode)) {
      setError('کد تأیید باید ۴ رقم باشد');
      return;
    }

    if (verificationCode !== generatedCode) {
      setError('کد تأیید اشتباه است');
      return;
    }

    setIsLoading(true);

    try {
      // شبیه‌سازی تأیید کد
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // ایجاد اطلاعات کاربر بر اساس شناسه
      let mockUser;
      const existingUsers = [
        { phone: '09120000001', national_code: '0012345678', full_name: 'مدیر فروشگاه' },
        { phone: '09121234567', national_code: '0023456789', full_name: 'علی محمدی' },
        { phone: '09112582972', national_code: '2142367364', full_name: 'حسن اسحقی' },
        { phone: '09112582971', national_code: '2142367321', full_name: 'علی رحمتی' },
        { phone: '09117833992', national_code: '2130420303', full_name: 'مونا اسحقی' },
        { phone: '09131234567', national_code: '0067890123', full_name: 'محمد حسینی' }
      ];

      let foundUser;
      if (loginMethod === 'phone') {
        foundUser = existingUsers.find(user => user.phone === currentIdentifier);
      } else {
        foundUser = existingUsers.find(user => user.national_code === currentIdentifier);
      }

      mockUser = {
        id: Date.now(),
        phone: currentIdentifier,
        full_name: foundUser?.full_name || 'کاربر',
        national_code: foundUser?.national_code || '0012345678',
        is_verified: 1
      };
      
      const token = `token-${currentIdentifier}-${Date.now()}`;
      
      const loginResult = await login({
        token,
        user: mockUser
      });
      
      if (loginResult.success) {
        setSuccess('ورود موفقیت‌آمیز بود!');
      } else {
        setError('خطا در ورود به سیستم');
      }
    } catch (err: any) {
      setError('خطا در تأیید کد. لطفا مجددا تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  // ارسال مجدد کد
  const handleResendCode = async () => {
    if (timer > 0) return;
    
    setIsResending(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // تولید کد جدید
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(newCode);
      
      setSuccess(`کد جدید تولید شد: ${newCode}`);
      setTimer(120);
      setVerificationCode('');
      
    } catch (err) {
      setError('خطا در ارسال مجدد کد');
    } finally {
      setIsResending(false);
    }
  };

  // بازگشت به مرحله اول
  const handleBackToInput = () => {
    setStep('input');
    setError('');
    setSuccess('');
    setVerificationCode('');
    setTimer(120);
    setGeneratedCode('');
  };

  // فرمت زمان
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // باز کردن مودال ثبت‌نام
  const handleOpenRegisterModal = () => {
    onClose();
    if (onOpenRegister) {
      const identifier = loginMethod === 'phone' ? phoneNumber : nationalCode;
      onOpenRegister(identifier, loginMethod);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
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
                {step === 'input' ? (
                  <Key className="h-6 w-6 text-blue-600" />
                ) : (
                  <Key className="h-6 w-6 text-green-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
                {step === 'input' ? 'ورود / ثبت‌نام' : 'تأیید کد'}
              </h3>
              <p className="text-sm text-gray-500">
                {step === 'input' 
                  ? 'شماره موبایل یا کد ملی خود را وارد کنید'
                  : 'کد ۴ رقمی ارسال شده را وارد کنید'}
              </p>
              
              {fromCart && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    برای تکمیل خرید نیاز به ورود دارید
                  </p>
                </div>
              )}
            </div>

            {step === 'input' ? (
              /* مرحله اول: ورود اطلاعات */
              <div className="mt-6">
                {/* انتخاب روش */}
                <div className="flex border-b mb-6">
                  <button
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-3 text-center font-medium text-sm ${
                      loginMethod === 'phone'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 inline ml-2" />
                    موبایل
                  </button>
                  <button
                    onClick={() => setLoginMethod('nationalCode')}
                    className={`flex-1 py-3 text-center font-medium text-sm ${
                      loginMethod === 'nationalCode'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User className="w-4 h-4 inline ml-2" />
                    کد ملی
                  </button>
                </div>

                {/* فیلد ورود */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {loginMethod === 'phone' ? 'شماره موبایل' : 'کد ملی'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {loginMethod === 'phone' ? (
                        <Smartphone className="h-5 w-5 text-gray-400" />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <input
                      type={loginMethod === 'phone' ? 'tel' : 'text'}
                      value={loginMethod === 'phone' ? phoneNumber : nationalCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (loginMethod === 'phone') {
                          if (value.length <= 11) setPhoneNumber(value);
                        } else {
                          if (value.length <= 10) setNationalCode(value);
                        }
                      }}
                      placeholder={
                        loginMethod === 'phone' 
                          ? '09123456789' 
                          : '0012345678'
                      }
                      className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                      maxLength={loginMethod === 'phone' ? 11 : 10}
                      dir="ltr"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {loginMethod === 'phone' 
                      ? 'کد تأیید به این شماره ارسال خواهد شد'
                      : 'کد ملی ۱۰ رقمی خود را وارد کنید'}
                  </p>
                </div>

                {/* پیام خطا */}
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 ml-2 flex-shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* پیام موفقیت */}
                {success && (
                  <div className="mb-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 ml-2 flex-shrink-0" />
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                )}

                {/* دکمه ادامه */}
                <button
                  onClick={handleSendCode}
                  disabled={isLoading || 
                    (loginMethod === 'phone' && phoneNumber.length !== 11) || 
                    (loginMethod === 'nationalCode' && nationalCode.length !== 10)}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin ml-2" />
                      در حال بررسی...
                    </>
                  ) : (
                    'ادامه'
                  )}
                </button>

                {/* دکمه ثبت‌نام مستقیم */}
                <button
                  onClick={handleOpenRegisterModal}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <User className="w-4 h-4 ml-2" />
                  ثبت‌نام جدید
                </button>
              </div>
            ) : (
              /* مرحله دوم: تأیید کد */
              <div className="mt-6">
                {/* نمایش کد تأیید */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      کد تأیید برای تست:
                    </p>
                    <div className="text-2xl font-bold text-blue-900 bg-white py-2 px-4 rounded border border-blue-300 inline-block">
                      {generatedCode}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      این کد فقط برای تست نمایش داده می‌شود
                    </p>
                  </div>
                </div>

                {/* فیلد کد تأیید */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    کد ۴ رقمی تأیید
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setVerificationCode(value);
                      }}
                      placeholder="1234"
                      className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
                      maxLength={4}
                      dir="ltr"
                    />
                  </div>
                  
                  {/* زمان باقی‌مانده */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className={`h-4 w-4 ml-1 ${timer > 30 ? 'text-green-500' : timer > 10 ? 'text-yellow-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-medium ${timer > 30 ? 'text-green-600' : timer > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {formatTime(timer)} باقی‌مانده
                      </span>
                    </div>
                    
                    {/* دکمه ارسال مجدد */}
                    <button
                      onClick={handleResendCode}
                      disabled={timer > 0 || isResending}
                      className={`text-sm font-medium flex items-center ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-500'}`}
                    >
                      <RefreshCw className={`h-4 w-4 ml-1 ${isResending ? 'animate-spin' : ''}`} />
                      {isResending ? 'در حال ارسال...' : 'ارسال مجدد کد'}
                    </button>
                  </div>
                </div>

                {/* پیام خطا */}
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 ml-2 flex-shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* پیام موفقیت */}
                {success && (
                  <div className="mb-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 ml-2 flex-shrink-0" />
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                )}

                {/* دکمه‌ها */}
                <div className="space-y-3">
                  <button
                    onClick={handleVerifyCode}
                    disabled={isLoading || verificationCode.length !== 4}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin ml-2" />
                        در حال تأیید...
                      </>
                    ) : (
                      fromCart ? 'تأیید و تکمیل خرید' : 'تأیید و ورود'
                    )}
                  </button>

                  <button
                    onClick={handleBackToInput}
                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    بازگشت و ویرایش اطلاعات
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;