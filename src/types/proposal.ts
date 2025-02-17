  // src/types/proposal.ts
  import type { FlightLeg } from './flight';


  
  export interface AircraftOption {
    name: string;
    image1: string | null;
    image2: string | null;
    isImage1Default: boolean;
    isImage2Default: boolean;
    details: AircraftDetails | null;
    yearOfManufacture: string | null;
    yearRefurbishment: string | null;
    price: string | null;
    paxCapacity: string | null;
    notes: string | null;
  }
  
  

  export interface AircraftDetails {
    cabinWidth: string | null;
    cabinHeight: string | null;
    baggageVolume: string | null;
    passengerCapacity: string;
    deliveryStart: string; 
    defaultInteriorImageUrl?: string;
    defaultExteriorImageUrl?: string;
  }



  export interface AircraftOptionType {
    id: string;
    name: string;
    image1: string | null;
    image2: string | null;
    details: AircraftDetails | null;
    imagePreview1: string | null;
    imagePreview2: string | null;
    yearOfManufacture: string | null;
    yearRefurbishment: string | null;
    price: string | null;
    paxCapacity: string | null;
    notes: string | null;
    isImage1Default?: boolean;
    isImage2Default?: boolean;
  }

export interface ProposalPDFProps {
    airportDetails: {
      departure: string | null;
      arrival: string | null;
    };
    companySettings?: {
      logo: string | null;
      disclaimer: string;
      companyName: string;
    address: string;
    vatNumber: string;
    website: string;
    email: string;
    phoneNumber: string;
    };
    
  customerName: string;
  passengerCount: string;
  comment: string;
  flightLegs: FlightLeg[];
  option1Name: string;
  option1Image1: string | null;
  option1Image2: string | null;
  option1Details: AircraftDetails | null;
  option1YearOfManufacture: string | null;  // Added
  option1Price: string | null;              // Added
  option1PaxCapacity: string | null;        // Added
  option1Notes: string | null;              // Added
  option2Name: string;
  option2Image1: string | null;
  option2Image2: string | null;
  option2Details: AircraftDetails | null;
  option2YearOfManufacture: string | null;  // Added
  option2Price: string | null;              // Added
  option2PaxCapacity: string | null;        // Added
  option2Notes: string | null;              // Added
  option3Name: string;
  option3Image1: string | null;
  option3Image2: string | null;
  option3Details: AircraftDetails | null;
  option3YearOfManufacture: string | null;  // Added
  option3Price: string | null;              // Added
  option3PaxCapacity: string | null;        // Added
  option3Notes: string | null;              // Added
  option4Name: string;
  option4Image1: string | null;
  option4Image2: string | null;
  option4Details: AircraftDetails | null;
  option4YearOfManufacture: string | null;  // Added
  option4Price: string | null;              // Added
  option4PaxCapacity: string | null;        // Added
  option4Notes: string | null;              // Added
  option5Name: string;
  option5Image1: string | null;
  option5Image2: string | null;
  option5Details: AircraftDetails | null;
  option5YearOfManufacture: string | null;  // Added
  option5Price: string | null;              // Added
  option5PaxCapacity: string | null;        // Added
  option5Notes: string | null;              // Added
  option1YearRefurbishment: string | null;
  option2YearRefurbishment: string | null;
  option3YearRefurbishment: string | null;
  option4YearRefurbishment: string | null;
  option5YearRefurbishment: string | null;
  option1IsImage1Default: boolean;  // Add these!
  option1IsImage2Default: boolean;  // Add these!
  option2IsImage1Default?: boolean;  // Add these fields
  option2IsImage2Default?: boolean;  // Add these fields
  option3IsImage1Default?: boolean;  // Add these fields
  option3IsImage2Default?: boolean;  // Add these fields
  option4IsImage1Default?: boolean;  // Add these fields
  option4IsImage2Default?: boolean;  // Add these fields
  option5IsImage1Default?: boolean;  // Add these fields
  option5IsImage2Default?: boolean;  // Add these fields
}