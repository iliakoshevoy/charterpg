// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Fetching user session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('User session found:', session.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }
        
        if (profileData) {
          console.log('Profile data found:', profileData);
          setUser({
            id: profileData.id,
            email: profileData.email,
            firstName: profileData.first_name,
            lastName: profileData.last_name
          });
        } else {
          console.log('No profile data found for user');
        }
      } else {
        console.log('No user session found');
      }
      
      setIsLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileData) {
          setUser({
            id: profileData.id,
            email: profileData.email,
            firstName: profileData.first_name,
            lastName: profileData.last_name
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Sign up the user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      // Check if user was created
      if (!data.user) {
        console.error('No user data returned from signup');
        return { error: new Error('Failed to create user account') };
      }

      console.log('User created:', data.user.id);
      
      // The database triggers will handle profile and company settings creation
      return { error: null };
    } catch (error) {
      console.error('Registration process error:', error);
      return { error };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error };
      }

      if (!data.user) {
        console.error('No user data returned from login');
        return { error: new Error('Login failed') };
      }

      console.log('Login successful, fetching profile for user:', data.user.id);
      
      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('id', data.user.id)
        .single();

      console.log('Profile query result:', { profileData, profileError });

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Don't return error here, still allow login if profile fetch fails
      }

      if (profileData) {
        console.log('Setting user state with profile:', profileData);
        setUser({
          id: profileData.id,
          email: profileData.email,
          firstName: profileData.first_name,
          lastName: profileData.last_name
        });
      } else {
        // If no profile found, set minimal user data
        console.log('No profile found, setting minimal user data');
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          firstName: data.user.user_metadata?.first_name || '',
          lastName: data.user.user_metadata?.last_name || ''
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Login process error:', error);
      return { error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};