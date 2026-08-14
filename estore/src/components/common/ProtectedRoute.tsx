// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<Props> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const location = useLocation();
  const isAuthenticated = false; // TODO: Replace with your auth logic

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};