// src/app/api/test-sheets/route.ts
import { NextResponse } from 'next/server';
import { testConnection, getAircraftData } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Failed to connect to Google Sheets' }, { status: 500 });
    }

    // Test data fetch
    const data = await getAircraftData();
    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to Google Sheets',
      sampleData: data.slice(0, 2) // Return first two records as sample
    });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}