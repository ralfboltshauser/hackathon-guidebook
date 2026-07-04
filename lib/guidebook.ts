import {
  checklistGroupKey,
  customCheckKey,
  staticCheckKey,
  type CustomTodo,
} from "@/app/checklist-store";
import { guide, type Phase } from "@/app/guide";

export type Mode = "learn" | "hack";

export const isMode = (value: string | null): value is Mode =>
  value === "learn" || value === "hack";

export function clampPhase(value: number) {
  return Math.min(Math.max(value, 0), guide.length - 1);
}

export function scrollToPhase(i: number, smooth = true) {
  document
    .getElementById(`phase-${i}`)
    ?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

export function readInitialState() {
  if (typeof window === "undefined") {
    return { mode: "learn" as Mode, phaseIdx: 0 };
  }

  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  const mode = isMode(tab) ? tab : "learn";
  const phaseParam = Number(params.get("phase"));
  const phaseIdx = Number.isInteger(phaseParam) ? clampPhase(phaseParam - 1) : 0;

  return { mode, phaseIdx };
}

export function writeViewStateToUrl(mode: Mode, phaseIdx: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", mode);
  url.searchParams.set("phase", String(phaseIdx + 1));
  window.history.replaceState(null, "", url);
}

export const itemCount = (phase: Phase) =>
  phase.checklists.reduce((sum, checklist) => sum + checklist.items.length, 0);

export const totalChecks = guide.reduce(
  (sum, phase) => sum + itemCount(phase),
  0,
);

export const phaseComplete = (
  phaseIdx: number,
  done: Record<string, boolean>,
  customTodos: Record<string, CustomTodo[]>,
) =>
  guide[phaseIdx].checklists.every((group, groupIdx) => {
    const builtInComplete = group.items.every(
      (_, itemIdx) => done[staticCheckKey(phaseIdx, groupIdx, itemIdx)],
    );
    const customComplete = (
      customTodos[checklistGroupKey(phaseIdx, groupIdx)] ?? []
    ).every((todo) => done[customCheckKey(todo.id)]);

    return builtInComplete && customComplete;
  });

export const customTodoCount = (customTodos: Record<string, CustomTodo[]>) =>
  Object.values(customTodos).reduce((sum, todos) => sum + todos.length, 0);

export function isEditableTarget(target: EventTarget) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}
