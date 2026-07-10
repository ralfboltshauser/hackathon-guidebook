#!/usr/bin/env node
/**
 * event-lint — the analytics taxonomy gate. Fails if any track()/capture() call uses a name outside
 * the frozen EVENTS enum (lib/analytics/events.ts), or any event property key looks like PII. This
 * site is cookieless-by-default; no raw email/phone/name/ip should ever reach an event.
 *
 * Ported from the NoaIQ marketing site. Run: `pnpm event-lint`.
 *
 * Scans the FULL file text (not line-by-line) so that `track(` / `capture(` calls whose name sits on
 * the next line are still caught, and so quoted PII keys (`"email":`) are caught alongside bare ones.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { argv } from "node:process";
import { pathToFileURL } from "node:url";

/** PII property-key words. Matched with an optional surrounding quote and a following colon. */
const PII_WORDS =
  "email|phone|first_?name|last_?name|full_?name|ip_address|raw_email|password";
// e.g.  email:   "email":   'phone' :   — but NOT email_sha256 (word boundary before the quote/colon).
const PII_KEY = new RegExp(`(["']?)(${PII_WORDS})\\1\\s*:`, "gi");
// track("name" | capture('name' — allows whitespace/newlines between ( and the quote.
const CALL = /\b(?:track|capture)\(\s*['"]([^'"]+)['"]/g;

/** Parse the allowed event names from the EVENTS enum source. */
export function parseAllowed(eventsSrc) {
  const block = eventsSrc.match(/export const EVENTS = \{([\s\S]*?)\n\}/);
  return new Set([...(block?.[1].matchAll(/^\s*(\w+):/gm) ?? [])].map((m) => m[1]));
}

/** 1-based line number for a character offset in `text`. */
function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === "\n") line++;
  return line;
}

/** Pure: lint one file's text → problem strings. The analytics port itself is exempt. */
export function lintText(rel, text, allowed) {
  if (rel.startsWith("lib/analytics/")) return [];
  const problems = [];

  for (const m of text.matchAll(CALL)) {
    const name = m[1];
    if (!name.startsWith("$") && !allowed.has(name)) {
      problems.push(`${rel}:${lineAt(text, m.index)}  unknown event "${name}"`);
    }
  }

  for (const m of text.matchAll(PII_KEY)) {
    // `email_sha256` is the one allowed hashed form; the \b in the match already excludes it, but
    // keep an explicit guard in case the surrounding token changes.
    const around = text.slice(m.index, m.index + m[0].length + 8);
    if (/sha256/i.test(around)) continue;
    problems.push(`${rel}:${lineAt(text, m.index)}  PII-looking property key "${m[2]}"`);
  }

  return problems;
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(full) && !/\.test\./.test(full)) out.push(full);
  }
  return out;
}

export function run(root = process.cwd()) {
  const allowed = parseAllowed(readFileSync(join(root, "lib/analytics/events.ts"), "utf8"));
  if (allowed.size === 0) throw new Error("event-lint — could not parse EVENTS enum.");
  const problems = [];
  for (const base of ["app", "components", "lib"]) {
    for (const file of walk(join(root, base))) {
      const rel = relative(root, file).split(sep).join("/");
      problems.push(...lintText(rel, readFileSync(file, "utf8"), allowed));
    }
  }
  return { allowed, problems };
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
  const { allowed, problems } = run();
  if (problems.length) {
    console.error(`✖ event-lint — ${problems.length} issue(s):\n`);
    for (const p of problems) console.error(`  ${p}`);
    console.error(
      "\nAdd new events to the frozen EVENTS enum in lib/analytics/events.ts, or remove PII keys.",
    );
    process.exit(1);
  }
  console.log(
    `✓ event-lint — all track() names in the frozen enum (${allowed.size} events); no PII keys.`,
  );
}
