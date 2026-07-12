"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AlertTriangle, Check, Plus, Trash2, X } from "lucide-react";
import {
  checklistGroupKey,
  customCheckKey,
  staticCheckKey,
  type CustomTodo,
} from "@/app/checklist-store";
import { guide } from "@/app/guide";
import { customTodoCount, isEditableTarget, itemCount } from "@/lib/guidebook";

type HackViewProps = {
  phaseIdx: number;
  done: Record<string, boolean>;
  customTodos: Record<string, CustomTodo[]>;
  totalDone: number;
  totalChecks: number;
  onToggle: (key: string) => void;
  onAddCustomTodo: (groupKey: string, label: string) => void;
  onRemoveCustomTodo: (groupKey: string, todoId: string) => void;
  onResetProgress: () => void;
  onResetProgressAndCustomTodos: () => void;
  onRead: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function HackView({
  phaseIdx,
  done,
  customTodos,
  totalDone,
  totalChecks,
  onToggle,
  onAddCustomTodo,
  onRemoveCustomTodo,
  onResetProgress,
  onResetProgressAndCustomTodos,
  onRead,
  onPrev,
  onNext,
}: HackViewProps) {
  const [resetOpen, setResetOpen] = useState(false);
  const [focusedCheckIndex, setFocusedCheckIndex] = useState(0);
  const focusAfterPhaseChange = useRef(false);
  const viewRef = useRef<HTMLElement>(null);
  const phase = guide[phaseIdx];
  const checklistKeys = useMemo(
    () =>
      phase.checklists.flatMap((group, groupIdx) => [
        ...group.items.map((_, itemIdx) =>
          staticCheckKey(phaseIdx, groupIdx, itemIdx),
        ),
        ...(customTodos[checklistGroupKey(phaseIdx, groupIdx)] ?? []).map((todo) =>
          customCheckKey(todo.id),
        ),
      ]),
    [customTodos, phase.checklists, phaseIdx],
  );
  const phaseCustomTodos = phase.checklists.flatMap(
    (_, groupIdx) => customTodos[checklistGroupKey(phaseIdx, groupIdx)] ?? [],
  );
  const customCount = customTodoCount(customTodos);
  const total = itemCount(phase) + phaseCustomTodos.length;
  const complete = phase.checklists.reduce((sum, group, groupIdx) => {
    const builtInDone = group.items.filter((_, itemIdx) =>
      done[staticCheckKey(phaseIdx, groupIdx, itemIdx)],
    ).length;
    const customDone = (
      customTodos[checklistGroupKey(phaseIdx, groupIdx)] ?? []
    ).filter((todo) => done[customCheckKey(todo.id)]).length;

    return sum + builtInDone + customDone;
  }, 0);
  const pct = Math.round((complete / total) * 100);

  const focusCheckAt = useCallback(
    (index: number) => {
      const key = checklistKeys[index];
      if (!key) {
        return;
      }

      const button = viewRef.current?.querySelector<HTMLButtonElement>(
        `[data-check-key="${CSS.escape(key)}"]`,
      );
      button?.focus();
    },
    [checklistKeys],
  );

  useEffect(() => {
    if (!focusAfterPhaseChange.current) {
      return;
    }

    focusAfterPhaseChange.current = false;
    setFocusedCheckIndex(0);
    window.requestAnimationFrame(() => focusCheckAt(0));
  }, [checklistKeys, focusCheckAt, phaseIdx]);

  const handleChecklistKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (resetOpen || isEditableTarget(event.target)) {
      return;
    }

    const activeElement = document.activeElement;
    const activeKey =
      activeElement instanceof HTMLElement
        ? activeElement.dataset.checkKey
        : undefined;
    const activeIndex = activeKey ? checklistKeys.indexOf(activeKey) : -1;
    const currentIndex =
      activeIndex >= 0
        ? activeIndex
        : Math.min(focusedCheckIndex, Math.max(0, checklistKeys.length - 1));

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        checklistKeys.length === 0
          ? 0
          : (currentIndex + direction + checklistKeys.length) %
            checklistKeys.length;

      setFocusedCheckIndex(nextIndex);
      focusCheckAt(nextIndex);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const canMoveLeft = phaseIdx > 0;
      const canMoveRight = phaseIdx < guide.length - 1;

      if (event.key === "ArrowLeft" && canMoveLeft) {
        focusAfterPhaseChange.current = true;
        onPrev();
      }

      if (event.key === "ArrowRight" && canMoveRight) {
        focusAfterPhaseChange.current = true;
        onNext();
      }

      return;
    }

    if ((event.key === "Enter" || event.key === " ") && activeKey) {
      event.preventDefault();
      onToggle(activeKey);
    }
  };

  return (
    <main
      ref={viewRef}
      onKeyDown={handleChecklistKeyDown}
      className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 pt-7 sm:px-6 sm:pt-10"
    >
      <section className="min-w-0 border-x border-white/15 px-5 sm:px-8">
        <div className="flex flex-col gap-5 border-b border-white/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[10px] text-[#8daaff]">
              004
            </p>
            <h1 className="mt-2 text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.84] tracking-[-0.055em] text-[#adcaff]">
              Checklist
            </h1>
            <p className="mt-2 text-xl leading-snug text-white/58">
              Execute. Check. Win.
            </p>
          </div>
          <div className="sm:text-right">
            <div className="font-sans text-3xl tabular-nums text-white">
              {complete}
              <span className="text-white/45">/{total}</span>
            </div>
            <button
              onClick={onRead}
              className="mt-2 font-sans text-sm text-[#adcaff] underline-offset-4 hover:underline"
            >
              Read below
            </button>
          </div>
        </div>

        <div className="mt-5 h-px overflow-hidden bg-white/20">
          <div
            className="h-full bg-[#adcaff] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-8 space-y-9">
          {phase.checklists.map((group, gi) => {
            const groupKey = checklistGroupKey(phaseIdx, gi);
            const groupCustomTodos = customTodos[groupKey] ?? [];
            const groupTotal = group.items.length + groupCustomTodos.length;
            const gDone =
              group.items.filter((_, ii) =>
                done[staticCheckKey(phaseIdx, gi, ii)],
              ).length +
              groupCustomTodos.filter((todo) => done[customCheckKey(todo.id)])
                .length;
            const gAll = groupTotal > 0 && gDone === groupTotal;
            return (
              <section key={group.title}>
                <div className="flex items-baseline justify-between border-b border-white/20 pb-2">
                  <h2 className="font-sans text-xl text-[#adcaff]">
                    {group.title}
                  </h2>
                  <span
                    className={`font-sans text-sm tabular-nums ${
                      gAll ? "text-[#adcaff]" : "text-white/50"
                    }`}
                  >
                    {gAll ? "done" : `${gDone} / ${groupTotal}`}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm italic leading-5 text-white/52">
                  {phase.fieldRule}
                </p>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item, ii) => {
                    const itemKey = staticCheckKey(phaseIdx, gi, ii);
                    const checked = !!done[itemKey];
                    const itemIndex = checklistKeys.indexOf(itemKey);
                    return (
                      <li key={item.label}>
                        <button
                          data-check-key={itemKey}
                          onFocus={() => setFocusedCheckIndex(itemIndex)}
                          onClick={() => onToggle(itemKey)}
                          className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors sm:px-4 ${
                            checked
                              ? "border-white/15 bg-[#5b5b5b]"
                              : "border-white/15 bg-[#1f1f1f] hover:border-white/35 hover:bg-[#292929]"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center border transition-colors ${
                              checked
                                ? "border-[#adcaff] bg-[#adcaff] text-black"
                                : "border-white/65 bg-white"
                            }`}
                          >
                            {checked && (
                              <Check aria-hidden="true" size={11} strokeWidth={3} />
                            )}
                          </span>
                          <span
                            className={`flex-1 font-sans text-[13px] leading-5 ${
                              checked ? "text-white/45 line-through" : "text-white/84"
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.critical && !checked && (
                            <span className="hidden flex-shrink-0 font-sans text-[10px] text-[#adcaff] sm:block">
                              critical
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                  {groupCustomTodos.map((todo) => {
                    const itemKey = customCheckKey(todo.id);
                    const checked = !!done[itemKey];
                    const itemIndex = checklistKeys.indexOf(itemKey);

                    return (
                      <li key={todo.id}>
                        <div
                          className={`flex items-center gap-2 border px-3 py-2.5 transition-colors sm:px-4 ${
                            checked
                              ? "border-white/15 bg-[#5b5b5b]"
                              : "border-white/15 bg-[#1f1f1f] hover:border-white/35 hover:bg-[#292929]"
                          }`}
                        >
                          <button
                            data-check-key={itemKey}
                            onFocus={() => setFocusedCheckIndex(itemIndex)}
                            onClick={() => onToggle(itemKey)}
                            className="flex min-w-0 flex-1 items-center gap-3 text-left"
                          >
                            <span
                              className={`flex h-4 w-4 flex-shrink-0 items-center justify-center border transition-colors ${
                                checked
                                  ? "border-[#adcaff] bg-[#adcaff] text-black"
                                  : "border-white/65 bg-white"
                              }`}
                            >
                              {checked && (
                                <Check aria-hidden="true" size={11} strokeWidth={3} />
                              )}
                            </span>
                            <span
                              className={`min-w-0 flex-1 font-sans text-[13px] leading-5 ${
                                checked ? "text-white/45 line-through" : "text-white/84"
                              }`}
                            >
                              {todo.label}
                            </span>
                            <span className="hidden flex-shrink-0 font-sans text-[10px] text-white/35 sm:block">
                              custom
                            </span>
                          </button>
                          <button
                            onClick={() => onRemoveCustomTodo(groupKey, todo.id)}
                            aria-label={`Remove custom todo: ${todo.label}`}
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-white/45 transition-colors hover:bg-white/10 hover:text-[#adcaff]"
                          >
                            <X aria-hidden="true" size={16} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <AddCustomTodoForm
                  inputId={`custom-todo-${groupKey}`}
                  groupTitle={group.title}
                  onAdd={(label) => onAddCustomTodo(groupKey, label)}
                />
              </section>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3 border-t border-white/20 pt-5 font-sans text-sm">
          <button
            onClick={onPrev}
            disabled={phaseIdx === 0}
            className="px-3 py-2 text-left text-white/60 enabled:hover:bg-white/10 disabled:opacity-30"
          >
            &lt;- {phaseIdx > 0 ? guide[phaseIdx - 1].title : "Beginning"}
          </button>
          <button
            onClick={onNext}
            disabled={phaseIdx === guide.length - 1}
            className="px-3 py-2 text-right text-white/60 enabled:hover:bg-white/10 disabled:opacity-30"
          >
            {phaseIdx < guide.length - 1 ? guide[phaseIdx + 1].title : "Done"} -&gt;
          </button>
        </div>
      </section>

      <aside className="border-x border-white/15 px-5 sm:px-8">
        <div className="border border-white/15 bg-[#151515] p-5">
          <section>
            <p className="font-sans text-[11px] text-white/52">
              Total Progress
            </p>
            <div className="mt-3 font-sans text-4xl tabular-nums text-white">
              {totalDone}
              <span className="text-2xl text-white/35">/{totalChecks}</span>
            </div>
            <button
              onClick={() => setResetOpen(true)}
              disabled={totalDone === 0 && customCount === 0}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-white/20 px-3 py-2.5 font-sans text-sm text-white/68 transition-colors hover:border-[#adcaff] hover:text-[#adcaff] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/20 disabled:hover:text-white/68"
            >
              <Trash2 aria-hidden="true" size={15} />
              Clear checklist state
            </button>
          </section>
        </div>
      </aside>

      {resetOpen && (
        <ResetChecklistDialog
          completedCount={totalDone}
          customTodoCount={customCount}
          onCancel={() => setResetOpen(false)}
          onResetProgress={() => {
            onResetProgress();
            setResetOpen(false);
          }}
          onResetProgressAndCustomTodos={() => {
            onResetProgressAndCustomTodos();
            setResetOpen(false);
          }}
        />
      )}
    </main>
  );
}

function AddCustomTodoForm({
  inputId,
  groupTitle,
  onAdd,
}: {
  inputId: string;
  groupTitle: string;
  onAdd: (label: string) => void;
}) {
  const [label, setLabel] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanLabel = label.trim();
    if (!cleanLabel) {
      return;
    }

    onAdd(cleanLabel);
    setLabel("");
  };

  return (
    <form
      onSubmit={submit}
      className="mt-3 flex flex-col gap-2 border border-dashed border-white/20 bg-[#151515] p-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor={inputId}>
        Add your own check to {groupTitle}
      </label>
      <input
        id={inputId}
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder="Add your own check for this group"
        maxLength={180}
        className="min-h-10 flex-1 border border-white/20 bg-black px-3 font-sans text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#adcaff] focus:bg-[#171717]"
      />
      <button
        type="submit"
        disabled={label.trim().length === 0}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#adcaff] px-4 font-sans text-sm font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-[#adcaff]"
      >
        <Plus aria-hidden="true" size={15} />
        Add
      </button>
    </form>
  );
}

function ResetChecklistDialog({
  completedCount,
  customTodoCount,
  onCancel,
  onResetProgress,
  onResetProgressAndCustomTodos,
}: {
  completedCount: number;
  customTodoCount: number;
  onCancel: () => void;
  onResetProgress: () => void;
  onResetProgressAndCustomTodos: () => void;
}) {
  const progressLabel =
    completedCount === 1 ? "1 completed check" : `${completedCount} completed checks`;
  const customLabel =
    customTodoCount === 1 ? "1 custom todo" : `${customTodoCount} custom todos`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-checklist-title"
    >
      <div className="w-full max-w-md border border-white/20 bg-[#151515] p-6 text-white shadow-2xl shadow-black/60">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-[#adcaff]/15 text-[#adcaff]">
            <AlertTriangle aria-hidden="true" size={20} />
          </span>
          <div>
            <h2 id="reset-checklist-title" className="font-sans text-lg font-medium">
              Clear checklist state?
            </h2>
            <p className="mt-2 font-sans text-sm leading-6 text-white/65">
              Choose exactly what to clear in this browser. Built-in guide checks
              stay in the guide either way.
            </p>
            <dl className="mt-4 grid gap-2 font-sans text-xs text-white/58">
              <div className="flex justify-between gap-4 bg-black px-3 py-2">
                <dt>Completed progress</dt>
                <dd className="tabular-nums">{progressLabel}</dd>
              </div>
              <div className="flex justify-between gap-4 bg-black px-3 py-2">
                <dt>Your added todos</dt>
                <dd className="tabular-nums">{customLabel}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="border border-white/20 px-4 py-2.5 font-sans text-sm text-white/75 transition-colors hover:bg-white/10"
          >
            Keep everything
          </button>
          <button
            onClick={onResetProgress}
            disabled={completedCount === 0}
            className="border border-white/20 px-4 py-2.5 font-sans text-sm text-white/75 transition-colors hover:border-[#adcaff] hover:text-[#adcaff] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/20 disabled:hover:text-white/75"
          >
            Clear completed checks only
          </button>
          <button
            onClick={onResetProgressAndCustomTodos}
            disabled={completedCount === 0 && customTodoCount === 0}
            className="rounded-lg bg-[#adcaff] px-4 py-2.5 font-sans text-sm font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-[#adcaff]"
          >
            Clear checks and custom todos
          </button>
        </div>
      </div>
    </div>
  );
}
