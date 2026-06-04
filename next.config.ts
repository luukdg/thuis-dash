import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.gstatic.com",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.2.32"],
};

export default nextConfig;
