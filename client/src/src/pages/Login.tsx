import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Wrench, AlertCircle } from 'lucide-react';
import { useToast } from '../components/Toast';
export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const {
    showToast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await loginApi({
        username,
        password
      });
      login(data.token, data.user);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Wrench className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Sign in to CRPMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Car Repair Payment Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Username" type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" autoComplete="username" />

            <Input label="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" />

            {error && <div className="rounded-lg bg-red-50 p-4 border border-red-100 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-red-700">{error}</div>
              </div>}

            <div>
              <Button type="submit" className="w-full justify-center py-2.5 text-sm font-semibold" isLoading={isLoading}>
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Protected System
                </span>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CRPMS. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>;
}