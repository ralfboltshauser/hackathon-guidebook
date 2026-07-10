/**
 * Frozen event taxonomy — the single source of truth for custom event names.
 * `scripts/event-lint.mjs` fails the build on any `track()` name outside EVENTS or on a
 * PII-looking property key. Naming: object_action, snake_case, past-tense (present-tense for views).
 * NO PII in names or props — this site is cookieless-by-default (see lib/analytics/client.ts).
 *
 * Ported from the NoaIQ marketing site's analytics port; trimmed to the guidebook's surface
 * (Learn/Hack tabs + the phase checklist). Pageviews are the built-in `$pageview` — not listed here.
 */
export const EVENTS = {
  /** Learn ↔ Hack tab switch. Props: `tab`. */
  tab_switched: "tab_switched",
  /** A checklist item was ticked or unticked. Props: `phase`, `checked`. */
  checklist_item_toggled: "checklist_item_toggled",
  /** A user-authored todo was added to a phase group. Props: `phase`. */
  custom_todo_added: "custom_todo_added",
  /** Progress was reset. Props: `scope` ('progress' | 'progress_and_todos'). */
  checklist_reset: "checklist_reset",
} as const;

export type EventName = keyof typeof EVENTS;

/** Every event here is client-fired (this is a static site — no server event seam yet). */
export const CLIENT_EVENTS: readonly EventName[] = [
  "tab_switched",
  "checklist_item_toggled",
  "custom_todo_added",
  "checklist_reset",
];

/** Event property dictionary. Keep additive; never add a key that could carry PII. */
export interface EventProps {
  /** 'learn' | 'hack' — which tab is now active (tab_switched). */
  tab?: "learn" | "hack";
  /** Phase index (0-5: Before…After). Section-level only, never a per-item identifier. */
  phase?: number;
  /** Whether a checklist item is now checked (checklist_item_toggled). */
  checked?: boolean;
  /** What was reset (checklist_reset). */
  scope?: "progress" | "progress_and_todos";
  [key: string]: unknown;
}

export function isEventName(name: string): name is EventName {
  return Object.hasOwn(EVENTS, name);
}
