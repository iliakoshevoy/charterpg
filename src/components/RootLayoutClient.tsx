// src/components/RootLayoutClient.tsx
'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { PropsWithChildren } from 'react';

export function RootLayoutClient({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}