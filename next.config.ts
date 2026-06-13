import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/park-and-sell',
        destination: '/park-and-sell-car-chennai',
        permanent: true,
      },
      {
        source: '/browse',
        destination: '/used-cars-chennai',
        permanent: true,
      },
      {
        source: '/cars/brand/Jaguar',
        destination: '/used-cars-chennai',
        permanent: true,
      },
      {
        source: '/cars/brand/BMW',
        destination: '/used-cars-chennai',
        permanent: true,
      },
      {
        source: '/blogs',
        destination: 'https://cars.thetorque.in/',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'okdvpidwuhawowepxucq.supabase.co',
      },
    ],
  },
};

export default nextConfig;
