// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false, // This can help with hydration issues
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint errors during build
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-pdf/renderer': '@react-pdf/renderer/lib/react-pdf.js',
    };
    return config;
  },
};

export default nextConfig;