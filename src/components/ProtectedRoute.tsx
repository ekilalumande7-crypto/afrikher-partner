import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  // Auth is disabled for now, always allow access
  return <>{children}</>;
}
