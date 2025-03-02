// /api/webhooks/add-to-audience.ts

import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Optional: Verify webhook secret (if you decide to use one)
    // const webhookSecret = req.headers['x-webhook-secret'];
    // if (webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // Get user data from the webhook payload
    const { record } = req.body;
    
    // For INSERT webhook, we don't need to check old_record
    // We just verify this is a user with confirmed email
    if (!record.email_confirmed_at) {
      return res.status(200).json({ message: 'User email not confirmed yet' });
    }
    
    // Get user's name from profiles table
    const { data: userData, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', record.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    }

    const firstName = userData?.first_name || '';
    const lastName = userData?.last_name || '';
    
    // Try to add the user to Resend audience
    try {
      // Add user to Resend audience with their name
      await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email: record.email,
        firstName: firstName,
        lastName: lastName,
        unsubscribed: false
      });
      
      console.log(`Added user ${record.email} to confirmed users audience`);
      
      return res.status(200).json({ 
        message: 'User added to confirmed users audience successfully',
        data: {
          email: record.email,
          firstName: firstName
        }
      });
    } catch (error: any) {
      // If user already exists (409 conflict), just update their info
      if (error.statusCode === 409) {
        try {
          await resend.contacts.update({
            audienceId: AUDIENCE_ID,
            email: record.email,
            firstName: firstName,
            lastName: lastName,
            unsubscribed: false
          });
          
          return res.status(200).json({
            message: 'User already in audience, contact updated',
            data: { email: record.email }
          });
        } catch (updateError) {
          console.error('Error updating existing contact:', updateError);
        }
      }
      
      console.error('Error adding contact to audience:', error);
      return res.status(500).json({ error: 'Failed to add user to audience' });
    }
    
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}