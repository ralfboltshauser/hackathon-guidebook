# Contributing

This project is a Next.js App Router site with local MD/MDX content.

## Local setup

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm check
```

`pnpm check` runs ESLint, TypeScript typecheck, the analytics taxonomy gate (event-lint + its self-test), duplicate-code detection, and a production build.

## Project structure

- `app/` contains route segments and route-specific UI.
- `components/` contains reusable client and UI components.
- `content/deep-dives/` contains article bodies as `.md` or `.mdx`.
- `lib/` contains shared metadata, registries, and route-independent helpers.
- `mdx-components.tsx` contains global markdown element styling.

## Deep dives

Deep-dive metadata is registry-driven, not frontmatter-driven.

To add a deep dive:

1. Add `content/deep-dives/<slug>/index.md` or `index.mdx`.
2. Add an entry in `lib/deep-dives.ts`.
3. Run `pnpm check`.

Use `.md` for plain writing. Use `.mdx` only when the article needs React guide blocks from `components/deep-dives/mdx`.

## Metadata and OG images

Site constants live in `lib/site.ts`.

Deep-dive metadata lives in `lib/deep-dives.ts` and is consumed by:

- `app/deep-dives/page.tsx`
- `app/deep-dives/[slug]/page.tsx`
- `app/deep-dives/opengraph-image.tsx`
- `app/deep-dives/[slug]/opengraph-image.tsx`

Shared OG image primitives live in `lib/og-image.tsx`.

## Next.js version note

This repo follows Next.js 16. Before changing App Router, metadata, MDX, or image route conventions, read the matching local docs under:

```bash
node_modules/next/dist/docs/
```
