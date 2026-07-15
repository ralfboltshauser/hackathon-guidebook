"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { capturePageview } from "@/lib/analytics";

/**
 * Fires a cookieless `$pageview` on initial load and on every real App Router **path** navigation.
 *
 * Deliberately depends on `pathname` only — NOT `useSearchParams`. Tab/phase view state lives in the
 * query string, written with `history.replaceState` (see `lib/guidebook.ts` → `writeViewStateToUrl`),
 * and Next.js syncs those shallow updates into `useSearchParams`. Depending on search params would
 * therefore emit a spurious pageview on every Learn↔Hack switch, Prev/Next, and even Learn-view scroll
 * (its IntersectionObserver rewrites `?phase=N`) — inflating pageviews and corrupting session duration.
 * The full URL (query string included, e.g. UTMs) is still captured via `window.location.href`.
 */
export function PostHogPageView() {
  const pathname = usePathname();

  useEffect(() => {
    void capturePageview(window.location.href);
  }, [pathname]);

  return null;
}

export default PostHogPageView;
