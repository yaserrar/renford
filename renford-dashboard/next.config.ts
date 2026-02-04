import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  /* config options here */
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 7,
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
