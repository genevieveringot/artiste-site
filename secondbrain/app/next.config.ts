import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable telemetry to save resources
  telemetry: false,
  
  // Empty turbopack config to satisfy NextJS
  turbopack: {},
  
  // Optimize for stability
  experimental: {
    bundlePagesRouterDependencies: false,
  },
};

export default nextConfig;