// src/utils/setupStorage.ts
import type { FlightLeg } from '@/types/flight';

interface SavedSetup {
  id: string;
  timestamp: string;
  firstLegDeparture: string;
  firstLegDate: string;
  customerName: string;
  flightLegs: FlightLeg[];
  comment: string;
}

interface SavedSetupsStorage {
  setups: SavedSetup[];
}

const STORAGE_KEY = 'recent_flight_setups';
const MAX_SETUPS = 3;

export const saveSetup = (customerName: string, flightLegs: FlightLeg[], comment: string) => {
  try {
    const currentStorage = localStorage.getItem(STORAGE_KEY);
    const storage: SavedSetupsStorage = currentStorage ? JSON.parse(currentStorage) : { setups: [] };
    
    const newSetup: SavedSetup = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      firstLegDeparture: flightLegs[0]?.departureAirport || '',
      firstLegDate: flightLegs[0]?.departureDate || '',
      customerName,
      flightLegs,
      comment
    };

    storage.setups = [newSetup, ...storage.setups.slice(0, MAX_SETUPS - 1)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    return true;
  } catch (error) {
    console.error('Error saving setup:', error);
    return false;
  }
};

export default saveSetup;