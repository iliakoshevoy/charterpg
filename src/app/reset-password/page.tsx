// src/app/reset-password/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message || 'Failed to send reset email');
        return;
      }

      setIsEmailSent(true);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-12">
        {isEmailSent ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Check Your Email</h2>
            <p className="mt-4 text-gray-600">
              We've sent you an email with instructions to reset your password.
            </p>
            <Link href="/login">
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                Return to Login
              </button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}