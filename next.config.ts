import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["agentation"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
