//src/app/api/jets/route.ts
import { NextResponse } from 'next/server';
import { getJetRegistrations } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getJetRegistrations();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in jets API route:', error);
    return NextResponse.json({ error: 'Failed to fetch jet data' }, { status: 500 });
  }
}