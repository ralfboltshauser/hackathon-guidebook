"use client";

import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { GuidebookHeader } from "@/components/guidebook/GuidebookHeader";
import { HackView } from "@/components/guidebook/HackView";
import { LearnView } from "@/components/guidebook/LearnView";
import {
  clampPhase,
  customTodoCount,
  phaseComplete,
  readInitialState,
  scrollToPhase,
  totalChecks,
  writeViewStateToUrl,
  type Mode,
} from "@/lib/guidebook";
import { useChecklistStore } from "./checklist-store";

export function Guidebook() {
  const [mode, setMode] = useState<Mode>("learn");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [pendingScrollPhase, setPendingScrollPhase] = useState<number | null>(null);
  const done = useChecklistStore((state) => state.done);
  const customTodos = useChecklistStore((state) => state.customTodos);
  const toggleCheck = useChecklistStore((state) => state.toggleCheck);
  const addCustomTodo = useChecklistStore((state) => state.addCustomTodo);
  const removeCustomTodo = useChecklistStore((state) => state.removeCustomTodo);
  const resetProgress = useChecklistStore((state) => state.resetProgress);
  const resetProgressAndCustomTodos = useChecklistStore(
    (state) => state.resetProgressAndCustomTodos,
  );
  const migrateLegacyProgress = useChecklistStore(
    (state) => state.migrateLegacyProgress,
  );
  const allDone = Object.values(done).filter(Boolean).length;
  const allChecks = totalChecks + customTodoCount(customTodos);

  // Single place that changes tab (mode). Emits tab_switched only on a real transition, regardless of
  // which control triggered it (tab bar, checklist-open, logo) — no same-tab false positives, no
  // silent switches.
  const setViewState = useCallback(
    (nextMode: Mode, nextPhaseIdx: number) => {
      const safePhaseIdx = clampPhase(nextPhaseIdx);
      if (nextMode !== mode) void track("tab_switched", { tab: nextMode });
      setMode(nextMode);
      setPhaseIdx(safePhaseIdx);
      writeViewStateToUrl(nextMode, safePhaseIdx);
    },
    [mode],
  );

  const setPhase = useCallback(
    (nextPhaseIdx: number | ((current: number) => number)) => {
      const resolvedPhaseIdx = clampPhase(
        typeof nextPhaseIdx === "function"
          ? nextPhaseIdx(phaseIdx)
          : nextPhaseIdx,
      );

      setPhaseIdx(resolvedPhaseIdx);
      writeViewStateToUrl(mode, resolvedPhaseIdx);
    },
    [mode, phaseIdx],
  );

  const selectMode = (nextMode: Mode) => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setViewState(nextMode, phaseIdx); // tab_switched is emitted centrally in setViewState
  };

  // Resolve the phase index for any checklist key: `phaseIdx:groupIdx:itemIdx` (static) encodes it in
  // the leading segment; `custom:<id>` requires looking the todo up in customTodos (its groupKey is
  // `phaseIdx:groupIdx`). Returns undefined only if the key is unrecognized.
  const phaseForKey = (key: string): number | undefined => {
    if (/^\d+:/.test(key)) return Number.parseInt(key.split(":")[0], 10);
    if (key.startsWith("custom:")) {
      const todoId = key.slice("custom:".length);
      for (const [groupKey, todos] of Object.entries(customTodos)) {
        if (todos.some((todo) => todo.id === todoId)) {
          return Number.parseInt(groupKey.split(":")[0], 10);
        }
      }
    }
    return undefined;
  };

  const handleToggleCheck = (key: string) => {
    const phase = phaseForKey(key);
    const nowChecked = !done[key];

    void track("checklist_item_toggled", { phase, checked: nowChecked });

    // Fire the phase-completion milestone when THIS toggle finishes the phase (transition only, so it
    // fires exactly once). Works for static and custom-todo toggles alike, since phaseForKey + the
    // nextDone snapshot both account for custom todos.
    if (phase !== undefined && nowChecked) {
      const nextDone = { ...done, [key]: true };
      if (
        !phaseComplete(phase, done, customTodos) &&
        phaseComplete(phase, nextDone, customTodos)
      ) {
        void track("checklist_phase_completed", { phase });
      }
    }

    toggleCheck(key);
  };

  const handleAddCustomTodo = (groupKey: string, label: string) => {
    const phase = Number.parseInt(groupKey.split(":")[0], 10);
    void track("custom_todo_added", { phase: Number.isNaN(phase) ? undefined : phase });
    addCustomTodo(groupKey, label);
  };

  const handleResetProgress = () => {
    void track("checklist_reset", { scope: "progress" });
    resetProgress();
  };

  const handleResetProgressAndCustomTodos = () => {
    void track("checklist_reset", { scope: "progress_and_todos" });
    resetProgressAndCustomTodos();
  };

  const openChecklist = (i: number) => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setViewState("hack", i);
  };

  const selectPhase = (i: number) => {
    setPhase(i);

    if (mode === "learn") {
      setPendingScrollPhase(i);
      scrollToPhase(i);
    }
  };

  useEffect(() => {
    migrateLegacyProgress();
  }, [migrateLegacyProgress]);

  useEffect(() => {
    const initialState = readInitialState();
    const frame = window.requestAnimationFrame(() => {
      setMode(initialState.mode);
      setPhaseIdx(initialState.phaseIdx);

      if (initialState.mode === "learn" && initialState.phaseIdx > 0) {
        scrollToPhase(initialState.phaseIdx, false);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen bg-page font-serif text-ink">
      <GuidebookHeader
        mode={mode}
        phaseIdx={phaseIdx}
        done={done}
        customTodos={customTodos}
        onLogoClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          setViewState("learn", 0);
        }}
        onModeChange={selectMode}
        onPhaseSelect={selectPhase}
      />

      {mode === "learn" ? (
        <LearnView
          initialPhase={phaseIdx}
          pendingScrollPhase={pendingScrollPhase}
          onActivePhase={setPhase}
          onPendingScrollSettled={() => setPendingScrollPhase(null)}
          onOpenChecklist={openChecklist}
        />
      ) : (
        <HackView
          phaseIdx={phaseIdx}
          done={done}
          customTodos={customTodos}
          totalDone={allDone}
          totalChecks={allChecks}
          onToggle={handleToggleCheck}
          onAddCustomTodo={handleAddCustomTodo}
          onRemoveCustomTodo={removeCustomTodo}
          onResetProgress={handleResetProgress}
          onResetProgressAndCustomTodos={handleResetProgressAndCustomTodos}
          onRead={() => selectMode("learn")}
          onPrev={() => setPhase((i) => i - 1)}
          onNext={() => setPhase((i) => i + 1)}
        />
      )}
    </div>
  );
}
