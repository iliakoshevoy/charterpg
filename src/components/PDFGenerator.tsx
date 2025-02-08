// src/components/PDFGenerator.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from './ProposalPDF';
import type { ProposalPDFProps } from './ProposalPDF';

interface PDFGeneratorProps {
  formData: ProposalPDFProps;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ formData }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-wait">
        Initializing...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ProposalPDF {...formData} />}
      fileName={`charter-proposal-${formData.customerName || 'unnamed'}.pdf`}
      className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      {({ loading }) => (loading ? 'Preparing PDF...' : 'Download Proposal')}
    </PDFDownloadLink>
  );
};

export default PDFGenerator;