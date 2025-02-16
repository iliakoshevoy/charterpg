import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              CHARTER OFFER GENERATOR
            </h1>
            <Link
              href="/settings"
              className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Disclaimer: This web app is designed to generate charter proposal documents. The generated proposals are for informational purposes only and should be reviewed for accuracy before use.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;