import type { NextConfig } from 'next'
import type { Configuration as WebpackConfig } from 'webpack'
import withPWA from '@ducanh2912/next-pwa'

// Define the type for the urlPattern function
type URLPatternFn = {
  url: {
    pathname: string;
    [key: string]: any;
  };
  [key: string]: any;
};

// Create your PWA configuration with type assertion
const pwaConfig = {
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
} as any;

// Add runtimeCaching to the pwaConfig
pwaConfig.runtimeCaching = [
  {
    urlPattern: ({ url }: URLPatternFn) => url.pathname === '/api/airports',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'airports-api',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 60 * 60 * 24, // 1 day
      },
    },
  }
];

const nextConfig = withPWA(pwaConfig)({
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