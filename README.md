# Good Boys Hackathon Guide

A practical guide and checklist for running hackathons with a win-oriented team.

## Development

```bash
pnpm install
SITE_PASSWORD=local-password pnpm dev
```

The site is protected with HTTP Basic Auth in `proxy.ts`.
Set `SITE_PASSWORD` in every deployed environment. `SITE_USERNAME` is optional
and defaults to `ralf`.

## Checks

```bash
pnpm lint
pnpm build
```
