// src/app/api/check-registration/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Ensure SUPABASE_SERVICE_ROLE_KEY is set.');
}

// This client has admin privileges (DO NOT expose service key in frontend)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if the user exists in Supabase auth
    const { data: users, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100, // Increased limit in case of pagination issues
    });

    if (authError) {
      console.error('Supabase Auth Error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Find the user with the given email
    const user = users.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ exists: false, message: 'User not found in auth' });
    }

    // Check if the user exists in profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Supabase Profile Error:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Return user status information
    return NextResponse.json({
      exists: true,
      user_id: user.id,
      email_confirmed: user.email_confirmed_at !== null,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
      profile_exists: !!profileData,
    });
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}