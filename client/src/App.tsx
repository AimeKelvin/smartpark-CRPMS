import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/components/Toast';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { Login } from './src/pages/Login';
import { Dashboard } from './src/pages/Dashboard';
import { Cars } from './src/pages/Cars';
import { Services } from './src/pages/Services';
import { ServiceRecords } from './src/pages/ServiceRecords';
import { Payments } from './src/pages/Payments';
import { Reports } from './src/pages/Reports';
export function App() {
  return <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/cars" element={<Cars />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/records" element={<ServiceRecords />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>;
}