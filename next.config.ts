import type { NextConfig } from "next";
import { withPostHogConfig } from "@posthog/nextjs-config";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {
    root: process.cwd(),
  },
  // Reverse proxy for PostHog ingestion (PostHog EU). WIRED BUT DORMANT: the client only routes here
  // when NEXT_PUBLIC_POSTHOG_HOST=/ingest. Phase 1 connects directly to eu.i.posthog.com, so these
  // rules sit unused until we flip the env var on — no DNS or subdomain required (same-origin path).
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  // Trailing slashes on /ingest/* would break PostHog's API calls — leave them untouched.
  skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

const config = withMDX(nextConfig);

// Upload source maps to PostHog Error Tracking so production stack traces are readable. Runs ONLY when
// POSTHOG_API_KEY is set (CI / Vercel build secret); skipped locally/dev so ordinary builds are
// unaffected and never ship maps to users (deleteAfterUpload). Secrets live in the build env, never here.
export default process.env.POSTHOG_API_KEY
  ? withPostHogConfig(config, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      sourcemaps: {
        enabled: true,
        releaseName: "hackathon-guidebook",
        releaseVersion: process.env.VERCEL_GIT_COMMIT_SHA ?? "0.1.0",
        deleteAfterUpload: true,
      },
    })
  : config;
