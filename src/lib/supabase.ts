// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const startTime = Date.now();
    
    const { data, error } = await supabase.from('profiles').select('count').single();
    
    const endTime = Date.now();
    console.log(`Connection test took ${endTime - startTime}ms`);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return;
    }

    console.log('Supabase connection test successful');
  } catch (error) {
    console.error('Supabase connection test error:', error);
  }
}

// Run the test
testConnection();