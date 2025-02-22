// src/app/api/check-registration/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// This client has admin privileges
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check if the user exists in Supabase auth
    const { data: users, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 10,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Find the user with the given email
    const user = users.users.find(u => u.email === email);

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
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Return user status information
    return NextResponse.json({
      exists: true,
      user_id: user.id,
      email_confirmed: user.email_confirmed_at !== null,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
      profile_exists: !!profileData,
      has_profile: !!profileData,
    });
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}