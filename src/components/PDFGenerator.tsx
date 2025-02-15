"use client";
/*
  PDFGenerator Component
  Handles PDF generation for charter proposals
  Provides separate buttons for generation and download
*/

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
      
      console.log('Generating PDF with data:', {
        formData: {
          customerName: formData.customerName,
          option1: {
            name: formData.option1Name,
            hasImage1: Boolean(formData.option1Image1),
            hasImage2: Boolean(formData.option1Image2),
            details: formData.option1Details,
            yearOfManufacture: formData.option1YearOfManufacture,
            yearRefurbishment: formData.option1YearRefurbishment,
          },
          option2: {
            name: formData.option2Name,
            hasImage1: Boolean(formData.option2Image1),
            hasImage2: Boolean(formData.option2Image2),
            details: formData.option2Details,
            yearOfManufacture: formData.option2YearOfManufacture,
            yearRefurbishment: formData.option2YearRefurbishment,
          },
          option3: {
            name: formData.option3Name,
            hasImage1: Boolean(formData.option3Image1),
            hasImage2: Boolean(formData.option3Image2),
            details: formData.option3Details,
            yearOfManufacture: formData.option3YearOfManufacture,
            yearRefurbishment: formData.option3YearRefurbishment,
          },
          option4: {
            name: formData.option4Name,
            hasImage1: Boolean(formData.option4Image1),
            hasImage2: Boolean(formData.option4Image2),
            details: formData.option4Details,
            yearOfManufacture: formData.option4YearOfManufacture,
            yearRefurbishment: formData.option4YearRefurbishment,
          },
          option5: {
            name: formData.option5Name,
            hasImage1: Boolean(formData.option5Image1),
            hasImage2: Boolean(formData.option5Image2),
            details: formData.option5Details,
            yearOfManufacture: formData.option5YearOfManufacture,
            yearRefurbishment: formData.option5YearRefurbishment,
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
    }
  }, [formData, airportDetails, hasValidData, pdfBlob]);

  // Cleanup on unmount
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
    if (!pdfBlob) return;
    
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

  const generateButtonText = (() => {
    if (isGenerating) return "Preparing PDF...";
    if (error) return "Error";
    if (!hasValidData) return "Please fill required fields";
    return "Generate Proposal";
  })();

  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={generatePDF}
        disabled={isGenerating || Boolean(error) || !hasValidData}
        className={`px-4 py-2 rounded-md ${
          isGenerating || !hasValidData || error
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        }`}
      >
        {generateButtonText}
      </button>
  
      {pdfBlob && !isGenerating && (
        <div className="flex items-center gap-2 text-gray-600">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <span>
              Download proposal
              {formData.customerName && ` for ${formData.customerName}`}
            </span>
          </button>
          <span className="text-sm text-gray-400">
            Generated at {new Date().toLocaleTimeString()}
          </span>
        </div>
      )}
  
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default PDFGenerator;