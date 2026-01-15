import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import { Wrench, Database, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';
export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Demo mode states
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      login(response.data.user);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      // Provide helpful guidance if credentials don't work
      if (errorMessage.includes('Invalid credentials')) {
        setError('Invalid credentials. Did you click "Load Data" to create the demo user?');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleDemoFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
    setSeedMessage(null);
  };
  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedMessage(null);
    setError('');
    try {
      const response = await api.post('/seed-demo');
      setSeedMessage({
        type: 'success',
        text: `✓ Demo data loaded! ${response.data.stats.cars} cars, ${response.data.stats.serviceRecords} records, and admin user created.`
      });
      // Auto-fill credentials after successful seed
      setTimeout(() => {
        handleDemoFill();
      }, 500);
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK') {
        setSeedMessage({
          type: 'error',
          text: "Cannot connect to backend server. Make sure it's running on port 5000."
        });
      } else {
        setSeedMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to load demo data. Check database connection.'
        });
      }
    } finally {
      setIsSeeding(false);
    }
  };
  return <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-900 p-8 text-center">
          <div className="mx-auto bg-blue-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SmartPark CRPMS</h1>
          <p className="text-blue-200 mt-2">
            Car Repair Payment Management System
          </p>
        </div>

        <div className="p-8">
          {/* Demo Mode Info */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Demo Environment Setup
            </h3>
            <p className="text-xs text-blue-700 mb-3">
              <strong>First time?</strong> Click "Load Data" below to set up the
              demo database with sample data and create the admin user.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs bg-white p-2 rounded border border-blue-100">
                <span className="text-gray-500">Username:</span>
                <span className="font-mono font-medium text-gray-900">
                  admin
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-2 rounded border border-blue-100">
                <span className="text-gray-500">Password:</span>
                <span className="font-mono font-medium text-gray-900">
                  admin123
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200 flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>}

            {seedMessage && <div className={`p-3 rounded-md text-sm border flex items-start ${seedMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {seedMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />}
                <span>{seedMessage.text}</span>
              </div>}

            <Input label="Username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required />

            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />

            <div className="space-y-3 pt-2">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="w-full text-xs" onClick={handleDemoFill} disabled={isSeeding}>
                  <UserCheck className="h-3 w-3 mr-2" />
                  Auto-fill
                </Button>

                <Button type="button" variant="secondary" className="w-full text-xs" onClick={handleSeedData} isLoading={isSeeding}>
                  <Database className="h-3 w-3 mr-2" />
                  Load Data
                </Button>
              </div>
            </div>

            <div className="text-center mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">
                Need help? Check <strong>SETUP_INSTRUCTIONS.md</strong>
              </p>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t">
          &copy; 2025 SmartPark Rwanda. National Practical Exam Project.
        </div>
      </div>
    </div>;
};