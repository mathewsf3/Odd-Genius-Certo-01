import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API rewrites for backend integration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
      {
        source: '/health',
        destination: 'http://localhost:3000/health',
      },
    ];
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Image optimization for team logos and assets
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Development configuration
  env: {
    CUSTOM_KEY: 'football-analytics',
  },
};

export default nextConfig;
