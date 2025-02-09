  // src/types/proposal.ts
  import type { FlightLeg } from './flight';


  
  export interface AircraftOption {
    name: string;
    image1: string | null;
    image2: string | null;
    details: AircraftDetails | null;
  }
  
  

export interface AircraftDetails {
  cabinWidth: string | null;
  cabinHeight: string | null;
  baggageVolume: string | null;
  passengerCapacity: string;
}

export interface ProposalPDFProps {
  customerName: string;
  passengerCount: string;
  comment: string;
  flightLegs: FlightLeg[];
  option1Name: string;
  option1Image1: string | null;
  option1Image2: string | null;
  option1Details: AircraftDetails | null;
  option2Name: string;
  option2Image1: string | null;
  option2Image2: string | null;
  option2Details: AircraftDetails | null;
  option3Name: string;
  option3Image1: string | null;
  option3Image2: string | null;
  option3Details: AircraftDetails | null;
  option4Name: string;
  option4Image1: string | null;
  option4Image2: string | null;
  option4Details: AircraftDetails | null;
  option5Name: string;
  option5Image1: string | null;
  option5Image2: string | null;
  option5Details: AircraftDetails | null;
}