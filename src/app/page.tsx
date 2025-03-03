// app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import ProposalForm from "@/components/ProposalForm";
import FAQ from "@/components/FAQ";

export default function Page() {
  const { user, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  // Authenticated users see ProposalForm wrapped in Layout
  if (user) {
    return (
      <Layout>
        <ProposalForm />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </Layout>
    );
  }

  // Unauthenticated users see LandingPage
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Updated hero section with two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
          {/* Left column with text and button */}
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-3xl mb-3">
              Generate Professional Charter Proposals On Your Phone or Laptop
            </h1>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-blue-600 max-w-3xl text-left leading-relaxed">
              Faster, easier, and ON THE GO!
            </h3>
            
            <ul className="text-black mb-8 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Automatically include flight map</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Up to 5 legs and jet options</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>200+ jet models with cabin sizes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Some jets include a generic picture</span>
              </li>
            </ul>
            
            <div className="mt-8">
              <a href="/templates/CHARTER_OFFER_EXAMPLE.pdf" download className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md hover:bg-blue-700 transition">
                Download .PDF Example
              </a>
            </div>
          </div>
          
          {/* Right column with image */}
          <div className="flex justify-center mt-12 md:mt-0">
            <div className="relative group shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-xl shadow-blue-400/70 hover:shadow-blue-500/80">
              <div className="absolute inset-0 bg-transparent group-hover:bg-blue-100/50 transition-all duration-300 ease-in-out"></div>
              <Image 
                src="/templates/CPG_form.png" 
                alt="Charter Proposal Generator Form" 
                width={500} 
                height={400} 
                className="object-contain relative z-10 transition-all duration-300 ease-in-out"
              />
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="flex justify-center my-16">
          <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
        </div>

{/* Add to Mobile Home Screen Section */}
<div className="mt-10 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Add to Mobile Home Screen as an App</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left column with image */}
            <div className="flex justify-center">
              <div className="relative group shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-xl shadow-blue-400/70 hover:shadow-blue-500/80">
                <div className="absolute inset-0 bg-transparent group-hover:bg-blue-100/50 transition-all duration-300 ease-in-out"></div>
                <Image 
                  src="/templates/CPG_add_to_mobile.png" 
                  alt="Add Charter PG to mobile home screen" 
                  width={500} 
                  height={400} 
                  className="object-contain relative z-10 transition-all duration-300 ease-in-out"
                />
              </div>
            </div>
            
            {/* Right column with instructions */}
            <div className="flex flex-col justify-center">
              <ol className="list-decimal pl-5 space-y-4 text-lg text-gray-800">
                <li className="pl-2">Open <span className="text-blue-600 font-medium">www.charterpropgen.com</span> in your mobile browser (Chrome, Safari, etc.)</li>
                <li className="pl-2">On iOS: tap the share icon in the top right corner and select <span className="font-medium">"Add to Home Screen"</span></li>
                <li className="pl-2">On Android: tap the menu (three dots) and select <span className="font-medium">"Add to Home Screen"</span></li>
              </ol>
              <p className="mt-6 text-lg text-gray-800">Charter PG icon will appear now on your screen as any other mobile application available for easy access.</p>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="flex justify-center my-16">
          <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
        </div>
        
        {/* FAQ Section - Added before the Get Started button */}
        <FAQ />
        
        <div className="mt-10 text-center">
            <Link href="/register">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                GET STARTED NOW
              </button>
            </Link>
          </div>
      </div>
    </Layout>
  );
}