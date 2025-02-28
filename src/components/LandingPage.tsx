// src/components/LandingPage.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
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
    </div>
  );
};

export default LandingPage;