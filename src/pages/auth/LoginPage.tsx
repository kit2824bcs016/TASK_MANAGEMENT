import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Mail, Lock, Eye, EyeOff, Sparkles, UserPlus } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { loginWithEmailPassword, loginWithGoogle } from '../../services/auth/authService';
import { validateLoginForm } from '../../validators/authValidator';
import { getFriendlyErrorMessage } from '../../lib/errors';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmailPassword(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setGeneralError(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGeneralError(null);
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setGeneralError(getFriendlyErrorMessage(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setGeneralError(null);
    setIsDemoLoading(true);
    try {
      await loginWithEmailPassword('demo@taskflow.app', 'demo123456');
      navigate('/dashboard');
    } catch (err) {
      setGeneralError(getFriendlyErrorMessage(err));
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-sm mb-3">
          <CheckSquare className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to TaskFlow
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Personal Task Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-xl shadow-xs border border-slate-200">
          {/* Quick Access Options */}
          <div className="space-y-2.5 mb-6">
            {/* 1-Click Demo Login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoLoading || isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-emerald-300 hover:border-emerald-500 rounded-lg text-sm font-semibold text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100/80 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isDemoLoading ? 'Signing in...' : '1-Click Demo Login (Instant Access)'}</span>
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isDemoLoading || isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-300 hover:border-slate-400 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or sign in with email</span>
            </div>
          </div>

          {generalError && (
            <div className="mb-5 space-y-2">
              <Alert
                type="error"
                message={generalError}
                onClose={() => setGeneralError(null)}
              />
              {generalError.includes('Invalid') && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-xs text-indigo-900 text-left flex items-center justify-between gap-2">
                  <span>Haven't registered this account yet?</span>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900 underline shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create account now</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email address"
              required
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
                if (generalError) setGeneralError(null);
              }}
              error={errors.email}
              autoComplete="email"
            />

            <div>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                required
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                  if (generalError) setGeneralError(null);
                }}
                error={errors.password}
                autoComplete="current-password"
              />
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="md"
              isLoading={isLoading}
              className="mt-2"
            >
              Sign in with Email
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
