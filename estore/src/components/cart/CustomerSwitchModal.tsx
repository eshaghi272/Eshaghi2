// src/components/cart/CustomerSwitchModal.tsx
import React from 'react';
import { UserCog, AlertTriangle, ShoppingCart } from 'lucide-react';

interface CustomerSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: any;
}

const CustomerSwitchModal: React.FC<CustomerSwitchModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  user 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl">
              <UserCog className="text-amber-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">تغییر مشتری</h3>
              <p className="text-gray-600 text-sm mt-1">آیا می‌خواهید مشتری فعلی را تغییر دهید؟</p>
            </div>
          </div>

          {/* اطلاعات کاربر فعلی */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {user.full_name?.charAt(0) || user.username?.charAt(0) || 'م'}
                </span>
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-900">{user.full_name || user.username}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.phone && (
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                      📞 {user.phone}
                    </span>
                  )}
                  {user.email && (
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                      ✉️ {user.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* هشدارها */}
          <div className="space-y-3 mb-8">
            <WarningSection />
            <CartPreservationSection />
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 active:scale-95"
            >
              انصراف
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <UserCog className="w-5 h-5" />
              تغییر مشتری
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WarningSection: React.FC = () => (
  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-red-800 mb-2">توجه مهم</p>
      <ul className="text-sm text-red-700 list-disc pr-5 space-y-1">
        <li>اطلاعات مشتری فعلی حذف خواهد شد</li>
        <li>سبد خرید شما ذخیره می‌شود</li>
        <li>به صفحه ورود منتقل خواهید شد</li>
        <li>برای بازگشت باید مجددا وارد شوید</li>
      </ul>
    </div>
  </div>
);

const CartPreservationSection: React.FC = () => (
  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
    <ShoppingCart className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-blue-800 mb-1">سبد خرید شما حفظ می‌شود</p>
      <p className="text-sm text-blue-700">
        محصولات انتخابی شما ذخیره خواهند شد و می‌توانید بعد از ورود مجدد مشاهده کنید.
      </p>
    </div>
  </div>
);

export default CustomerSwitchModal;