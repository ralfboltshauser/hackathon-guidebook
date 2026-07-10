---
name: pulse
description: Fetch and analyze this site's PostHog ("Pulse Talk") analytics, and set up new tracking. Use when asked to pull analytics/metrics/pageviews/heatmaps/errors/funnels, query events, see "what's happening on the site", add or wire a new tracked event, or create a PostHog insight / dashboard / feature flag. Cookieless PostHog, project 220518 (EU).
---

# Pulse — PostHog analytics for the Hackathon Guidebook

This site runs **cookieless PostHog** (the user calls it "Pulse Talk"). No cookie banner, EU region,
autocapture off, session replay off, heatmaps + error tracking on. The whole integration is a thin
port of the NoaIQ marketing site's analytics layer.

- **Project ID:** `220518`  ·  **Region:** EU  ·  **App host:** `https://eu.posthog.com`
- **Analytics port (edit here, nowhere else):**
  - `lib/analytics/events.ts` — the **frozen event taxonomy** (single source of truth)
  - `lib/analytics/client.ts` — cookieless init, heatmaps/errors, `beforeSend` noise filters, `track()`
  - `app/PostHogProvider.tsx` / `app/PostHogPageView.tsx` — boot + route-change `$pageview`
- **Gate:** `pnpm event-lint` fails the build on any `track()` name outside the taxonomy or any
  PII-looking property key.

## Fetching / analyzing analytics

Use the **`posthog` MCP server** (configured in `.mcp.json` at the repo root). If its tools aren't
available yet, run `/mcp` in Claude Code and complete the browser login, then retry. Always scope
queries to **project 220518**.

Good asks it can answer:
- "Top pages / pageviews / unique visitors over the last 7 days" → Web Analytics / a trend insight on `$pageview`.
- "Top errors this week" → Error tracking issues (stack traces come from the source-map upload).
- "How many `tab_switched` to `hack` vs `learn`?" → a breakdown insight or a **HogQL** query on the events table.
- "Which phases get the most `checklist_item_toggled`?" → HogQL grouping by the `phase` property.
- Heatmap review → open the PostHog Toolbar on the live site (the coordinate heatmap is already capturing).

Prefer a **HogQL query** for anything ad-hoc, e.g.:
```sql
select properties.tab as tab, count() as n
from events
where event = 'tab_switched' and timestamp > now() - interval 7 day
group by tab order by n desc
```

## Adding a new tracked event (keep it cookieless + governed)

1. Add the name to `EVENTS` **and** `CLIENT_EVENTS` in `lib/analytics/events.ts`; add any new
   property to the `EventProps` interface (snake_case, `object_action`, past tense).
2. Fire it from a client component via the typed helper — never the raw SDK:
   `import { track } from "@/lib/analytics"` then `void track("your_event", { ... })`.
3. Run `pnpm event-lint` (must pass) and `pnpm lint`. Then verify it lands in project 220518.

**Cookieless invariants — do not break these:** no PII in event names or property keys (no email /
name / phone / IP; hash if you ever must); keep `autocapture: false`, `persistence: 'memory'`,
`cookieless_mode: 'always'`, `disable_session_recording: true` in `client.ts`. Turning on replay or the
identified tier requires a real consent flow first — out of scope for the default cookieless posture.

## Setting up new things

- **Insights / dashboards / feature flags / error-tracking triage:** create them through the `posthog`
  MCP against project 220518. Feature flags read cookieless via `getFlag()` in `lib/analytics/client.ts`.
- **Ad-blocker-resistant proxy (later, no DNS):** the `/ingest` rewrite is already wired in
  `next.config.ts`. Flip it on by setting `NEXT_PUBLIC_POSTHOG_HOST=/ingest` in `.env.local` and Vercel.
- **Readable production error stack traces:** set `POSTHOG_API_KEY` (personal key, Error-tracking write)
  and `POSTHOG_PROJECT_ID=220518` in the Vercel build env; `next.config.ts` uploads source maps on build.

## Env & secrets

Client key lives in `.env.local` (gitignored) as `NEXT_PUBLIC_POSTHOG_KEY`; the template is
`.env.example`. Never commit real keys. The project (ingestion) key is write-only and browser-safe;
the **personal** API key (source maps / MCP) is a real secret — build env / OAuth only.
