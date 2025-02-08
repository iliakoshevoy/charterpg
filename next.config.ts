import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-pdf/renderer': '@react-pdf/renderer/lib/react-pdf.js',
    };
    return config;
  },
  transpilePackages: ['@react-pdf/renderer']
};

export default nextConfig;