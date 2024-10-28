import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable Turbopack
  turbo: true,

  // Images configuration
  images: {
    domains: ['avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Enable experimental features
  experimental: {
    // Enable after() API for post-response tasks
    after: true,
    
    // Optimize caching for better performance
    serverComponentsExternalPackages: [],
    
    // Configure static generation
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },

  // Configure static generation retry behavior
  staticGenerationRetryCount: 3,

  // Enable TypeScript for config
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
