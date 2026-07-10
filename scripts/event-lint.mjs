#!/usr/bin/env node
/**
 * event-lint — the analytics taxonomy gate. Fails if any track()/capture() call uses a name outside
 * the frozen EVENTS enum (lib/analytics/events.ts), or passes a PII-looking property key. This site is
 * cookieless-by-default; no raw email/phone/name/ip should ever reach an event.
 *
 * Design: checks are scoped to the ARGUMENTS of each track()/capture() call (extracted by balancing
 * parens + skipping string literals), not the whole file. That means:
 *   - multi-line calls and namespaced keys (`phone_number`, `"user_email"`) are caught, and
 *   - UI text / comments / placeholders like `<label>Email:</label>` never false-positive,
 *     because they aren't inside a track() call.
 * Ported from the NoaIQ marketing site. Run: `pnpm event-lint`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { argv } from "node:process";
import { pathToFileURL } from "node:url";

/**
 * A property key is PII if one of its `_`-delimited tokens is a PII word. Token boundaries prevent
 * false positives like `telephone`→`phone` handled as substrings (`microphone`/`headphone` never match)
 * while catching `phone_number`, `email_address`, `user_email`, `home_phone`, etc.
 */
const PII_TOKEN =
  /(?:^|_)(email|phone|telephone|mobile|password|passwd|pwd|ssn|dob|firstname|lastname|fullname|surname)(?:_|$)|(?:^|_)(first|last|full)_?name(?:_|$)|(?:^|_)ip(?:_?addr(?:ess)?)?(?:_|$)/i;

function isPiiKey(key) {
  // The hashed email form (and any *_hash/_sha256 key) is the allowed, non-PII shape.
  if (key === "email_sha256" || /_(sha256|hash|hashed)$/i.test(key)) return false;
  return PII_TOKEN.test(key);
}

/** Parse the allowed event names from the EVENTS enum source. */
export function parseAllowed(eventsSrc) {
  const block = eventsSrc.match(/export const EVENTS = \{([\s\S]*?)\n\}/);
  return new Set([...(block?.[1].matchAll(/^\s*(\w+):/gm) ?? [])].map((m) => m[1]));
}

/** 1-based line number for a character offset in `text`. */
function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text[i] === "\n") line++;
  return line;
}

/**
 * Extract each track()/capture() call as { nameStart, argsStart, args } by scanning from `(` and
 * balancing parens while skipping string/template literals. Bails on a call that doesn't close within
 * a sane window (treated as unparseable rather than over-scanning the file).
 */
function extractCalls(text) {
  const calls = [];
  const head = /\b(?:track|capture)\(/g;
  let m;
  while ((m = head.exec(text))) {
    const open = m.index + m[0].length - 1; // index of '('
    let depth = 0;
    let str = null; // current string delimiter, or null
    let i = open;
    const limit = Math.min(text.length, open + 5000);
    for (; i < limit; i++) {
      const ch = text[i];
      if (str) {
        if (ch === str && text[i - 1] !== "\\") str = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") str = ch;
      else if (ch === "(") depth++;
      else if (ch === ")" && --depth === 0) {
        i++;
        break;
      }
    }
    if (depth === 0 && i > open) {
      calls.push({ nameStart: m.index, argsStart: open + 1, args: text.slice(open + 1, i - 1) });
    }
  }
  return calls;
}

/** Pure: lint one file's text → problem strings. The analytics port itself is exempt. */
export function lintText(rel, text, allowed) {
  if (rel.startsWith("lib/analytics/")) return [];
  const problems = [];

  for (const call of extractCalls(text)) {
    // Event name: only a leading string LITERAL is validated (a variable/template name can't be).
    const name = call.args.match(/^\s*['"]([^'"]+)['"]/);
    if (name && !name[1].startsWith("$") && !allowed.has(name[1])) {
      problems.push(`${rel}:${lineAt(text, call.nameStart)}  unknown event "${name[1]}"`);
    }
    // PII property keys inside THIS call's argument object (quoted or bare).
    for (const k of call.args.matchAll(/(["'`]?)([A-Za-z_$][\w$]*)\1\s*:/g)) {
      if (isPiiKey(k[2])) {
        problems.push(
          `${rel}:${lineAt(text, call.argsStart + k.index)}  PII-looking property key "${k[2]}"`,
        );
      }
    }
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
