
// Define the structure of our form data
export interface ProposalData {
  customerName: string;
  aircraftImage: File | null;
  imageUrl?: string; // For preview
}