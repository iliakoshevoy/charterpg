// src/types/flight.ts
export interface FlightLeg {
  id: string;
  departureDate: string;
  departureTime: string;
  departureAirport: string;
  arrivalAirport: string;
  passengerCount?: string;
  notes?: string;
  airportDetails: {
    departure: string | null;
    arrival: string | null;
  };
  coordinates?: {
    departure: {
      lat: string;
      lng: string;
    };
    arrival: {
      lat: string;
      lng: string;
    };
  };
}

  export type FlightLegs = FlightLeg[];