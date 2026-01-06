import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  rewrites: async () => {
    return [
      {
        source: "/api/:slug*",
        destination: "/internal/:slug*",
      },
    ];
  },
};

export default nextConfig;
