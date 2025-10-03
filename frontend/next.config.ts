import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export so we can host on S3 static website
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
