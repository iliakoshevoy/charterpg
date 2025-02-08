"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { ProposalPDFProps } from '@/components/ProposalPDF';

// Dynamically import the entire PDF renderer component
const PDFRenderer = dynamic(
  () => import('./PDFRenderer'),
  { ssr: false }
);

interface PDFDownloadButtonProps {
  formData: ProposalPDFProps;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ formData }) => {
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

  return <PDFRenderer formData={formData} />;
};

export default PDFDownloadButton;