// src/components/PDFGenerator.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import ProposalPDF from "./ProposalPDF";
import type { ProposalPDFProps } from '@/types/proposal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { saveSetup } from '@/utils/setupStorage'; 
import { incrementProposalCount, getUserStats } from '@/utils/userStats';

export interface AirportDetailsProps {
  departure: string | null;
  arrival: string | null;
}

interface PDFGeneratorProps {
  formData: ProposalPDFProps;
  airportDetails: AirportDetailsProps;
  resetTrigger?: number; // Optional reset trigger
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ formData, airportDetails, resetTrigger }) => {
  const { user } = useAuth();
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<{ 
    proposal_count: number, 
    last_generated_at: string 
  } | null>(null);

  // Add a function to fetch user stats
  const fetchUserStats = useCallback(async () => {
    if (!user) return;
    
    const stats = await getUserStats(user.id);
    if (stats) {
      setUserStats(stats);
    }
  }, [user]);

  // Call this when the component mounts
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user, fetchUserStats]);

  // Reset PDF state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      // Clear PDF blob and related states
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
      setPdfBlob(null);
      setIsGenerating(false);
      setError(null);
    }
  }, [resetTrigger]);

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
      
      // After successful PDF generation, save the setup
      saveSetup(
        formData.customerName,
        formData.flightLegs,
        formData.comment || ''
      );

      // Track this proposal generation
      if (user) {
        await incrementProposalCount(user.id, user.email);
        // Refresh the stats after increment
        fetchUserStats();
      }
      
      console.log('PDF Generated successfully and setup saved');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  }, [formData, airportDetails, hasValidData, pdfBlob, user, fetchUserStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [pdfBlob]);

  const handleDownload = async () => {
    if (!pdfBlob) return;
    
    try {
      // Get the actual blob, not just the URL
      const response = await fetch(pdfBlob);
      const blobData = await response.blob();
      
      // Format current date as dd/mm/yyyy
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1}${today.getFullYear()}`;
      
      // Create proper filename
      let filename;
      if (formData.customerName) {
        // With customer name: "Charter for customerName.pdf {date}"
        filename = `Charter for ${formData.customerName} ${formattedDate}.pdf`;
      } else {
        // Without customer name: "Charter from {first departure ICAO} {date}"
        const departureICAO = formData.flightLegs[0]?.departureAirport || "Unknown";
        filename = `Charter from ${departureICAO} ${formattedDate}.pdf`;
      }
      
      // Check if we're in a mobile context and Web Share API is available
      if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // Create a File object (more compatible than raw Blob)
        const file = new File([blobData], filename, { type: 'application/pdf' });
        
        try {
          await navigator.share({
            files: [file]
          });
          return; // Exit if sharing was successful
        } catch (shareError) {
          console.log('Sharing failed, falling back to download', shareError);
          // Fall back to download if sharing fails
        }
      }
      
      // Desktop or fallback approach - create and click download link
      const link = document.createElement("a");
      // Create a NEW blob URL from our blob data (don't use the cached one)
      const downloadUrl = URL.createObjectURL(blobData);
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the temporary URL
      URL.revokeObjectURL(downloadUrl);
    } catch (downloadError) {
      console.error('Error handling PDF:', downloadError);
      setError('Error downloading PDF');
    }
  };

  const generateButtonText = (() => {
    if (isGenerating) return "Preparing PDF...";
    if (error) return "Error";
    if (!hasValidData) return "Add Airports and airplane";
    return "Generate Proposal";
  })();

  return (
    <div className="flex flex-col gap-2">
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
      
      {/* User stats display */}
      {userStats && userStats.proposal_count > 0 && (
        <div className="text-sm text-gray-500 mt-1">
          You've generated {userStats.proposal_count} proposal in total{userStats.proposal_count !== 1 ? 's' : ''}
          {userStats.last_generated_at && userStats.proposal_count > 1 }
        </div>
      )}
    </div>
  );
};

export default PDFGenerator;