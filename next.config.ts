import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any domain
    // Note: This disables Next.js image optimization but allows any external image source
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Service worker must be served from root with proper scope
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
