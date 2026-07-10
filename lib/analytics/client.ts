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

/** Languages this site serves; anything else in the *page* lang implies an in-browser translation. */
const SERVED_LANGUAGES = new Set(["en"]);

/**
 * Heuristic: has an in-browser machine translator (Chrome / Google Translate) actually rewritten the
 * DOM right now? Requires a POSITIVE marker — the `translated-ltr`/`translated-rtl` root class, the page
 * `lang` flipped away from what we served, or the `<font>` wrappers translators inject around swapped
 * text. Deliberately does NOT treat `navigator.language` as proof: a German/French visitor on an
 * untranslated page must keep their genuine React hydration errors. SSR-safe.
 */
export function isPageLikelyTranslated(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  if (root.classList?.contains("translated-ltr") || root.classList?.contains("translated-rtl"))
    return true;
  const pageLang = (root.lang || "en").toLowerCase().split("-")[0];
  if (pageLang && !SERVED_LANGUAGES.has(pageLang)) return true; // translator flipped <html lang>
  return document.querySelector("font") !== null; // translators wrap swapped text in <font>
}

/** Query params kept on URL-bearing properties (attribution + app view state); all others dropped. */
const QUERY_ALLOWLIST = /^(utm_|gclid$|fbclid$|ref$|tab$|phase$)/i;
/** PostHog properties (and heatmap keys) that carry a URL and could otherwise leak query/fragment PII. */
const URL_PROPS = [
  "$current_url",
  "$referrer",
  "$pathname",
  "$initial_current_url",
  "$initial_referrer",
  "$initial_pathname",
];

/**
 * Strip the fragment and any non-allowlisted query params from a URL/path string, so a link such as
 * `/?email=alice@example.com#token` can never leave the browser. Leaves plain values / posthog sentinels
 * (e.g. `$direct`) untouched. Exported for testing.
 */
export function sanitizeUrl(value: unknown): unknown {
  if (typeof value !== "string" || !/[?#]/.test(value)) return value;
  try {
    const u = new URL(value, "http://_"); // base lets relative paths parse
    u.hash = "";
    for (const key of [...u.searchParams.keys()]) {
      if (!QUERY_ALLOWLIST.test(key)) u.searchParams.delete(key);
    }
    return u.host === "_" ? `${u.pathname}${u.search}` : `${u.origin}${u.pathname}${u.search}`;
  } catch {
    return value.split("#")[0];
  }
}

/**
 * Client-side payload gate — runs for EVERY event. (1) Drops unactionable network-failure exceptions and
 * translation-induced React hydration errors, so Error Tracking only sees real, stack-bearing errors.
 * (2) Sanitizes URL-bearing properties + heatmap keys so query/fragment PII (`?email=…`, `#token`) can
 * never leak — this is what actually backs the no-PII guarantee (posthog-js otherwise sends the full
 * `location.href` as `$current_url`, the referrer, and the heatmap URL key verbatim). `isTranslated` is
 * injected for testability.
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
  const props = payload.properties;
  if (props) {
    for (const key of URL_PROPS) {
      if (typeof props[key] === "string") props[key] = sanitizeUrl(props[key]);
    }
    // Heatmap coordinate data is keyed by the full page URL — sanitize those keys too.
    const heatmap = props.$heatmap_data;
    if (heatmap && typeof heatmap === "object") {
      const clean: Record<string, unknown> = {};
      for (const [url, data] of Object.entries(heatmap)) clean[String(sanitizeUrl(url))] = data;
      props.$heatmap_data = clean;
    }
  }
  return payload;
}

/** Load + init posthog-js (cookieless). Idempotent; returns null if no key is configured. */
function load(): Promise<PostHog | null> {
  if (!KEY) return Promise.resolve(null);
  if (!phPromise) {
    phPromise = import("posthog-js")
      .then((mod) => {
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
          // Mask common PII patterns in captured URLs/properties (defense in depth; beforeSend also
          // strips query/fragment PII from URL props + heatmap keys).
          mask_personal_data_properties: true as never,
          before_send: beforeSend as never,
        });
        return posthog;
      })
      .catch((error) => {
        // Fail closed: analytics must never break the app. Clear the cached promise so a later call can
        // retry after a transient chunk-load/init failure, and resolve to null (callers use `p?.`).
        phPromise = null;
        if (process.env.NODE_ENV !== "production") console.warn("[analytics] init failed", error);
        return null;
      });
  }
  return phPromise;
}

/** Boot cookieless analytics from the provider island. No consent needed. */
export async function initAnalytics(): Promise<void> {
  await load();
}

/**
 * Capture a pageview. Called once per real path navigation (see PostHogPageView). Pass the URL
 * captured synchronously at navigation time so two rapid navigations can't both resolve to the final
 * `window.location`; omitting it lets posthog read the current location.
 */
export async function capturePageview(url?: string): Promise<void> {
  const p = await load();
  p?.capture("$pageview", url ? { $current_url: url } : undefined);
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
