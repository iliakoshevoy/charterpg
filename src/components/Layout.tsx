// src/components/Layout.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDebug from '@/components/AuthDebug';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const handleLogout = async () => {
    try {
      console.log('Attempting to logout...');
      await logout();
      console.log('Logout successful');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <AuthDebug />
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AuthDebug />
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Charter Offer Generator
            </Link>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Charter Offer Generator
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthDebug />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Charter Offer Generator
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/settings"
                  className="px-4 py-2 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Settings className="h-5 w-5 mr-1" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Charter Offer Generator
        </div>
      </footer>
    </div>
  );
};

export default Layout;