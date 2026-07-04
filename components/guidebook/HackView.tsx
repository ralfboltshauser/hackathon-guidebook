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
      className="mx-auto grid max-w-7xl gap-8 px-4 pb-28 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <section className="min-w-0">
        <div className="flex flex-col gap-5 border-b border-ink/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-accent">
              Checklist / Phase {phase.n}
            </p>
            <h1 className="mt-2 text-[clamp(2.75rem,8vw,6rem)] font-light leading-[0.9]">
              {phase.title}
            </h1>
            <p className="mt-4 max-w-2xl text-xl font-light leading-snug text-ink/72">
              {phase.fieldRule}
            </p>
          </div>
          <div className="sm:text-right">
            <div className="font-sans text-4xl tabular-nums">
              {complete}
              <span className="text-ink/30">/{total}</span>
            </div>
            <button
              onClick={onRead}
              className="mt-2 font-sans text-sm text-accent underline-offset-4 hover:underline"
            >
              Read the guide
            </button>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-none bg-ink/10">
          <div
            className="h-full rounded-none bg-accent transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-10 space-y-9">
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
                <div className="flex items-baseline justify-between border-b border-ink/15 pb-2">
                  <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-muted">
                    {group.title}
                  </h2>
                  <span
                    className={`font-sans text-xs tabular-nums ${
                      gAll ? "text-accent" : "text-ink/40"
                    }`}
                  >
                    {gAll ? "done" : `${gDone}/${groupTotal}`}
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
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
                          className={`flex w-full items-center gap-4 rounded-none border px-4 py-4 text-left transition-colors sm:px-5 ${
                            checked
                              ? "border-accent/20 bg-panel-strong"
                              : "border-ink/15 bg-panel/55 hover:border-ink/30 hover:bg-panel/80"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-none border transition-colors ${
                              checked
                                ? "border-accent bg-accent text-page"
                                : "border-ink/30 bg-page/70"
                            }`}
                          >
                            {checked && (
                              <Check aria-hidden="true" size={15} strokeWidth={3} />
                            )}
                          </span>
                          <span
                            className={`flex-1 font-sans text-[15px] leading-6 ${
                              checked ? "text-ink/55" : "text-ink"
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.critical && !checked && (
                            <span className="hidden flex-shrink-0 font-sans text-[10px] uppercase tracking-wider text-accent sm:block">
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
                          className={`flex items-center gap-2 rounded-none border px-4 py-3 transition-colors sm:px-5 ${
                            checked
                              ? "border-accent/20 bg-panel-strong"
                              : "border-ink/15 bg-panel/55 hover:border-ink/30 hover:bg-panel/80"
                          }`}
                        >
                          <button
                            data-check-key={itemKey}
                            onFocus={() => setFocusedCheckIndex(itemIndex)}
                            onClick={() => onToggle(itemKey)}
                            className="flex min-w-0 flex-1 items-center gap-4 text-left"
                          >
                            <span
                              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-none border transition-colors ${
                                checked
                                  ? "border-accent bg-accent text-page"
                                  : "border-ink/30 bg-page/70"
                              }`}
                            >
                              {checked && (
                                <Check aria-hidden="true" size={15} strokeWidth={3} />
                              )}
                            </span>
                            <span
                              className={`min-w-0 flex-1 font-sans text-[15px] leading-6 ${
                                checked ? "text-ink/55" : "text-ink"
                              }`}
                            >
                              {todo.label}
                            </span>
                            <span className="hidden flex-shrink-0 font-sans text-[10px] uppercase tracking-wider text-ink/35 sm:block">
                              custom
                            </span>
                          </button>
                          <button
                            onClick={() => onRemoveCustomTodo(groupKey, todo.id)}
                            aria-label={`Remove custom todo: ${todo.label}`}
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-none text-ink/38 transition-colors hover:bg-ink/7 hover:text-accent"
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

        <div className="mt-10 flex items-center justify-between gap-3 font-sans text-sm">
          <button
            onClick={onPrev}
            disabled={phaseIdx === 0}
            className="rounded-none px-3 py-2 text-left text-ink/60 enabled:hover:bg-ink/5 disabled:opacity-30"
          >
            &lt;- {phaseIdx > 0 ? guide[phaseIdx - 1].title : "Beginning"}
          </button>
          <button
            onClick={onNext}
            disabled={phaseIdx === guide.length - 1}
            className="rounded-none px-3 py-2 text-right text-ink/60 enabled:hover:bg-ink/5 disabled:opacity-30"
          >
            {phaseIdx < guide.length - 1 ? guide[phaseIdx + 1].title : "Done"} -&gt;
          </button>
        </div>
      </section>

      <aside className="lg:pt-8">
        <div className="sticky top-32 space-y-4">
          <section className="rounded-none border border-ink/15 bg-panel/65 p-5">
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-muted">
              Total Progress
            </p>
            <div className="mt-3 font-sans text-5xl tabular-nums text-ink">
              {totalDone}
              <span className="text-2xl text-ink/30">/{totalChecks}</span>
            </div>
            <button
              onClick={() => setResetOpen(true)}
              disabled={totalDone === 0 && customCount === 0}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-none border border-ink/15 px-3 py-2.5 font-sans text-sm text-ink/65 transition-colors hover:border-accent/45 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-ink/15 disabled:hover:text-ink/65"
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
      className="mt-3 flex flex-col gap-2 rounded-none border border-dashed border-ink/18 bg-panel/45 p-3 sm:flex-row"
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
        className="min-h-10 flex-1 rounded-none border border-ink/15 bg-panel/70 px-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/38 focus:border-accent/65 focus:bg-panel-strong"
      />
      <button
        type="submit"
        disabled={label.trim().length === 0}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-none bg-accent px-4 font-sans text-sm font-medium text-page transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-accent"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-page/75 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-checklist-title"
    >
      <div className="w-full max-w-md rounded-none border border-ink/15 bg-page p-6 shadow-2xl shadow-ink/20">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-none bg-accent/12 text-accent">
            <AlertTriangle aria-hidden="true" size={20} />
          </span>
          <div>
            <h2 id="reset-checklist-title" className="font-sans text-lg font-medium">
              Clear checklist state?
            </h2>
            <p className="mt-2 font-sans text-sm leading-6 text-ink/68">
              Choose exactly what to clear in this browser. Built-in guide checks
              stay in the guide either way.
            </p>
            <dl className="mt-4 grid gap-2 font-sans text-xs text-ink/58">
              <div className="flex justify-between gap-4 rounded-none bg-panel/70 px-3 py-2">
                <dt>Completed progress</dt>
                <dd className="tabular-nums">{progressLabel}</dd>
              </div>
              <div className="flex justify-between gap-4 rounded-none bg-panel/70 px-3 py-2">
                <dt>Your added todos</dt>
                <dd className="tabular-nums">{customLabel}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="rounded-none border border-ink/15 px-4 py-2.5 font-sans text-sm text-ink/70 transition-colors hover:bg-ink/5"
          >
            Keep everything
          </button>
          <button
            onClick={onResetProgress}
            disabled={completedCount === 0}
            className="rounded-none border border-ink/15 px-4 py-2.5 font-sans text-sm text-ink/70 transition-colors hover:border-accent/45 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-ink/15 disabled:hover:text-ink/70"
          >
            Clear completed checks only
          </button>
          <button
            onClick={onResetProgressAndCustomTodos}
            disabled={completedCount === 0 && customTodoCount === 0}
            className="rounded-none bg-accent px-4 py-2.5 font-sans text-sm font-medium text-page transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-accent"
          >
            Clear checks and custom todos
          </button>
        </div>
      </div>
    </div>
  );
}
