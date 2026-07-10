<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Analytics — cookieless PostHog ("Pulse Talk")

Cookieless-by-default PostHog (EU, project `220518`): page opens, session duration, web vitals,
heatmaps, error tracking, and typed product events. No cookie banner.

- **Full docs:** [`docs/analytics.md`](./docs/analytics.md)
- **The port (edit only here):** `lib/analytics/` — add events to `events.ts`, fire via `track()`
  (`import { track } from "@/lib/analytics"`), or add `data-cta="label"` for automatic CTA tracking.
- **Invariants — do NOT change** in `lib/analytics/client.ts`: `autocapture:false`,
  `persistence:'memory'`, `cookieless_mode:'always'`, session replay off. **No PII** in event names or
  property keys (enforced by `pnpm event-lint`); URL/referrer/heatmap PII is stripped in `beforeSend`.

# Skills & tooling (works with any agent)

Agent-agnostic — read the file and follow it, regardless of which agent you are.

- **`.claude/skills/pulse/SKILL.md`** — fetch & analyze PostHog data; add new tracking.
- **`.claude/skills/resolve-pr-comments/SKILL.md`** — triage & resolve PR review comments. Bundled
  scripts (any agent): `pr-threads.sh` (list threads + IDs), `pr-resolve.sh` (reply + resolve).
- **PostHog MCP** — query project `220518` directly. Configured for **Claude Code** (`.mcp.json`) and
  **Codex** (`.codex/config.toml`); both point at `https://mcp.posthog.com/mcp` (log in on first use).

# Quality gate

Run before pushing: **`pnpm check`** = `lint` + `typecheck` + `event-lint` + duplicate-check + `build`.
