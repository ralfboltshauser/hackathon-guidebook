#!/usr/bin/env node
/**
 * Regression fixtures for event-lint (scripts/event-lint.mjs). Run: `pnpm event-lint:test`.
 * Guards the gate itself against the fail-open / false-positive classes raised in review. Exits 1 on
 * any mismatch. `expect` is the number of problems `lintText` should report for the snippet.
 */
import { lintText, parseAllowed } from "./event-lint.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const allowed = parseAllowed(readFileSync(join(root, "lib/analytics/events.ts"), "utf8"));

const CASES = [
  // — must NOT flag (false-positive guards) —
  ["string value with a PII word", 'track("cta_click", { location: "email:footer" });', 0],
  ["line comment call", '// track("removed_event")\nconst x = 1;', 0],
  ["block comment call", '/** e.g. track("legacy_evt") */\nconst y = 2;', 0],
  ["JSDoc with a stray )", '/* a ) here */ track("tab_switched", { tab: "hack" });', 0],
  ["ternary value, not a key", 'track("tab_switched", { v: f ? user_email : null });', 0],
  ["viewport prop, not PII", 'track("tab_switched", { is_mobile: true, mobile_nav: false });', 0],
  ["array element, not a key", 'track("tab_switched", { items: [a, email] });', 0],
  ["property access, not a key", 'track("tab_switched", { v: obj.email });', 0],
  ["hashed email allowed", 'track("theme_toggled", { email_sha256: h });', 0],
  ["known event, safe props", 'track("checklist_item_toggled", { phase: 2, checked: true });', 0],

  // — MUST flag (bypass guards) —
  ["unknown event name", 'track("totally_unknown_event", { tab: "x" });', 1],
  ["bare PII key", 'track("tab_switched", { phone: p });', 1],
  ["quoted PII key", 'track("tab_switched", { "user_email": x });', 1],
  ["namespaced PII key", 'track("tab_switched", { phone_number: p });', 1],
  ["escaped backslash before PII key (fail-closed)", 'track("tab_switched", { path: "C:\\\\", user_email: v });', 1],
  ["comment between track and (", 'track /* note */ ("tab_switched", { email: v });', 1],
  ["object shorthand PII key", 'track("tab_switched", { email });', 1],
  ["computed PII key", 'track("tab_switched", { ["email"]: v });', 1],
  ["multiline unknown + two PII keys", 'track(\n "made_up",\n { "email": a, phone_number: b }\n);', 3],
];

let failed = 0;
for (const [label, src, expect] of CASES) {
  const got = lintText("app/probe.tsx", src, allowed).length;
  const ok = got === expect;
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${label}  (expected ${expect}, got ${got})`);
}

if (failed) {
  console.error(`\n✖ event-lint regression: ${failed} case(s) failed.`);
  process.exit(1);
}
console.log(`\n✓ event-lint regression: ${CASES.length} cases pass.`);
