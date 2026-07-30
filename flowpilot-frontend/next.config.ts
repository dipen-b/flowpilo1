import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 60,
  // Vercel rebuild trigger
};

export default nextConfig;
