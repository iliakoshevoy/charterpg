// src/components/NetworkCheck.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NetworkCheck() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const startTime = Date.now();
        const { error } = await supabase.from('profiles').select('count').single();
        const endTime = Date.now();
        
        console.log(`Supabase response time: ${endTime - startTime}ms`);
        console.log('Connection check result:', error ? 'Error' : 'Success');
        
        setStatus(error ? 'error' : 'connected');
      } catch (error) {
        console.error('Connection check error:', error);
        setStatus('error');
      }
    };

    checkConnection();
  }, []);

  if (status === 'checking') {
    return null;
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Database connection error. Please check console for details.
      </div>
    );
  }

  return null;
}