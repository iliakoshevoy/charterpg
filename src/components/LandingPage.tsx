// src/components/LandingPage.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Charter Offer Generator
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Generate professional private jet charter proposals in seconds. Customize with your company details and send proposals that impress your clients.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/register"
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 flex items-center"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Multi-Leg Flights</h3>
            <p className="mt-2 text-base text-gray-500">
              Add up to 5 flight legs with complete details for complex charter journeys.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Aircraft Options</h3>
            <p className="mt-2 text-base text-gray-500">
              Compare multiple aircraft with detailed specifications and images.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Branded PDFs</h3>
            <p className="mt-2 text-base text-gray-500">
              Generate professional PDFs with your company logo and details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;