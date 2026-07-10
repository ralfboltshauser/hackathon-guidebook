import type { PostHog } from "posthog-js";
import { CLIENT_EVENTS, type EventName, type EventProps } from "./events";

/**
 * Client analytics — COOKIELESS BY DEFAULT. Ported from the NoaIQ marketing site's analytics port.
 *
 * PostHog Cloud EU, autocapture OFF, `persistence:'memory'` + `cookieless_mode:'always'`: nothing is
 * written to or read from the device, so ePrivacy Art.5(3) is NOT triggered and **no cookie banner is
 * required**. Events are anonymous (a transient server-side daily-salt hash, no cross-session identity).
 * The cookieless coordinate heatmap is on (no PII); error tracking is on; session replay is OFF.
 *
 * posthog-js is DYNAMICALLY imported after hydration (from the provider island), so it lands in its own
 * async chunk off the critical path — the static content pages stay lean. Components never touch the raw
 * SDK: they call the typed `track()` helper below, so the provider stays a one-file swap.
 */
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Phase 1 connects DIRECTLY to PostHog EU (no proxy, no DNS). To flip on the ad-blocker-resistant
// reverse proxy later, set NEXT_PUBLIC_POSTHOG_HOST=/ingest (the rewrite is already wired in
// next.config.ts) — no code change here. `ui_host` stays the real app so the toolbar/links work.
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
const UI_HOST = "https://eu.posthog.com";

let phPromise: Promise<PostHog | null> | null = null;

/**
 * Browser fetch-layer failures, anchored to the exact per-engine message: Safari "Load failed",
 * Chrome "Failed to fetch", Firefox "NetworkError…", plus common iOS transport aborts. These are
 * unhandled rejections from requests dying on flaky or content-blocked mobile networks — no stack, not
 * actionable. With `capture_exceptions` on, the SDK otherwise recaptures its OWN failed beacons as noise.
 */
const EXCEPTION_NETWORK_NOISE =
  /^(Load failed|Failed to fetch|NetworkError when attempting to fetch resource|The network connection was lost\.|The request timed out\.|cancell?ed)$/;

/**
 * React hydration-mismatch errors (the 418 / 423 / 425 family) that are NOT our bug: the browser
 * rewrote the server-rendered DOM before React hydrated it (overwhelmingly Chrome-for-Android's built-in
 * page translation swapping text nodes for non-English visitors — React just regenerates the subtree).
 * Dropped ONLY when a translation is actually in play, so a real hydration regression from an
 * untranslated visitor still reports.
 */
const REACT_HYDRATION_ERROR = /Minified React error #(?:418|423|425)\b/;

/** Languages this site serves; anything else implies an in-browser machine translation. */
const SERVED_LANGUAGES = new Set(["en"]);

/**
 * Heuristic: is the page being machine-translated in the browser right now? Chrome / the Google-Translate
 * widget marks `<html>` with `translated-ltr`/`translated-rtl`, and a browser UI language outside what we
 * serve makes the visitor a translate candidate. Both reads are SSR-safe (guarded).
 */
export function isPageLikelyTranslated(): boolean {
  if (typeof document !== "undefined") {
    const root = document.documentElement?.classList;
    if (root?.contains("translated-ltr") || root?.contains("translated-rtl")) return true;
  }
  if (typeof navigator !== "undefined" && navigator.language) {
    const base = navigator.language.toLowerCase().split("-")[0];
    if (base && !SERVED_LANGUAGES.has(base)) return true;
  }
  return false;
}

/**
 * Client-side payload gate — runs for EVERY event. Drops unactionable network-failure exceptions and
 * translation-induced React hydration errors before they leave the browser, so Error Tracking only sees
 * real, stack-bearing errors. `isTranslated` is injected for testability.
 */
export function beforeSend(
  payload: { event: string; properties?: Record<string, unknown> } | null,
  isTranslated: () => boolean = isPageLikelyTranslated,
) {
  if (!payload) return payload;
  if (payload.event === "$exception") {
    const list = payload.properties?.$exception_list as Array<{ value?: string }> | undefined;
    const values = payload.properties?.$exception_values as string[] | undefined;
    const value = (list?.[0]?.value ?? values?.[0])?.trim();
    if (value && EXCEPTION_NETWORK_NOISE.test(value)) return null;
    if (value && REACT_HYDRATION_ERROR.test(value) && isTranslated()) return null;
  }
  return payload;
}

/** Load + init posthog-js (cookieless). Idempotent; returns null if no key is configured. */
function load(): Promise<PostHog | null> {
  if (!KEY) return Promise.resolve(null);
  if (!phPromise) {
    phPromise = import("posthog-js").then((mod) => {
      const posthog = mod.default;
      posthog.init(KEY, {
        api_host: HOST,
        ui_host: UI_HOST,
        autocapture: false,
        // Pageviews are captured explicitly per route change (App Router SPA nav) in PostHogPageView,
        // so PostHog's own auto-capture stays off to avoid double counting.
        capture_pageview: false,
        capture_pageleave: true, // accurate bounce rate + session duration (cookieless-safe)
        capture_performance: { web_vitals: true }, // LCP/CLS/INP/FCP per page open (no PII)
        capture_exceptions: true, // error tracking: auto-capture unhandled errors + rejections
        person_profiles: "identified_only",
        persistence: "memory", // no cookie, no localStorage → no Art.5(3) storage trigger
        // biome-ignore lint: cookieless_mode option lags the posthog-js types
        cookieless_mode: "always" as never, // transient server-side daily-salt hash (no device id)
        disable_session_recording: true, // replay is consent-only — off by default
        // capture_heatmaps is a valid runtime option, sometimes missing from the d.ts
        capture_heatmaps: true as never, // coordinate-stream heatmap is cookieless-safe (no element/PII)
        before_send: beforeSend as never,
      });
      return posthog;
    });
  }
  return phPromise;
}

/** Boot cookieless analytics from the provider island. No consent needed. */
export async function initAnalytics(): Promise<void> {
  await load();
}

/** Capture a pageview for the current URL. Called on every App Router navigation. */
export async function capturePageview(): Promise<void> {
  const p = await load();
  p?.capture("$pageview");
}

/** Fire a typed funnel event (anonymous, cookieless). No-op for unknown/server-only names. */
export async function track(event: EventName, props: EventProps = {}): Promise<void> {
  if (!KEY) return;
  if (!CLIENT_EVENTS.includes(event)) {
    if (process.env.NODE_ENV !== "production")
      console.warn(`[analytics] "${event}" is not a client event — ignored.`);
    return;
  }
  const p = await load();
  p?.capture(event, props);
}

/**
 * Report a caught exception to PostHog Error Tracking. React render errors are swallowed by error
 * boundaries in production and never reach the SDK's global handler, so `app/error.tsx` and
 * `app/global-error.tsx` call this to close that gap. `capture_exceptions` still auto-captures
 * uncaught errors + unhandled rejections; this is the boundary path only. The same `beforeSend`
 * noise filter applies. `context` must stay PII-free.
 */
export async function captureException(
  error: unknown,
  context: Record<string, unknown> = {},
): Promise<void> {
  const p = await load();
  p?.captureException(error, context);
}

/** Feature-flag value (not personal data; works cookieless). */
export async function getFlag(key: string): Promise<string | boolean | undefined> {
  const p = await load();
  return p?.getFeatureFlag(key);
}
