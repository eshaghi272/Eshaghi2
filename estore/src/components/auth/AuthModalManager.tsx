// src/components/auth/AuthModalManager.tsx
import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

interface AuthModalManagerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  fromCart?: boolean;
}

const AuthModalManager: React.FC<AuthModalManagerProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  fromCart = false
}) => {
  const [activeModal, setActiveModal] = useState<'login' | 'register'>(defaultTab);
  const [loginData, setLoginData] = useState<{identifier: string; method: 'phone' | 'nationalCode'} | null>(null);

  const handleOpenRegister = (identifier: string, method: 'phone' | 'nationalCode') => {
    setLoginData({ identifier, method });
    setActiveModal('register');
  };

  const handleCloseAll = () => {
    setActiveModal('login');
    setLoginData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {activeModal === 'login' ? (
        <LoginModal
          isOpen={true}
          onClose={handleCloseAll}
          fromCart={fromCart}
          onOpenRegister={handleOpenRegister}
        />
      ) : (
        <RegisterModal
          isOpen={true}
          onClose={handleCloseAll}
          fromCart={fromCart}
          initialPhone={loginData?.method === 'phone' ? loginData.identifier : ''}
          initialNationalCode={loginData?.method === 'nationalCode' ? loginData.identifier : ''}
        />
      )}
    </>
  );
};

export default AuthModalManager;