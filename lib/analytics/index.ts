/**
 * Analytics port (barrel). Components import ONLY these typed helpers — never the raw SDK — so the
 * provider stays a one-file swap. COOKIELESS by default (no consent banner). See client.ts.
 */
export { capturePageview, getFlag, initAnalytics, track } from "./client";
export { EVENTS, type EventName, type EventProps, isEventName } from "./events";
