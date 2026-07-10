"use client";

import { useEffect } from "react";
import { type EventName, type EventProps, track } from "@/lib/analytics";

/**
 * Fires a single custom event when a server-rendered page mounts. Drop it into any Server Component
 * page to add a semantic view event alongside the automatic `$pageview` (e.g. `deep_dive_view` with
 * the article slug), without turning the whole page into a Client Component. Renders nothing.
 */
export function TrackView({ event, props }: { event: EventName; props?: EventProps }) {
  // Serialize props for the dep so the event re-fires when the identifying data changes. Navigating
  // deep-dive → deep-dive reuses this component instance (same `[slug]` segment, no remount), so a
  // `[event]`-only dep would silently drop every article view after the first.
  const propsKey = JSON.stringify(props ?? {});
  useEffect(() => {
    void track(event, props);
    // propsKey (a stable string) is the dep, not the fresh `props` object → one fire per unique view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, propsKey]);

  return null;
}

export default TrackView;
