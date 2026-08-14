import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';

const CustomerSwitch: React.FC = () => {
  const { user, logout, switchToGuest } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  const handleSwitchCustomer = () => {
    // پاک کردن مشتری قبلی و رفتن به صفحه ورود
    switchToGuest();
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
      >
        <User size={18} />
        <span>تغییر مشتری</span>
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <User className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">تغییر مشتری</h3>
                <p className="text-gray-600 text-sm">آیا می‌خواهید مشتری فعلی را تغییر دهید؟</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">
                    {user.full_name?.charAt(0) || 'م'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{user.full_name}</p>
                  <p className="text-sm text-gray-500">{user.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <LogOut size={20} className="text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">توجه مهم</p>
                  <p className="text-sm text-red-600">
                    با تغییر مشتری، سفارش فعلی برای مشتری جدید ثبت خواهد شد و اطلاعات مشتری قبلی پاک می‌شود.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleSwitchCustomer}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                تغییر مشتری
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerSwitch;