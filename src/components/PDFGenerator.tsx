//src/components/PDFGenerator.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import ProposalPDF from "./ProposalPDF";
import type { ProposalPDFProps } from '@/types/proposal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export interface AirportDetailsProps {
  departure: string | null;
  arrival: string | null;
}

interface PDFGeneratorProps {
  formData: ProposalPDFProps;
  airportDetails: AirportDetailsProps;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ formData, airportDetails }) => {
  const { user } = useAuth();
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasValidData = useMemo(() => {
    const hasAtLeastOneAirport = Boolean(formData.flightLegs[0]?.departureAirport) && 
                                Boolean(formData.flightLegs[0]?.arrivalAirport);
    const hasAtLeastOneOption = Boolean(formData.option1Name);
    return hasAtLeastOneAirport && hasAtLeastOneOption;
  }, [formData.flightLegs, formData.option1Name]);

  const generatePDF = useCallback(async () => {
    if (!hasValidData || !user) return;
    
    try {
      setIsGenerating(true);
      setError(null);

      // Fetch company settings from Supabase
      const { data: companySettings, error: settingsError } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError) {
        console.error('Error fetching company settings:', settingsError);
      }

      console.log('Fetched company settings:', companySettings);

      // Debug logs for checking data
      console.log('PDF Generation - Form Data:', {
        customerName: formData.customerName,
        option1: {
          name: formData.option1Name,
          hasImage1: Boolean(formData.option1Image1),
          hasImage2: Boolean(formData.option1Image2),
          details: formData.option1Details
        },
        airportDetails
      });

      // Image validation logging
      console.log('Image Validation:', {
        option1: {
          image1: {
            exists: !!formData.option1Image1,
            isDefault: formData.option1IsImage1Default,
            length: formData.option1Image1?.length || 0
          },
          image2: {
            exists: !!formData.option1Image2,
            isDefault: formData.option1IsImage2Default,
            length: formData.option1Image2?.length || 0
          }
        }
      });

      // Reset existing blob
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
        setPdfBlob(null);
      }

      const document = (
        <ProposalPDF 
          {...formData} 
          airportDetails={airportDetails}
          companySettings={companySettings ? {
            logo: companySettings.logo,
            disclaimer: companySettings.disclaimer,
            companyName: companySettings.company_name,
            address: companySettings.address,
            vatNumber: companySettings.vat_number,
            website: companySettings.website,
            email: companySettings.email,
            phoneNumber: companySettings.phone_number
          } : undefined}
        />
      );

      const blob = await pdf(document).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfBlob(url);
      
      console.log('PDF Generated successfully with company settings');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  }, [formData, airportDetails, hasValidData, pdfBlob, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [pdfBlob]);

  const handleDownload = () => {
    if (!pdfBlob) return;
    
    try {
      const link = document.createElement("a");
      link.href = pdfBlob;
      link.download = `charter-offer-${formData.customerName || " "}.pdf`;
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
    if (!hasValidData) return "Please add airports and 1 option";
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