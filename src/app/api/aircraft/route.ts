// src/app/api/aircraft/route.ts
import { NextResponse } from 'next/server';
import { getAircraftData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getAircraftData();
    console.log('API route data:', data); // Add this line
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in aircraft API route:', error);
    return NextResponse.json({ error: 'Failed to fetch aircraft data' }, { status: 500 });
  }
}