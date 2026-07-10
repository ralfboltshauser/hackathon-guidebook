"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";
import { PostHogPageView } from "./PostHogPageView";
import { TrackClicks } from "./TrackClicks";

/**
 * Boots cookieless PostHog after hydration (dynamic import → own async chunk, off the critical path)
 * and mounts the route-change pageview tracker + declarative CTA tracker. Renders nothing around
 * `children` — it's a headless boot, not a React context provider (components use the typed `track()`
 * helper, not a hook).
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void initAnalytics();
  }, []);

  return (
    <>
      <PostHogPageView />
      <TrackClicks />
      {children}
    </>
  );
}

export default PostHogProvider;
