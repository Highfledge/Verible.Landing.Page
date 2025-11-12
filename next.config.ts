import type { NextConfig } from "next";

const nextConfig: NextConfig  = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pictures-nigeria.jijistatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jiji.ng',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www-konga-com-res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
