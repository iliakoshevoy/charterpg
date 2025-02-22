// src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ProposalForm from '@/components/ProposalForm';
import LandingPage from '@/components/LandingPage';
import AuthDebug from '@/components/AuthDebug';

export default function Home() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('Home page state:', { user, isLoading });
  }, [user, isLoading]);

  // Add AuthDebug component to help diagnose auth issues
  return (
    <>
      <AuthDebug />
      <Layout>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {user ? <ProposalForm /> : <LandingPage />}
          </>
        )}
      </Layout>
    </>
  );
}