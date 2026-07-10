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
  //
  // NOTE: when enabling the proxy, also add `skipTrailingSlashRedirect: true` — PostHog's POSTs must
  // keep their trailing slashes. It is intentionally NOT set here: as a global flag it disables
  // trailing-slash canonicalization for the whole site (e.g. /about and /about/ both 200), creating
  // duplicate URLs / analytics identities, which isn't worth it while the proxy is off.
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
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

const config = withMDX(nextConfig);

// The source-map uploader needs a REAL PostHog host. The browser SDK may set NEXT_PUBLIC_POSTHOG_HOST
// to the relative proxy path (`/ingest`), which is not a valid upload target — fall back to PostHog EU
// whenever the value is empty or a path.
const rawHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogUploadHost =
  rawHost && !rawHost.startsWith("/") ? rawHost : "https://eu.i.posthog.com";

// Upload source maps to PostHog Error Tracking so production stack traces are readable. Runs ONLY when
// POSTHOG_API_KEY is set (CI / Vercel build secret); skipped locally/dev so ordinary builds are
// unaffected and never ship maps to users (deleteAfterUpload). Secrets live in the build env, never here.
export default process.env.POSTHOG_API_KEY
  ? withPostHogConfig(config, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID,
      host: posthogUploadHost,
      sourcemaps: {
        enabled: true,
        releaseName: "hackathon-guidebook",
        releaseVersion: process.env.VERCEL_GIT_COMMIT_SHA ?? "0.1.0",
        deleteAfterUpload: true,
      },
    })
  : config;
