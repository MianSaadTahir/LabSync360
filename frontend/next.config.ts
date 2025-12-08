import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Suppress source map warnings (they're harmless and don't affect functionality)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
