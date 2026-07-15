"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import { captureException } from "@/lib/analytics";

/**
 * Root error boundary — the last-resort catch for errors thrown in the root layout itself, which a
 * segment `error.tsx` cannot reach. It replaces the root layout when active, so it must render its
 * own `<html>` and `<body>` (Next.js requirement). Reports to PostHog Error Tracking before showing
 * a minimal, dependency-free fallback.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    void captureException(error, { boundary: "global", digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          textAlign: "center",
          padding: "1.5rem",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <h1 style={{ fontSize: "1.875rem", fontWeight: 300 }}>Something went wrong</h1>
        <p style={{ maxWidth: "28rem", fontSize: "0.875rem", opacity: 0.65 }}>
          The app hit an unexpected error. It has been logged. Please reload the page.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            height: "2.5rem",
            padding: "0 1.25rem",
            fontSize: "0.875rem",
            border: "1px solid rgba(0,0,0,0.2)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
