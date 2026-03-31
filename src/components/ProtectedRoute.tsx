import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, profile, loading, role, isValidated } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-brand-black/60">Chargement...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user || !profile) {
    return <Navigate to="/partner/login" state={{ from: location }} replace />;
  }

  // Require specific role (e.g., 'partner')
  if (requiredRole && role !== requiredRole) {
    // If pending_partner trying to access partner routes, redirect to pending
    if (role === 'pending_partner') {
      return <Navigate to="/partner/pending" replace />;
    }

    // If rejected_partner, redirect to rejected page
    if (role === 'rejected_partner') {
      return <Navigate to="/partner/rejected" replace />;
    }

    // Any other role mismatch, redirect to login
    return <Navigate to="/partner/login" replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
}
