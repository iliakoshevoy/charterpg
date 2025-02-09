// src/app/api/airports/route.ts
import { NextResponse } from 'next/server';
import { getAirportsData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getAirportsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in airports API route:', error);
    return NextResponse.json({ error: 'Failed to fetch airports data' }, { status: 500 });
  }
}