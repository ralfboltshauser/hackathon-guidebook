# Hackathon Guidebook

[hackathon-guidebook.com](https://www.hackathon-guidebook.com)

We've won at Start Hack, ETH AI Hack, BaselHack, Moin Hack, ETH Agentic Systems Hack, and IBM Bobathon. CHF 10k+ in prizes over the last few years. This is the system behind it.

## What this is

The thing most teams get wrong: they think winning is about who builds the most. It isn't. It's about who reads the jury, picks the right challenge, builds only what gets shown in the pitch, and delivers a story that makes the room want them to win.

Six phases: Before, Start, During, Final Hours, Pitch, After. Each has a guide (Learn tab) and a checklist (Hack tab).

The site also has a Deep Dives section for longer draft articles on specific
topics such as pitching, teaser videos, demo reliability, challenge selection,
team roles, and post-hackathon follow-up.

## Who this is for

Anyone showing up to a hackathon to win, first time or tenth.

If you're there to explore or have fun, this is probably overkill.

## How to use it

Before: read through the Learn tab, all six phases. Do it before you arrive.

During: keep the Hack tab open and work through the checklists. Every step you skip lowers your odds.

## Development

```bash
pnpm install
pnpm dev
```

Run the full local gate before pushing:

```bash
pnpm check
```

`pnpm check` runs linting, typecheck, the analytics taxonomy gate (with self-test), duplicate-code
detection, and a production build.

## Analytics

The site runs cookieless PostHog (no cookie banner): page opens, session duration,
web vitals, heatmaps, error tracking, and typed product events. See
[`docs/analytics.md`](./docs/analytics.md) for the setup, taxonomy, and how to add events, and
[`docs/analytics-production.md`](./docs/analytics-production.md) for the production setup.

## Content architecture

Deep-dive article bodies live in `content/deep-dives/<slug>/index.md` or
`index.mdx`.

Metadata is intentionally centralized in `lib/deep-dives.ts` instead of
frontmatter. The registry powers the library page, article pages, sitemap,
metadata, related articles, and generated OG images.

Use `.md` for plain prose and `.mdx` when an article needs React components from
`components/deep-dives/mdx`.

## Who this is from

Written by [Ralf Boltshauser](https://www.linkedin.com/in/ralfboltshauser/) with experiences from Samuel Baumgartner, Marco Pagano, and Lionel Ding.

Konrad te Heesen, Lukas Strickler, Marco Ginanesini, and Franz Dieter extended it with their own experience and point of view.
