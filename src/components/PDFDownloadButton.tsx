//src/components/PDFDownloadButton.tsx
"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { ProposalPDFProps } from '@/types/proposal';

// Dynamically import PDFGenerator
const PDFGenerator = dynamic(
  () => import('./PDFGenerator'),
  { ssr: false }
);

interface PDFDownloadButtonProps {
  formData: ProposalPDFProps;
  airportDetails: {
    departure: string | null;
    arrival: string | null;
  };
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ formData, airportDetails }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
        Loading...
      </button>
    );
  }

  return <PDFGenerator formData={formData} airportDetails={airportDetails} />;
};

export default PDFDownloadButton;