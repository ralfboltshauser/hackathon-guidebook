import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "tab",
            value: "(?<legacyTab>learn|hack)",
          },
          {
            type: "query",
            key: "phase",
            value: "(?<legacyPhase>[1-6])",
          },
        ],
        destination: "/learn?tab=:legacyTab&phase=:legacyPhase",
        permanent: true,
      },
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "tab",
            value: "(?<legacyTab>learn|hack)",
          },
        ],
        destination: "/learn?tab=:legacyTab",
        permanent: true,
      },
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "phase",
            value: "(?<legacyPhase>[1-6])",
          },
        ],
        destination: "/learn?phase=:legacyPhase",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
