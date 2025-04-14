import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  reactStrictMode: true,
};

export default nextConfig;
