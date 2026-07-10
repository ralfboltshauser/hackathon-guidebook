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
 * Handles multi-line calls, comments between `track` and `(`, regex/division, quoted/shorthand/computed
 * property keys, snake_case AND camelCase PII keys (normalized before matching), and executable MDX under
 * content/. It also forbids importing `posthog-js` outside `lib/analytics/`, which closes the
 * `posthog.capture(...)` member-call escape (that call form only exists behind a direct import).
 * Accepted static-analysis limits (documented, not bugs — an AST rule would close them, but the repo
 * calls the bare `track(...)` helper, so none occur): a dynamic event NAME (variable/template) isn't
 * validated, `$`-prefixed names are allowed, and generic/optional call forms (`track<T>(…)`,
 * `track?.(…)`) aren't matched.
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
  // Normalize camelCase → snake_case first, so `userEmail`/`phoneNumber`/`emailAddress` are caught like
  // their snake_case forms. JS's default key casing has no `_`, so it would otherwise slip straight past
  // the `_`-delimited PII_TOKEN boundaries — and nothing enforces snake_case, so this was a real hole.
  const norm = key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
  if (norm === "email_sha256" || /_(sha256|hash|hashed)$/.test(norm)) return false; // hashed forms are ok
  return PII_TOKEN.test(norm);
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

/** Keywords after which a `/` begins a regex literal (not division). */
const REGEX_PRECEDING_KEYWORDS = new Set([
  "return", "typeof", "instanceof", "in", "of", "case", "do", "else", "void", "delete", "new", "yield",
  "await", "throw",
]);

/** Tokenize JS/TS into { type: 'string'|'ident'|'punct'|'regex', text?, quote?, index }. Comments are
 *  dropped; string escapes (`\"`, `\\`) and regex literals are handled so neither can run past its
 *  terminator or unbalance parens. */
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
    } else if (c === "/") {
      // A lone `/` is a regex literal in expression position, else division. Getting this right matters:
      // a regex containing a quote/paren (e.g. `s.replace(/["']/g, "")`) would otherwise open a phantom
      // string / unbalance parens and silently disable the gate for the rest of the file (fail-open).
      const prev = toks[toks.length - 1];
      const isDivision =
        prev &&
        (prev.type === "string" ||
          prev.type === "regex" ||
          prev.type === "number" ||
          (prev.type === "ident" && !REGEX_PRECEDING_KEYWORDS.has(prev.text)) ||
          (prev.type === "punct" && (prev.text === ")" || prev.text === "]")));
      if (isDivision) {
        toks.push({ type: "punct", text: "/", index: i });
        i++;
      } else {
        const index = i;
        i++;
        let inClass = false;
        while (i < n) {
          const ch = src[i];
          if (ch === "\\") {
            i += 2;
            continue;
          }
          if (ch === "\n") break; // unterminated — bail rather than run away
          if (ch === "[") inClass = true;
          else if (ch === "]") inClass = false;
          else if (ch === "/" && !inClass) {
            i++;
            break;
          }
          i++;
        }
        while (i < n && /[a-z]/i.test(src[i])) i++; // flags
        toks.push({ type: "regex", index });
      }
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
        } else if (src[i] === "\n" && quote !== "`") {
          break; // '/" strings can't span lines — bail so a stray quote can't run to EOF
        } else {
          text += src[i];
          i++;
        }
      }
      toks.push({ type: "string", text, quote, index });
    } else if (/[0-9]/.test(c)) {
      // Number literal — so a `/` after it (e.g. `100 / total`) lexes as division, not a regex.
      const index = i;
      while (i < n && /[0-9._a-zA-Z]/.test(src[i])) i++; // covers hex/exp/bigint/separators
      toks.push({ type: "number", index });
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

  // The analytics port is the ONLY module allowed to import posthog-js. A direct import elsewhere lets
  // code call `posthog.capture("evt", { email })` — a member call the taxonomy/PII scan below can't reach
  // (it only matches the bare `track(`/`capture(` helper) — so forbid the import and route everyone
  // through the typed `@/lib/analytics` helpers. Token-based (comments are stripped), so no false positives.
  for (const tok of toks) {
    if (tok.type === "string" && tok.text === "posthog-js") {
      problems.push(`${rel}:${lineAt(text, tok.index)}  direct posthog-js import — use the typed helpers in @/lib/analytics instead`);
      break;
    }
  }

  for (let t = 0; t < toks.length; t++) {
    const tok = toks[t];
    // Our helper is a bare `track(...)`/`capture(...)`; exclude unrelated methods like `chart.capture(`
    // or `audio.track(` (a leading `.`) so they don't false-fail as unknown events.
    const isCall =
      tok.type === "ident" &&
      (tok.text === "track" || tok.text === "capture") &&
      isPunct(toks[t + 1], "(") &&
      !isPunct(toks[t - 1], ".");
    if (!isCall) continue;

    // Event name = first arg, only if it's a plain (non-template) string literal.
    const first = toks[t + 2];
    if (first?.type === "string" && first.quote !== "`") {
      if (!first.text.startsWith("$") && !allowed.has(first.text)) {
        problems.push(`${rel}:${lineAt(text, tok.index)}  unknown event "${first.text}"`);
      }
    }

    // Walk the call's arg tokens (balanced parens) for PII property keys. Skip keys inside a TS type
    // annotation object (`data as { email: string }`) — a type member is a name, not runtime data.
    let depth = 0;
    const typeBrace = [];
    for (let j = t + 1; j < toks.length; j++) {
      const a = toks[j];
      if (isPunct(a, "(")) depth++;
      else if (isPunct(a, ")")) {
        if (--depth === 0) break;
      } else if (isPunct(a, "{")) {
        const p = toks[j - 1];
        typeBrace.push(p?.type === "ident" && (p.text === "as" || p.text === "satisfies"));
      } else if (isPunct(a, "}")) {
        typeBrace.pop();
      } else if (!typeBrace.some(Boolean)) {
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
  // Root-level executable seams that live outside those dirs (instrumentation-client.ts is the canonical
  // spot for client PostHog init, so a track()/PII there must be governed too).
  for (const f of ["instrumentation-client.ts", "instrumentation.ts", "middleware.ts", "mdx-components.tsx"]) {
    const full = join(root, f);
    try {
      statSync(full);
    } catch {
      continue; // absent — skip
    }
    problems.push(...lintText(f, readFileSync(full, "utf8"), allowed));
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
