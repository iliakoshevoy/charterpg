// src/app/user-info/page.tsx
'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function UserInfoPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">Please log in to view your information.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center">
          <Link href="/settings" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Settings
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">User Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <p className="mt-1 text-gray-900">{user.firstName || ''}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <p className="mt-1 text-gray-900">{user.lastName || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}