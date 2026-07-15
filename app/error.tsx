"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import { captureException } from "@/lib/analytics";

/**
 * Route-segment error boundary. Catches render/runtime errors thrown below the root layout and
 * reports them to PostHog Error Tracking — these are swallowed by React in production and never
 * reach the SDK's global handler, so we report them explicitly here. `digest` correlates with the
 * server log line; no PII is attached.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    void captureException(error, { boundary: "route", digest: error.digest });
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-page px-6 text-center font-serif text-ink">
      <h1 className="text-3xl font-light">Something went wrong</h1>
      <p className="max-w-md font-sans text-sm text-ink/60">
        The page hit an unexpected error. It has been logged — try again, and if it keeps happening,
        reload the page.
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="inline-flex h-10 items-center justify-center border border-ink/20 bg-panel px-5 font-sans text-sm text-ink/80 transition-colors hover:border-accent/55 hover:text-accent"
      >
        Try again
      </button>
    </main>
  );
}
