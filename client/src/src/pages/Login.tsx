import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginApi({ username, password });
      login(data.token, data.user);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-gray-900">
      
      {/* LEFT — FORM */}
      <div className="flex items-center justify-center px-6 sm:px-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Log in to your CRPMS account
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-2.5 text-sm font-semibold"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} CRPMS. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="hidden lg:block relative">
        <img
          src="/login.png"
          alt="Background"
          className="
            absolute inset-0 h-full w-full object-cover
            grayscale brightness-75 contrast-110
          "
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Quote */}
        <div className="relative z-10 flex h-full items-end p-10">
          <blockquote className="max-w-md text-white">
            <p className="text-lg font-medium leading-relaxed">
              “Every great journey begins in the garage. From diagnostics to
              repairs and payments, CRPMS keeps your workshop running smoothly
              and your customers moving forward.”
            </p>
            <footer className="mt-4 text-sm opacity-80">
              — SmartPark Management System
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
