/**
 * Frozen event taxonomy — the single source of truth for custom event names.
 * `scripts/event-lint.mjs` fails the build on any `track()` name outside EVENTS or on a
 * PII-looking property key. Naming: object_action, snake_case, past-tense (present-tense for views).
 * NO PII in names or props — this site is cookieless-by-default (see lib/analytics/client.ts).
 *
 * Built-in PostHog events (NOT listed here, captured automatically): `$pageview` (page opens),
 * `$pageleave` (drives session duration + bounce rate), `$web_vitals` (load performance),
 * `$exception` (error tracking), `$heatmap` (coordinate heatmap).
 */
export const EVENTS = {
  /** Learn ↔ Hack tab switch. Props: `tab`. */
  tab_switched: "tab_switched",
  /** A checklist item was ticked or unticked. Props: `phase`, `checked`. */
  checklist_item_toggled: "checklist_item_toggled",
  /** Every item in a phase's checklist is now done. Props: `phase`. A funnel milestone. */
  checklist_phase_completed: "checklist_phase_completed",
  /** A user-authored todo was added to a phase group. Props: `phase`. */
  custom_todo_added: "custom_todo_added",
  /** Progress was reset. Props: `scope`. */
  checklist_reset: "checklist_reset",
  /** A deep-dive article was opened. Props: `slug`. */
  deep_dive_view: "deep_dive_view",
  /** Light/dark theme was switched. Props: `theme`. */
  theme_toggled: "theme_toggled",
} as const;

export type EventName = keyof typeof EVENTS;

/** Every event here is client-fired (this is a static site — no server event seam yet). */
export const CLIENT_EVENTS: readonly EventName[] = [
  "tab_switched",
  "checklist_item_toggled",
  "checklist_phase_completed",
  "custom_todo_added",
  "checklist_reset",
  "deep_dive_view",
  "theme_toggled",
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
  /** Deep-dive article slug (deep_dive_view), e.g. 'pitch'. Public content id, not PII. */
  slug?: string;
  /** Active theme after a toggle (theme_toggled). */
  theme?: "light" | "dark";
  [key: string]: unknown;
}

export function isEventName(name: string): name is EventName {
  return Object.hasOwn(EVENTS, name);
}
