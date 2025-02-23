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
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
  resendConfirmation: (email: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      return { error };
    } catch (error) {
      console.error('Error resending confirmation:', error);
      return { error };
    }
  };
  

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/update`,
      });
  
      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }
  
      return { error: null };
    } catch (error) {
      console.error('Reset password process error:', error);
      return { error };
    }
  };
  
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
  
      if (error) {
        console.error('Update password error:', error);
        return { error };
      }
  
      return { error: null };
    } catch (error) {
      console.error('Update password process error:', error);
      return { error };
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session fetch error:', sessionError);
          return;
        }

        if (session?.user) {
          console.log('User session found:', session.user.id);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }

          if (profileData) {
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
      } catch (error) {
        console.error('Error in fetchUser:', error);
      } finally {
        setIsLoading(false); // Ensure loading state is updated
      }
    };

    fetchUser();
  }, [router]);

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
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

      if (!data.user) {
        console.error('No user data returned from signup');
        return { error: new Error('Failed to create user account') };
      }

      console.log('User created:', data.user.id);
      return { error: null };
    } catch (error) {
      console.error('Registration process error:', error);
      return { error };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        // Check if the error is due to unconfirmed email
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          return { error: new Error('Please verify your email before logging in. Check your inbox for the confirmation link.') };
        }
        console.error('Login error:', error);
        return { error };
      }

      if (!data.user) {
        console.error('No user data returned from login');
        return { error: new Error('Login failed') };
      }

      console.log('Login successful, fetching profile for user:', data.user.id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      if (profileData) {
        setUser({
          id: profileData.id,
          email: profileData.email,
          firstName: profileData.first_name,
          lastName: profileData.last_name
        });
      } else {
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
    console.log("Logging out...");
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      resetPassword,
      updatePassword,
      resendConfirmation 
    }}>
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