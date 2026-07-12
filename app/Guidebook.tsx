"use client";

import { useCallback, useEffect, useState } from "react";
import { GuidebookHeader } from "@/components/guidebook/GuidebookHeader";
import { HackView } from "@/components/guidebook/HackView";
import { LearnView } from "@/components/guidebook/LearnView";
import {
  clampPhase,
  customTodoCount,
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

  const setViewState = useCallback((nextMode: Mode, nextPhaseIdx: number) => {
    const safePhaseIdx = clampPhase(nextPhaseIdx);
    setMode(nextMode);
    setPhaseIdx(safePhaseIdx);
    writeViewStateToUrl(nextMode, safePhaseIdx);
  }, []);

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
    setViewState(nextMode, phaseIdx);
  };

  const openChecklist = (i: number) => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setViewState("hack", i);
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
    <div
      className={`min-h-screen font-serif ${
        mode === "hack" ? "bg-black text-[#f1f4ff]" : "bg-page text-ink"
      }`}
    >
      <GuidebookHeader
        mode={mode}
        onLogoClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          setViewState("learn", 0);
        }}
        onModeChange={selectMode}
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
          onToggle={toggleCheck}
          onAddCustomTodo={addCustomTodo}
          onRemoveCustomTodo={removeCustomTodo}
          onResetProgress={resetProgress}
          onResetProgressAndCustomTodos={resetProgressAndCustomTodos}
          onRead={() => selectMode("learn")}
          onPrev={() => setPhase((i) => i - 1)}
          onNext={() => setPhase((i) => i + 1)}
        />
      )}
    </div>
  );
}
