"use client";

import { useEffect } from "react";
import { type EventName, type EventProps, track } from "@/lib/analytics";

/**
 * Fires a single custom event when a server-rendered page mounts. Drop it into any Server Component
 * page to add a semantic view event alongside the automatic `$pageview` (e.g. `deep_dive_view` with
 * the article slug), without turning the whole page into a Client Component. Renders nothing.
 */
export function TrackView({ event, props }: { event: EventName; props?: EventProps }) {
  useEffect(() => {
    void track(event, props);
    // Fire once per mount; props is a fresh object each render, so intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}

export default TrackView;
