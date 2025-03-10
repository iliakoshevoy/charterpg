// src/utils/airports.ts
import { Airport } from '@/lib/googleSheets';

let airportsCache: Airport[] = []; // Initialize as an empty array

export async function fetchAirportCoordinates(icao: string): Promise<{ lat: string; lng: string } | null> {
  try {
    if (airportsCache.length === 0) { // Check for an empty array instead of null
      const response = await fetch('/api/airports');
      if (!response.ok) throw new Error('Failed to fetch airports');
      airportsCache = await response.json();
    }

    const airport = airportsCache.find(a => a.icao === icao);
    return airport ? {
      lat: airport.latitude,
      lng: airport.longitude
    } : null;
  } catch (error) {
    console.error('Error fetching airport coordinates:', error);
    return null;
  }
}