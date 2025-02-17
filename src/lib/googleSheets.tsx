// src/lib/googleSheets.ts
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY || !process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
  throw new Error('Google Sheets credentials not found in environment variables');
}

const CREDENTIALS = {
  private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
};

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

const auth = new JWT({
  email: CREDENTIALS.client_email,
  key: CREDENTIALS.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Interfaces
export interface AircraftModel {
  jetSize: string;
  model: string;
  cabinWidth: string | null;
  cabinHeight: string | null;
  baggageVolume: string | null;
  passengerCapacity: string;
  defaultInteriorImageUrl?: string;
  defaultExteriorImageUrl?: string;
  deliveryStart: string;
}

export interface Airport {
  icao: string;
  country: string;
  airportName: string;
  latitude: string;  // Add these
  longitude: string; // Add these
}

// Aircraft Data Functions
export async function getAircraftData(): Promise<AircraftModel[]> {
  if (!SPREADSHEET_ID) throw new Error('Spreadsheet ID not found');
  
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['Airplanes'];
    const rows = await sheet.getRows();

    // Log the first row's data using public methods
    if (rows.length > 0) {
      console.log('First row data:', {
        jetSize: rows[0].get('jet size'),
        model: rows[0].get('model'),
        deliveryStart: rows[0].get('delivery start'),
        paxNumber: rows[0].get('pax number')
      });
    }

    return rows.map((row: GoogleSpreadsheetRow) => {
      const aircraftData = {
        jetSize: row.get('jet size') || '',
        model: row.get('model') || '',
        cabinWidth: row.get('width') || null,
        cabinHeight: row.get('height') || null,
        baggageVolume: row.get('bagagge volume') || null,
        passengerCapacity: row.get('pax number') || '',
        deliveryStart: row.get('delivery start') || ''
      };
      console.log('Processed aircraft data:', aircraftData);
      return aircraftData;
    });
  } catch (error) {
    console.error('Error fetching aircraft data:', error);
    return [];
  }
}

// Airport Data Functions
// src/lib/googleSheets.ts
export async function getAirportsData(): Promise<Airport[]> {
  if (!SPREADSHEET_ID) throw new Error('Spreadsheet ID not found');
  
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['Airports'];
    const rows = await sheet.getRows();

    return rows.map((row: GoogleSpreadsheetRow) => ({
      icao: row.get('icao') || '',
      country: row.get('country') || '',
      airportName: row.get('airport name') || '',
      latitude: row.get('latitude') || '',  // Add these fields
      longitude: row.get('longitude') || '' // Add these fields
    })).filter(airport => airport.icao);
  } catch (error) {
    console.error('Error fetching airports data:', error);
    return [];
  }
}

// Test function to verify connection
export async function testConnection(): Promise<boolean> {
  if (!SPREADSHEET_ID) throw new Error('Spreadsheet ID not found');
  
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
    await doc.loadInfo();
    console.log('Successfully connected to spreadsheet:', doc.title);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}