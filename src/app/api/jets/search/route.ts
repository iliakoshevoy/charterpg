import { NextResponse } from 'next/server';
import { getJetRegistrations } from '@/lib/googleSheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }
    
    const allJets = await getJetRegistrations();
    
    // Filter jets by registration (case insensitive)
    const filteredJets = allJets.filter(jet => 
      jet.registration.toLowerCase().includes(query.toLowerCase())
    );
    
    return NextResponse.json(filteredJets);
  } catch (error) {
    console.error('Error in jet search API route:', error);
    return NextResponse.json({ error: 'Failed to search jet data' }, { status: 500 });
  }
}