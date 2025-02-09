"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import ProposalPDF from "./ProposalPDF";
import type { ProposalPDFProps } from "./ProposalPDF";

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
    const hasCustomer = Boolean(formData.customerName);
    const hasOption1 = Boolean(formData.option1Name);
    return hasCustomer && hasOption1;
  }, [formData.customerName, formData.option1Name]);

  const generatePDF = useCallback(async () => {
    if (!hasValidData) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      
      // Debug log to check the data being passed
      console.log('Generating PDF with data:', {
        formData: {
          customerName: formData.customerName,
          option1: {
            name: formData.option1Name,
            hasImage: Boolean(formData.option1Image),
            details: formData.option1Details
          },
          option2: {
            name: formData.option2Name,
            hasImage: Boolean(formData.option2Image),
            details: formData.option2Details
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