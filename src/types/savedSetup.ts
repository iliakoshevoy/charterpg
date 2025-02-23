// src/types/savedSetup.ts
import type { FlightLeg } from './flight';

export interface SavedSetup {
  id: string;
  timestamp: string;
  firstLegDeparture: string;
  firstLegDate: string;
  customerName: string;
  flightLegs: FlightLeg[];
  comment: string;
}

export interface SavedSetupsStorage {
  setups: SavedSetup[];
}