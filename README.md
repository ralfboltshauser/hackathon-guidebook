# Good Boys Hackathon Guide

A private, field-tested hackathon guidebook for teams that want to compete seriously.

It combines two modes:

- **Learn**: the principles, phases, and operating lessons behind the process.
- **Hack**: a phase-by-phase checklist that can be used during an actual hackathon.

The guide is based on repeated hackathon experience, with proof assets, pitch links, and practical workflows baked into the interface.

## Live Site

Production runs at:

[hackathons.ralfboltshauser.com](https://hackathons.ralfboltshauser.com)

The site is intentionally private. It is protected with a password-only gate in [`proxy.ts`](./proxy.ts), and the password is stored as a Vercel environment variable.

## Privacy

This project is intentionally not discoverable.

- `robots.txt` disallows all crawling.
- Every page emits `noindex` / `nofollow` metadata.
- Every response includes an `X-Robots-Tag` header.
- Auth failures also return noindex headers.
- Static proof images are behind the same auth boundary.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Framer Motion
- Lucide React
- Vercel Analytics
- Vercel deployment

## Local Development

Install dependencies:

```bash
pnpm install
```

Run locally with a password:

```bash
SITE_PASSWORD=local-password pnpm dev
```

## Environment Variables

Required in deployed environments:

```bash
SITE_PASSWORD=...
```

Never commit real credentials. Vercel production credentials are configured through Vercel environment variables.

## Checks

Run lint:

```bash
pnpm lint
```

Run production build:

```bash
pnpm build
```

## Project Shape

```txt
app/
  Guidebook.tsx        Main guidebook UI
  guide.ts             Guide content and checklist data
  layout.tsx           Metadata, fonts, analytics
  robots.ts            Disallow-all robots route
  opengraph-image.tsx  Social preview image
  twitter-image.tsx    Twitter preview image
  icon.png             App icon
  apple-icon.png       Apple touch icon
  favicon.ico          Browser favicon

public/
  hackathon-proof/     Hackathon proof photos

proxy.ts               Password gate + noindex response headers
next.config.ts         Global noindex headers
```
