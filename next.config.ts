import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports if needed
  // output: 'export',

  // Image optimization
  images: {
    remotePatterns: [],
  },

  // Enable experimental features
  experimental: {
    // Enable optimized images
  },
};

export default nextConfig;
