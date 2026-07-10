"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { capturePageview } from "@/lib/analytics";

/**
 * Fires a cookieless `$pageview` on the initial load and on every App Router client navigation.
 * Split out (and Suspense-wrapped by the provider) because `useSearchParams()` opts the subtree into
 * client rendering — isolating it here keeps the rest of the tree statically rendered.
 */
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // pathname/searchParams already reflect the new URL by the time this runs, so posthog reads the
    // correct location. capturePageview() awaits SDK init internally, so an early call is safe.
    void capturePageview();
  }, [pathname, searchParams]);

  return null;
}

export default PostHogPageView;
