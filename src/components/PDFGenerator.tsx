"use client";
import React, { useState, useEffect, useMemo } from "react";
import { usePDF } from "@react-pdf/renderer";
import ProposalPDF from "./ProposalPDF";
import type { ProposalPDFProps } from "./ProposalPDF";

interface PDFGeneratorProps {
  formData: ProposalPDFProps;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ formData }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const hasValidData = useMemo(() => {
    return Boolean(formData.customerName); // Only require customerName
  }, [formData.customerName]);

  // Ensure 'instance' is either a valid ReactElement or undefined
  const instance = useMemo(() => {
    if (!hasValidData) return undefined; // Ensure the instance is undefined when data is invalid
    return <ProposalPDF {...formData} />;
  }, [formData, hasValidData]);

  const [{ loading, url }] = usePDF({ document: instance });

  if (!mounted || !hasValidData) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
      >
        Please fill required fields
      </button>
    );
  }

  const handleDownload = () => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = `charter-proposal-${formData.customerName || "unnamed"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !url}
      className={`px-4 py-2 rounded-md ${
        loading || !url
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      }`}
    >
      {loading ? "Preparing PDF..." : "Download Proposal"}
    </button>
  );
};

export default PDFGenerator;