// src/utils/userStats.ts
import { supabase } from '@/lib/supabase';

// Add this to src/utils/userStats.ts
export async function getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('proposal_count, last_generated_at')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user stats:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error in getUserStats:', err);
      return null;
    }
  }


export async function incrementProposalCount(userId: string) {
  try {
    const now = new Date().toISOString();
    
    // First check if the record exists
    const { data: existingRecord } = await supabase
      .from('user_stats')
      .select('proposal_count')
      .eq('user_id', userId)
      .single();
    
    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('user_stats')
        .update({
          proposal_count: existingRecord.proposal_count + 1,
          last_generated_at: now,
          updated_at: now
        })
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error updating user stats:', error);
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          proposal_count: 1,
          last_generated_at: now
        });
        
      if (error) {
        console.error('Error creating user stats:', error);
      }
    }
  } catch (err) {
    console.error('Error in incrementProposalCount:', err);
  }
}