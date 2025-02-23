// src/app/login/page.tsx
'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

// Create a separate component for the message display
function MessageDisplay() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  if (!message) return null;

  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
      {message}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const { login, resendConfirmation } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowResend(false);
    setResendSuccess(false);
    setIsLoading(true);

    console.log('Login form submitted for:', email);
    const { error } = await login(email, password);

    if (error) {
      console.error('Login error in form:', error);
      setError(error.message || 'Failed to login');
      // Show resend option if email not confirmed
      if (error.message?.toLowerCase().includes('verify your email')) {
        setShowResend(true);
      }
      setIsLoading(false);
    } else {
      console.log('Login successful, redirecting to home');
      setIsLoading(false);
      router.push('/');
      router.refresh();
    }
  };

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    const { error } = await resendConfirmation(email);
    setIsLoading(false);
    
    if (error) {
      setError('Failed to resend confirmation email. Please try again.');
    } else {
      setResendSuccess(true);
      setError(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-12">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <Suspense fallback={null}>
          <MessageDisplay />
        </Suspense>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
  id="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  inputMode="email"
  autoComplete="email"
  autoCapitalize="off"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
  placeholder="your@email.com"
/>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
  id="password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  autoComplete="current-password"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
  placeholder="••••••••"
/>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {showResend && (
    <div className="text-center mt-4">
      <button
        type="button"
        onClick={handleResendConfirmation}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Resend confirmation email
      </button>
    </div>
  )}
  
  {resendSuccess && (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
      Confirmation email has been resent. Please check your inbox.
    </div>
  )}
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Register
            </Link>
          </p>
        </div>
        <div className="mt-4 text-center">
            <div />{/* Empty div for spacing */}
            <Link 
              href="/reset-password" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </Link>
          </div>
      </div>
      
    </Layout>
  );
}