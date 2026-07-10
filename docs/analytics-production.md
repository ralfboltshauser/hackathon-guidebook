# Analytics: production configuration

What to configure to run the cookieless PostHog setup in production on Vercel — env vars, CI/CD,
source maps, ingestion proxy, and dashboard. For how the analytics themselves work, see
[`analytics.md`](./analytics.md); this doc is only the production setup.

**Already working** once `NEXT_PUBLIC_POSTHOG_KEY` is set: pageviews, sessions, web vitals, heatmaps,
error capture, and custom events. The steps below add readable error stack traces and (optionally)
ad-blocker resistance.

## 1. Vercel environment variables

Set these in **Project → Settings → Environment Variables** (Production **and** Preview).

| Variable | Value | Secret? | Needed for |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_…` (Project API key) | No — browser-safe, write-only | All analytics. Empty = analytics off. |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` (or `/ingest`, see §4) | No | Ingestion endpoint |
| `POSTHOG_API_KEY` | Personal API key, **Error tracking: write** | **Yes** — mark sensitive | Source-map upload (§3) |
| `POSTHOG_PROJECT_ID` | `220518` | No | Source-map upload (§3) |

The `NEXT_PUBLIC_*` vars are inlined into the browser bundle at build time, so a change needs a
redeploy. Never give `POSTHOG_API_KEY` a `NEXT_PUBLIC_` prefix.

## 2. Build & CI/CD

Vercel builds on every push — no extra CI to configure.

- **Build command:** default `next build`. Every PR gets a Preview deploy; `main` promotes to Production.
- **Node:** `package.json` declares `engines.node >=20.9.0`; Vercel picks a compatible version.
- **Gate before merge:** `pnpm check` (lint + typecheck + `event-lint` + duplicate-check + build).

## 3. Error tracking + source maps

Error **capture** already works with the browser key. Source maps just make production stack traces
**readable** instead of minified. They upload automatically during `next build` **when
`POSTHOG_API_KEY` is set** (see §1) — the maps are uploaded, tied to the deploy's commit
(`VERCEL_GIT_COMMIT_SHA`), then deleted so they're never served to users. Unset key = step skipped,
build unaffected.

To enable: create the key in **PostHog → Settings → Personal API keys** (scope: Error tracking write),
add it + `POSTHOG_PROJECT_ID` to Vercel, redeploy. Nothing else.

## 4. Ad-blocker-resistant ingestion (alias / subdomain)

~1/3 of visitors block `eu.i.posthog.com`. Two ways to proxy through your own origin — pick one:

**A. Path proxy — no DNS, available now.** The `/ingest` rewrite is already in `next.config.ts`. Set
`NEXT_PUBLIC_POSTHOG_HOST=/ingest` in Vercel, and add `skipTrailingSlashRedirect: true` to
`next.config.ts` (PostHog POSTs must keep trailing slashes). Same-origin, zero DNS. Simplest.

**B. Subdomain — needs DNS (admin).** Use a first-party subdomain like `ph.hackathon-guidebook.com`:
1. In PostHog, create a **managed reverse proxy** → it gives you a CNAME target.
2. Add a DNS `CNAME ph → <target>` (PostHog terminates TLS on the subdomain).
3. Set `NEXT_PUBLIC_POSTHOG_HOST=https://ph.hackathon-guidebook.com` in Vercel, redeploy.

Both are ad-blocker resistant; the subdomain also survives if you ever drop the app rewrite. Do **A**
now; move to **B** when DNS access is available.

## 5. PostHog dashboard

- Enable **Web Analytics**, **Heatmaps**, **Error tracking**. Keep **Session replay OFF** (cookieless).
- Add the production domain(s) to the project's **authorized/allowed domains** (toolbar + web analytics).

## Go-live checklist

- [ ] `NEXT_PUBLIC_POSTHOG_KEY` set in Vercel (Production + Preview) → analytics live
- [ ] Web Analytics / Heatmaps / Error tracking on; replay off; domains authorized
- [ ] `POSTHOG_API_KEY` (Error-tracking write) + `POSTHOG_PROJECT_ID` set → readable error traces
- [ ] Optional: `NEXT_PUBLIC_POSTHOG_HOST=/ingest` (+ add `skipTrailingSlashRedirect`) for ad-blocker resistance
- [ ] Redeploy; confirm a `$pageview` and a test error land in project `220518`
