#!/usr/bin/env node
/**
 * event-lint — the analytics taxonomy + PII gate. Fails if any track()/capture() call uses a name
 * outside the frozen EVENTS enum (lib/analytics/events.ts), or passes a PII-looking property key.
 * The site is cookieless-by-default; no raw email/phone/name/ip should ever reach an event.
 *
 * Uses a small tokenizer (comments skipped; strings tokenized with proper escape handling) instead of
 * raw-text regexes, so it does NOT: false-fail on a PII word inside a string VALUE or a COMMENT
 * (e.g. `location: "email:footer"`, `// track("old")`); nor silently fail OPEN when a string arg
 * contains an escaped quote/backslash. A property key is only counted in real object-key position
 * (preceded by `{` or `,`, followed by `:`), so ternary/label colons don't false-positive.
 *
 * Handles multi-line calls, comments between `track` and `(`, quoted/shorthand/computed property keys,
 * and executable MDX under content/. Remaining static-analysis limit (documented, not a bug): a dynamic
 * event NAME (a variable or template literal) can't be validated, and `$`-prefixed names are allowed.
 * Regression fixtures live in scripts/event-lint.test.mjs. Ported from the NoaIQ marketing site.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { argv } from "node:process";
import { pathToFileURL } from "node:url";

/** A property key is PII if a `_`-delimited token is a PII word. Boundaries avoid `microphone`→`phone`
 *  etc.; `mobile`/`zip` deliberately excluded (viewport/postcode ambiguity). */
const PII_TOKEN =
  /(?:^|_)(email|phone|telephone|password|passwd|pwd|ssn|dob|firstname|lastname|fullname|surname)(?:_|$)|(?:^|_)(first|last|full)_?name(?:_|$)|(?:^|_)ip(?:_?addr(?:ess)?)?(?:_|$)/i;

function isPiiKey(key) {
  if (key === "email_sha256" || /_(sha256|hash|hashed)$/i.test(key)) return false; // hashed forms are ok
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

/** Tokenize JS/TS into { type: 'string'|'ident'|'punct', text, quote?, index }. Comments are dropped;
 *  string escapes (`\"`, `\\`) are handled so a string can't run past its terminator. */
function tokenize(src) {
  const toks = [];
  const n = src.length;
  let i = 0;
  while (i < n) {
    const c = src[i];
    if (c === "/" && src[i + 1] === "/") {
      i += 2;
      while (i < n && src[i] !== "\n") i++;
    } else if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
    } else if (c === '"' || c === "'" || c === "`") {
      const index = i;
      const quote = c;
      i++;
      let text = "";
      while (i < n) {
        if (src[i] === "\\") {
          text += src[i + 1] ?? "";
          i += 2;
        } else if (src[i] === quote) {
          i++;
          break;
        } else {
          text += src[i];
          i++;
        }
      }
      toks.push({ type: "string", text, quote, index });
    } else if (/[A-Za-z_$]/.test(c)) {
      const index = i;
      let text = "";
      while (i < n && /[\w$]/.test(src[i])) {
        text += src[i];
        i++;
      }
      toks.push({ type: "ident", text, index });
    } else if (/\s/.test(c)) {
      i++;
    } else {
      toks.push({ type: "punct", text: c, index: i });
      i++;
    }
  }
  return toks;
}

const isPunct = (tok, ch) => tok?.type === "punct" && tok.text === ch;

/** If token `j` is a property key — `key:` / `"key":` (bare or quoted), `{ key }` (shorthand), or
 *  `["key"]:` (computed) in real object-key position — return its name; else null. The position checks
 *  keep ternary/label colons, array elements, and property access from being read as keys. */
function keyAt(toks, j) {
  const a = toks[j];
  if (!a || (a.type !== "ident" && a.type !== "string")) return null;
  const prev = toks[j - 1];
  const next = toks[j + 1];
  const inObjPos = isPunct(prev, "{") || isPunct(prev, ",");
  if (isPunct(next, ":") && inObjPos) return a.text; // { key: … }  /  , "key": …
  if (a.type === "ident" && inObjPos && (isPunct(next, ",") || isPunct(next, "}"))) return a.text; // { key }
  if (
    a.type === "string" &&
    isPunct(prev, "[") &&
    (isPunct(toks[j - 2], "{") || isPunct(toks[j - 2], ",")) &&
    isPunct(next, "]") &&
    isPunct(toks[j + 2], ":")
  )
    return a.text; // { ["key"]: … }
  return null;
}

/** Pure: lint one file's text → problem strings. The analytics port itself is exempt. */
export function lintText(rel, text, allowed) {
  if (rel.startsWith("lib/analytics/")) return [];
  const toks = tokenize(text);
  const problems = [];

  for (let t = 0; t < toks.length; t++) {
    const tok = toks[t];
    const isCall =
      tok.type === "ident" && (tok.text === "track" || tok.text === "capture") && isPunct(toks[t + 1], "(");
    if (!isCall) continue;

    // Event name = first arg, only if it's a plain (non-template) string literal.
    const first = toks[t + 2];
    if (first?.type === "string" && first.quote !== "`") {
      if (!first.text.startsWith("$") && !allowed.has(first.text)) {
        problems.push(`${rel}:${lineAt(text, tok.index)}  unknown event "${first.text}"`);
      }
    }

    // Walk the call's arg tokens (balanced parens) for PII property keys in real key position:
    // a bare ident or quoted string, preceded by `{`/`,` and followed by `:`.
    let depth = 0;
    for (let j = t + 1; j < toks.length; j++) {
      const a = toks[j];
      if (isPunct(a, "(")) depth++;
      else if (isPunct(a, ")")) {
        if (--depth === 0) break;
      } else {
        const key = keyAt(toks, j);
        if (key !== null && isPiiKey(key)) {
          problems.push(`${rel}:${lineAt(text, a.index)}  PII-looking property key "${key}"`);
        }
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
    // Cover every source the repo can execute: tsconfig allowJs + next pageExtensions, plus the
    // MDX/markdown under content/ that Next compiles (a track()/PII in an MDX file must be governed).
    else if (/\.(ts|tsx|js|jsx|mjs|cjs|mts|cts|md|mdx)$/.test(full) && !/\.test\./.test(full))
      out.push(full);
  }
  return out;
}

export function run(root = process.cwd()) {
  const allowed = parseAllowed(readFileSync(join(root, "lib/analytics/events.ts"), "utf8"));
  if (allowed.size === 0) throw new Error("event-lint — could not parse EVENTS enum.");
  const problems = [];
  for (const base of ["app", "components", "lib", "content"]) {
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
