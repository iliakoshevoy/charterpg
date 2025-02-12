"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import ProposalPDF from "./ProposalPDF";
import type { ProposalPDFProps } from '@/types/proposal';

export interface AirportDetailsProps {
  departure: string | null;
  arrival: string | null;
}

interface PDFGeneratorProps {
  formData: ProposalPDFProps;
  airportDetails: AirportDetailsProps;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ formData, airportDetails }) => {
  const [mounted, setMounted] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldGenerate, setShouldGenerate] = useState(false);

  const hasValidData = useMemo(() => {
    const hasAtLeastOneAirport = Boolean(formData.flightLegs[0]?.departureAirport) && 
                                Boolean(formData.flightLegs[0]?.arrivalAirport);
    const hasAtLeastOneOption = Boolean(formData.option1Name);
    return hasAtLeastOneAirport && hasAtLeastOneOption;
  }, [
    formData.flightLegs,
    formData.option1Name
  ]);

  const generatePDF = useCallback(async () => {
    if (!hasValidData) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      
// Inside the generatePDF function
console.log('Generating PDF with data:', {
  formData: {
    customerName: formData.customerName,
    option1: {
      name: formData.option1Name,
      hasImage1: Boolean(formData.option1Image1),
      hasImage2: Boolean(formData.option1Image2),
      details: formData.option1Details
    },
    option2: {
      name: formData.option2Name,
      hasImage1: Boolean(formData.option2Image1),
      hasImage2: Boolean(formData.option2Image2),
      details: formData.option2Details
    },
    option3: {
      name: formData.option3Name,
      hasImage1: Boolean(formData.option3Image1),
      hasImage2: Boolean(formData.option3Image2),
      details: formData.option3Details
    },
    option4: {
      name: formData.option4Name,
      hasImage1: Boolean(formData.option4Image1),
      hasImage2: Boolean(formData.option4Image2),
      details: formData.option4Details
    },
    option5: {
      name: formData.option5Name,
      hasImage1: Boolean(formData.option5Image1),
      hasImage2: Boolean(formData.option5Image2),
      details: formData.option5Details
    }
  },
  airportDetails
});
      
      // Reset the blob URL before generating new one
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
        setPdfBlob(null);
      }

      const document = <ProposalPDF {...formData} airportDetails={airportDetails} />;
      const blob = await pdf(document).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfBlob(url);
      
      console.log('PDF Generated successfully');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
      setShouldGenerate(false);
    }
  }, [formData, airportDetails, hasValidData, pdfBlob]);

  // Reset PDF blob when form data changes
  useEffect(() => {
    if (pdfBlob) {
      URL.revokeObjectURL(pdfBlob);
      setPdfBlob(null);
      setShouldGenerate(true);
    }
  }, [formData, airportDetails]);

  // Watch for valid data and generate PDF only when needed
  useEffect(() => {
    if (hasValidData && !pdfBlob) {
      setShouldGenerate(true);
    }
  }, [hasValidData, pdfBlob]);

  // Generate PDF when shouldGenerate is true
  useEffect(() => {
    if (shouldGenerate && mounted) {
      generatePDF();
    }
  }, [shouldGenerate, generatePDF, mounted]);

  // Cleanup
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, []);

  const handleDownload = () => {
    if (!pdfBlob) {
      setShouldGenerate(true);
      return;
    }
    
    try {
      const link = document.createElement("a");
      link.href = pdfBlob;
      link.download = `charter-proposal-${formData.customerName || "unnamed"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      setError('Error downloading PDF');
    }
  };

  const buttonText = (() => {
    if (isGenerating) return "Preparing PDF...";
    if (error) return "Error";
    if (!hasValidData) return "Please fill required fields";
    if (!pdfBlob && hasValidData) return "Click to generate PDF";
    return "Download Proposal";
  })();

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isGenerating || Boolean(error) || !hasValidData}
        className={`px-4 py-2 rounded-md ${
          isGenerating || !hasValidData || error
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        }`}
      >
        {buttonText}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default PDFGenerator;