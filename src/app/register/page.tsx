"use client"; // Ensure this is at the top of the file

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // New state for success message
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, setFunction: React.Dispatch<React.SetStateAction<string>>) => {
    const words = e.target.value.split(' ');
    const capitalizedWords = words.map(word => capitalizeFirstLetter(word));
    setFunction(capitalizedWords.join(' '));
  };
  
  const { register } = useAuth();

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with at least 1 letter and 1 number');
      return;
    }
    
    if (!termsAccepted) {
      setError('You must accept the Terms of Use to register');
      return;
    }
    
    setIsLoading(true);

    try {
      const { error: registrationError } = await register(email, password, firstName, lastName);

      if (registrationError) {
        setError(registrationError.message || 'Failed to register');
        return;
      }

      setIsRegistered(true); // Show success message
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-12">
        {isRegistered ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Verify your email</h2>
            <p className="mt-4 text-gray-600">
              We sent an email to <span className="font-medium">{email}</span> with a link to verify your registration.
            </p>
            <p className="mt-2 text-gray-600">
              Please check your <span className="font-semibold">spam folder</span> if you don't see it in your inbox.
            </p>
            <Link href="/">
              <button className="mt-20 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                Go to main page
              </button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => handleNameChange(e, setFirstName)}
                    required
                    inputMode="text"
                    autoComplete="given-name"
                    autoCapitalize="words"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => handleNameChange(e, setLastName)}
                    required
                    inputMode="text"
                    autoComplete="family-name"
                    autoCapitalize="words"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Doe"
                  />
                </div>
              </div>

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
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters with 1 letter and 1 number
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I accept the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                      Terms of Use
                    </Link>
                  </label>
                </div>
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
                    Creating account...
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
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