import type { NextConfig } from 'next'
import type { Configuration as WebpackConfig } from 'webpack'
import withPWA from '@ducanh2912/next-pwa'

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development'
})({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: WebpackConfig) => {
    config.resolve!.alias = {
      ...config.resolve!.alias,
      '@react-pdf/renderer': '@react-pdf/renderer/lib/react-pdf.js',
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json'
          }
        ]
      }
    ]
  }
} as NextConfig);

export default nextConfig;