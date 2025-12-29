import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig  = {
  images: {
    // Allow images from any domain
    // Note: This disables Next.js image optimization but allows any external image source
    unoptimized: true,
  },
  turbopack: {},
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig as any);
