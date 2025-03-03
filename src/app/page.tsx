// app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import ProposalForm from "@/components/ProposalForm";

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
              Easily Generate PDF Proposals From Your Phone or Laptop
            </h1>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-8 text-blue-600 max-w-3xl text-left leading-relaxed">
              Forget about Word, PowerPoint or Pages...
              CPG makes proposals generation quicker, easier AND ON THE GO!
            </h3>
            <div className="mt-10">
              <a href="/templates/CHARTER_OFFER_EXAMPLE.pdf" download className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md hover:bg-blue-700 transition">
                Check .PDF Example
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

        {/* Additional Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
            <p className="text-gray-600">Add app to your home screen and create proposals on the go in minutes</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Airports & Jets Database</h3>
            <p className="text-gray-600">Add airports by their name or ICAO/IATA codes. More than 200+ private jets with their dimensions</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
</svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Flight Map</h3>
            <p className="text-gray-600">Automatically add flight map to your proposal</p>
          </div>
        </div>
      
        {/* HOW IT LOOKS Section - Temporarily hidden
        <div className="mt-20 mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">HOW INTERFACE LOOKS LIKE</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-8 text-black">On Mobile</h3>
              <div className="rounded-xl overflow-hidden shadow-lg flex justify-center">
                <Image 
                  src="/templates/CPG_mobile.gif" 
                  alt="Mobile interface preview" 
                  width={300} 
                  height={500} 
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-8 text-black">On Desktop</h3>
              <div className="rounded-xl overflow-hidden shadow-lg flex justify-center">
                <Image 
                  src="/templates/chartergenprop_interface.png" 
                  alt="Desktop interface preview" 
                  width={500} 
                  height={400} 
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          

        </div>
        */}
        <div className="mt-20 text-center">
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