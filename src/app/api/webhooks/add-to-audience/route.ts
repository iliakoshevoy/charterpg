// src/app/api/webhooks/add-to-audience/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Check required environment variables
if (!process.env.RESEND_API_KEY || !process.env.RESEND_CONFIRMED_USERS_AUDIENCE_ID) {
  console.error('Missing required environment variables: RESEND_API_KEY or RESEND_CONFIRMED_USERS_AUDIENCE_ID');
}

const resend = new Resend(process.env.RESEND_API_KEY!);
const AUDIENCE_ID = process.env.RESEND_CONFIRMED_USERS_AUDIENCE_ID!;

// Initialize Supabase client with service role key for fetching user profile data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  console.log('Webhook received');
  
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Webhook payload:', JSON.stringify(body));
    
    // Get user data from the webhook payload
    const { record } = body;
    
    // For INSERT webhook, we just verify this is a user with confirmed email
    if (!record.email_confirmed_at) {
      console.log('User email not confirmed yet:', record.email);
      return NextResponse.json({ message: 'User email not confirmed yet' }, { status: 200 });
    }
    
    console.log('Processing confirmed user:', record.email);
    
    // Get user's name from profiles table
    const { data: userData, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', record.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    }
    
    console.log('User profile data:', userData);

    const firstName = userData?.first_name || '';
    const lastName = userData?.last_name || '';
    
    // Try to add the user to Resend audience
    try {
      console.log('Adding to Resend audience:', {
        email: record.email,
        firstName,
        lastName
      });
      
      // Add user to Resend audience with their name
      const result = await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email: record.email,
        firstName: firstName,
        lastName: lastName,
        unsubscribed: false
      });
      
      console.log('Added user to audience, result:', result);
      
      return NextResponse.json({ 
        message: 'User added to confirmed users audience successfully',
        data: {
          email: record.email,
          firstName: firstName
        }
      }, { status: 200 });
      
    } catch (error: any) {
      console.error('Resend API error:', error);
      
      // If user already exists (409 conflict), just update their info
      if (error.statusCode === 409) {
        try {
          const updateResult = await resend.contacts.update({
            audienceId: AUDIENCE_ID,
            email: record.email,
            firstName: firstName,
            lastName: lastName,
            unsubscribed: false
          });
          
          console.log('Updated existing contact:', updateResult);
          
          return NextResponse.json({
            message: 'User already in audience, contact updated',
            data: { email: record.email }
          }, { status: 200 });
          
        } catch (updateError) {
          console.error('Error updating existing contact:', updateError);
        }
      }
      
      return NextResponse.json({ 
        error: 'Failed to add user to audience', 
        details: error.message 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}