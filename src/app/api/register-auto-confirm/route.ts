// src/app/api/register-auto-confirm/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// This client has admin privileges
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Create the user with admin privileges and auto-confirm email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // This is key - it auto-confirms the email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      }
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || 'User creation failed' },
        { status: 400 }
      );
    }

    // Create the profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
      });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // Create company settings
    const { error: settingsError } = await supabaseAdmin
      .from('company_settings')
      .insert({
        user_id: authData.user.id,
        disclaimer: "All options are subject to final availability at the time of booking, flight permits, slots, and owner's approval where applicable. Possible de-Icing, WI-FI and other costs are not included and will be Invoiced, if occurred, after the flight",
      });

    if (settingsError) {
      return NextResponse.json(
        { error: settingsError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}