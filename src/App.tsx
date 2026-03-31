import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PartnerLayout } from './components/PartnerLayout';
import { PartnerLogin } from './pages/PartnerLogin';
import { PartnerRegister } from './pages/PartnerRegister';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { PartnerContentList } from './pages/PartnerContentList';
import { PartnerContentNew } from './pages/PartnerContentNew';
import { PartnerProductList } from './pages/PartnerProductList';
import { PartnerEarnings } from './pages/PartnerEarnings';
import { PartnerProfile } from './pages/PartnerProfile';
import { PartnerSupport } from './pages/PartnerSupport';
import { PartnerPending, PartnerRejected } from './pages/StatusScreens';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/register" element={<PartnerRegister />} />
          <Route path="/partner/pending" element={<PartnerPending />} />
          <Route path="/partner/rejected" element={<PartnerRejected />} />
          
          {/* Protected Partner Routes */}
          <Route path="/partner/*" element={
            <ProtectedRoute requiredRole="partner">
              <PartnerLayout>
                <Routes>
                  <Route path="dashboard" element={<PartnerDashboard />} />
                  <Route path="contenus" element={<PartnerContentList />} />
                  <Route path="contenus/nouveau" element={<PartnerContentNew />} />
                  <Route path="boutique/produits" element={<PartnerProductList />} />
                  <Route path="boutique/commandes" element={<div>Commandes (Read-only)</div>} />
                  <Route path="boutique/revenus" element={<PartnerEarnings />} />
                  <Route path="profil" element={<PartnerProfile />} />
                  <Route path="support" element={<PartnerSupport />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </PartnerLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/partner/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/partner/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
