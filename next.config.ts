import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/catalog",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
