export interface FlightLeg {
    id: string;
    departureDate: string;
    departureTime: string;
    departureAirport: string;
    arrivalAirport: string;
    airportDetails: {
        departure: string | null;
        arrival: string | null;
    };
}

export type FlightLegs = FlightLeg[];