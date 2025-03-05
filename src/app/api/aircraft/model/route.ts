import { NextResponse } from 'next/server';
import { getAircraftData } from '@/lib/googleSheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const modelName = searchParams.get('name');
    
    if (!modelName) {
      return NextResponse.json({ error: 'Model name parameter is required' }, { status: 400 });
    }
    
    const allAircraft = await getAircraftData();
    
    // Find the model that matches the name exactly 
    const modelDetails = allAircraft.find(aircraft => 
      aircraft.model.toLowerCase() === modelName.toLowerCase()
    );
    
    if (!modelDetails) {
      return NextResponse.json({ error: 'Aircraft model not found' }, { status: 404 });
    }
    
    return NextResponse.json(modelDetails);
  } catch (error) {
    console.error('Error in aircraft model API route:', error);
    return NextResponse.json({ error: 'Failed to fetch aircraft model data' }, { status: 500 });
  }
}