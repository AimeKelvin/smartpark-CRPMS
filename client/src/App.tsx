import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { Login } from './src/pages/Login';
import { Dashboard } from './src/pages/Dashboard';
import { CarManagement } from './src/pages/CarManagement';
import { ServicesManagement } from './src/pages/ServicesManagement';
import { ServiceRecordManagement } from './src/pages/ServiceRecordManagement';
import { PaymentManagement } from './src/pages/PaymentManagement';
import { Reports } from './src/pages/Reports';
import { Layout } from './src/components/Layout';
function App() {
  return <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>} />

          <Route path="/cars" element={<ProtectedRoute>
                <CarManagement />
              </ProtectedRoute>} />

          <Route path="/services" element={<ProtectedRoute>
                <ServicesManagement />
              </ProtectedRoute>} />

          <Route path="/records" element={<ProtectedRoute>
                <ServiceRecordManagement />
              </ProtectedRoute>} />

          <Route path="/payments" element={<ProtectedRoute>
                <PaymentManagement />
              </ProtectedRoute>} />

          <Route path="/reports" element={<ProtectedRoute>
                <Reports />
              </ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>;
}
export { App };