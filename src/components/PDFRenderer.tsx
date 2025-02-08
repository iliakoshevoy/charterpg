"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import type { ProposalPDFProps } from './ProposalPDF';

// Dynamically import PDFDownloadLink with no SSR
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { 
    ssr: false,
    loading: () => (
      <button className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-wait">
        Loading PDF Generator...
      </button>
    )
  }
);

// Dynamically import ProposalPDF
const ProposalPDF = dynamic(() => import('./ProposalPDF'), { ssr: false });

interface PDFGeneratorProps {
  formData: ProposalPDFProps;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ formData }) => {
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