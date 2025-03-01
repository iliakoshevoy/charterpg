// app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";

export default function LandingPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Generate professional private jet charter proposals from your laptop or mobile phone.
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <ul className="text-left text-lg text-gray-600 space-y-3 mb-8 list-disc pl-5">
              <li>Mobile friendly - generate proposals from phone in less than 1 minute</li>
              <li>Connected database of airports</li>
              <li>Database of most popular private jets and their dimensions</li>
              <li>Automatically Generated flight map</li>
            </ul>
            
            <div className="mt-6">
              <a href="/sample-proposal.pdf" className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF example of generated proposal
              </a>
            </div>
          </div>
          
          <Link href="/register">
            <button className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              GET STARTED
            </button>
          </Link>
        </div>
        
        {/* HOW IT LOOKS Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">HOW IT LOOKS</h2>
          
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            {/* Replace with your actual app screenshot */}
            <div className="relative w-full h-[600px]">
              <Image 
                src="/app-screenshot.png" 
                alt="Charter proposal generator application screenshot" 
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center p-4 text-gray-500 italic">
              * App interface may vary slightly with future updates
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/register">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                GET STARTED NOW
              </button>
            </Link>
          </div>
        </div>
        
        {/* Additional Features Section (Optional) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
            <p className="text-gray-600">Create professional proposals from anywhere, even when you're on the go.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Database</h3>
            <p className="text-gray-600">Access detailed information about airports and private jets with just a few clicks.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Results</h3>
            <p className="text-gray-600">Impress clients with beautiful, branded proposals that stand out from the competition.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}