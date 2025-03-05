//src/app/api/jets/[registration]/route.ts
import { NextResponse } from 'next/server';
import { getJetByRegistration } from '@/lib/googleSheets';

export async function GET(
  request: Request,
  { params }: { params: { registration: string } }
) {
  try {
    const registration = params.registration;
    const jet = await getJetByRegistration(registration);
    
    if (!jet) {
      return NextResponse.json({ error: 'Jet registration not found' }, { status: 404 });
    }
    
    return NextResponse.json(jet);
  } catch (error) {
    console.error('Error in jet lookup API route:', error);
    return NextResponse.json({ error: 'Failed to fetch jet data' }, { status: 500 });
  }
}