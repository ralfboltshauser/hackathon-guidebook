#!/usr/bin/env node
/**
 * event-lint — the analytics taxonomy gate. Fails if any track()/capture() call uses a name outside
 * the frozen EVENTS enum (lib/analytics/events.ts), or any event property key looks like PII. This
 * site is cookieless-by-default; no raw email/phone/name/ip should ever reach an event.
 *
 * Ported from the NoaIQ marketing site. Run: `pnpm event-lint`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { argv } from "node:process";
import { pathToFileURL } from "node:url";

export const PII =
  /\b(email|phone|first_?name|last_?name|full_?name|ip_address|raw_email|password)\b/i;

/** Parse the allowed event names from the EVENTS enum source. */
export function parseAllowed(eventsSrc) {
  const block = eventsSrc.match(/export const EVENTS = \{([\s\S]*?)\n\}/);
  return new Set([...(block?.[1].matchAll(/^\s*(\w+):/gm) ?? [])].map((m) => m[1]));
}

/** Pure: lint one file's text → problem strings. The analytics port itself is exempt. */
export function lintText(rel, text, allowed) {
  if (rel.startsWith("lib/analytics/")) return [];
  const problems = [];
  text.split("\n").forEach((line, i) => {
    const call = line.match(/\b(?:track|capture)\(\s*['"]([^'"]+)['"]/);
    if (call && !call[1].startsWith("$") && !allowed.has(call[1]))
      problems.push(`${rel}:${i + 1}  unknown event "${call[1]}"`);
    const pii = line.match(PII);
    if (pii && !/email_sha256/.test(line) && new RegExp(`${pii[0]}\\s*[:=]`).test(line)) {
      problems.push(`${rel}:${i + 1}  PII-looking property key "${pii[0]}"`);
    }
  });
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
