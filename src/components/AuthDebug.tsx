// src/components/AuthDebug.tsx
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthDebug() {
  useEffect(() => {
    const debugAuth = async () => {
      // Check session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Auth Debug - Session:', { sessionData, sessionError });

      // Check local storage
      const supabaseKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
      console.log('Auth Debug - Local Storage Keys:', supabaseKeys);
      supabaseKeys.forEach(key => {
        console.log(`${key}:`, localStorage.getItem(key));
      });
    };

    debugAuth();
  }, []);

  return null;
}