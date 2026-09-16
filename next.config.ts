import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'gmuawrhowmcmhhpzxror.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'noithatkhonggioihan.com',
      },
      {
        protocol: 'https',
        hostname: 'www.noithatkhonggioihan.com',
      },
    ],
  },
};

export default nextConfig;
