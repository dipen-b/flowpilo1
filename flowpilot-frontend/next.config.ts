import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 60,
};

export default nextConfig;
