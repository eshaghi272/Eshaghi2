// src/components/auth/ChangePasswordForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ChangePasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.oldPassword) {
      newErrors.oldPassword = 'رمز عبور فعلی الزامی است';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'رمز عبور جدید الزامی است';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور جدید و تکرار آن مطابقت ندارند';
    }
    
    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'رمز عبور جدید باید با رمز قبلی متفاوت باشد';
    }
    
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await changePassword(formData.oldPassword, formData.newPassword);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      setSubmitError(error.message || 'خطا در تغییر رمز عبور. لطفا مجددا تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">رمز عبور با موفقیت تغییر کرد</h2>
            <p className="text-gray-600 mb-6">
              رمز عبور شما با موفقیت به‌روزرسانی شد. لطفا دفعات بعد از رمز عبور جدید استفاده کنید.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300"
            >
              بازگشت به پروفایل
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">تغییر رمز عبور</h1>
          <p className="text-gray-600 mt-2">لطفا رمز عبور جدید خود را وارد کنید</p>
        </div>
        
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{submitError}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور فعلی *
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors pr-12 ${
                    errors.oldPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                  dir="auto"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.oldPassword}</p>
              )}
            </div>
            
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور جدید *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors pr-12 ${
                    errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="حداقل ۶ کاراکتر"
                  dir="auto"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>
            
            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تکرار رمز عبور جدید *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors pr-12 ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="تکرار رمز عبور جدید"
                  dir="auto"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">الزامات رمز عبور:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className={`flex items-center gap-2 ${formData.newPassword.length >= 6 ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  حداقل ۶ کاراکتر
                </li>
                <li className={`flex items-center gap-2 ${formData.newPassword !== formData.oldPassword && formData.oldPassword ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.newPassword !== formData.oldPassword && formData.oldPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  متفاوت از رمز قبلی
                </li>
                <li className={`flex items-center gap-2 ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'text-green-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  مطابقت با تکرار رمز
                </li>
              </ul>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    در حال تغییر...
                  </div>
                ) : (
                  'تغییر رمز عبور'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>توصیه می‌شود رمز عبور قوی و منحصربه‌فرد انتخاب کنید.</p>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;