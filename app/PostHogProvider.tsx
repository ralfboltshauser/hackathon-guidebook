"use client";

import { Suspense, useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";
import { PostHogPageView } from "./PostHogPageView";

/**
 * Boots cookieless PostHog after hydration (dynamic import → own async chunk, off the critical path)
 * and mounts the route-change pageview tracker. Renders nothing around `children` — it's a headless
 * boot, not a React context provider (components use the typed `track()` helper, not a hook).
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void initAnalytics();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}

export default PostHogProvider;
