import type { NextConfig } from "next";

const nextConfig: NextConfig  = {
  images: {
    // Allow images from any domain
    // Note: This disables Next.js image optimization but allows any external image source
    unoptimized: true,
  },
};

export default nextConfig;
