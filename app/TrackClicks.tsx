"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Headless, declarative CTA tracking. ONE delegated capture-phase listener means any element (or its
 * ancestor) carrying a `data-cta` attribute fires `cta_click` with its label (`location`) and
 * destination (`target`, read from `href`) — no per-CTA wiring, and server-rendered CTAs stay zero-JS.
 *
 * Prepared for future event-driven work: to track a new CTA, just add `data-cta="some-label"` in the
 * markup. Mounted once from `PostHogProvider`. Capture phase so it runs before an `<a>` navigation;
 * `track()` lazy-inits PostHog and relies on the beacon to flush on unload (right trade for a CTA).
 */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>("[data-cta]");
      if (!el) return;
      void track("cta_click", {
        location: el.dataset.cta,
        target: el.getAttribute("href") ?? undefined,
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export default TrackClicks;
