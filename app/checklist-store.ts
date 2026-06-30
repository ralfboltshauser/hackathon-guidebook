"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { guide } from "./guide";

const LEGACY_STORAGE_KEY = "good-boys-hackathon-guide:checklist:v1";
const STORE_STORAGE_KEY = "hackathon-guidebook:checklist:v2";

export type CustomTodo = {
  id: string;
  label: string;
  createdAt: number;
};

type ChecklistStore = {
  done: Record<string, boolean>;
  customTodos: Record<string, CustomTodo[]>;
  toggleCheck: (key: string) => void;
  addCustomTodo: (groupKey: string, label: string) => void;
  removeCustomTodo: (groupKey: string, todoId: string) => void;
  resetProgress: () => void;
  resetProgressAndCustomTodos: () => void;
  migrateLegacyProgress: () => void;
};

export const staticCheckKey = (phaseIdx: number, groupIdx: number, itemIdx: number) =>
  `${phaseIdx}:${groupIdx}:${itemIdx}`;

export const checklistGroupKey = (phaseIdx: number, groupIdx: number) =>
  `${phaseIdx}:${groupIdx}`;

export const customCheckKey = (todoId: string) => `custom:${todoId}`;

export const validStaticCheckKeys = new Set(
  guide.flatMap((phase, phaseIdx) =>
    phase.checklists.flatMap((group, groupIdx) =>
      group.items.map((_, itemIdx) => staticCheckKey(phaseIdx, groupIdx, itemIdx)),
    ),
  ),
);

function createTodoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sanitizeLabel(label: string) {
  return label.trim().replace(/\s+/g, " ").slice(0, 180);
}

function readLegacyProgress() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) => validStaticCheckKeys.has(key) && typeof value === "boolean",
      ),
    ) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      done: {},
      customTodos: {},
      toggleCheck: (key) =>
        set((state) => ({
          done: {
            ...state.done,
            [key]: !state.done[key],
          },
        })),
      addCustomTodo: (groupKey, label) =>
        set((state) => {
          const cleanLabel = sanitizeLabel(label);
          if (!cleanLabel) {
            return state;
          }

          const todo: CustomTodo = {
            id: createTodoId(),
            label: cleanLabel,
            createdAt: Date.now(),
          };

          return {
            customTodos: {
              ...state.customTodos,
              [groupKey]: [...(state.customTodos[groupKey] ?? []), todo],
            },
          };
        }),
      removeCustomTodo: (groupKey, todoId) =>
        set((state) => {
          const remainingTodos = (state.customTodos[groupKey] ?? []).filter(
            (todo) => todo.id !== todoId,
          );
          const nextCustomTodos = { ...state.customTodos };
          const nextDone = { ...state.done };

          delete nextDone[customCheckKey(todoId)];

          if (remainingTodos.length === 0) {
            delete nextCustomTodos[groupKey];
          } else {
            nextCustomTodos[groupKey] = remainingTodos;
          }

          return {
            done: nextDone,
            customTodos: nextCustomTodos,
          };
        }),
      resetProgress: () => set({ done: {} }),
      resetProgressAndCustomTodos: () => set({ done: {}, customTodos: {} }),
      migrateLegacyProgress: () =>
        set((state) => {
          const legacyDone = readLegacyProgress();
          if (Object.keys(legacyDone).length === 0) {
            return state;
          }

          try {
            window.localStorage.removeItem(LEGACY_STORAGE_KEY);
          } catch {
            // Migration is best-effort; keep the current state if storage is blocked.
          }

          return {
            done: {
              ...legacyDone,
              ...state.done,
            },
          };
        }),
    }),
    {
      name: STORE_STORAGE_KEY,
      partialize: (state) => ({
        done: state.done,
        customTodos: state.customTodos,
      }),
    },
  ),
);
