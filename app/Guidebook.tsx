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
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  checklistGroupKey,
  customCheckKey,
  staticCheckKey,
  useChecklistStore,
  type CustomTodo,
} from "./checklist-store";
import { guide, wins, type Phase } from "./guide";

const WIN_PHOTOS = [
  "/hackathon-proof/start-hack.jpg",
  "/hackathon-proof/moin-hack.png",
  "/hackathon-proof/eth-ai-hack.jpeg",
  "/hackathon-proof/basel-hack.jpeg",
  "/hackathon-proof/eth-agentic-systems-lab.jpeg",
  "/hackathon-proof/ibm-bobathon.jpeg",
  "/hackathon-proof/konrad-hack-team.jpeg",
];

function scrollToPhase(i: number, smooth = true) {
  document
    .getElementById(`phase-${i}`)
    ?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

type Mode = "learn" | "hack";

const itemCount = (p: Phase) =>
  p.checklists.reduce((s, c) => s + c.items.length, 0);

const totalChecks = guide.reduce((sum, phase) => sum + itemCount(phase), 0);

const phaseComplete = (
  phaseIdx: number,
  done: Record<string, boolean>,
  customTodos: Record<string, CustomTodo[]>,
) =>
  guide[phaseIdx].checklists.every((group, groupIdx) => {
    const builtInComplete = group.items.every(
      (_, itemIdx) => done[staticCheckKey(phaseIdx, groupIdx, itemIdx)],
    );
    const customComplete = (customTodos[checklistGroupKey(phaseIdx, groupIdx)] ?? [])
      .every((todo) => done[customCheckKey(todo.id)]);

    return builtInComplete && customComplete;
  });

const customTodoCount = (customTodos: Record<string, CustomTodo[]>) =>
  Object.values(customTodos).reduce((sum, todos) => sum + todos.length, 0);

function isEditableTarget(target: EventTarget) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

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

  const enterHackMode = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMode("hack");
  };
  const enterLearnMode = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMode("learn");
  };

  useEffect(() => {
    migrateLegacyProgress();
  }, [migrateLegacyProgress]);

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#241c12]">
      <div className="sticky top-0 z-30 border-b border-[#241c12]/15 bg-[#f6f1e7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <button
              onClick={() => {
                setPhaseIdx(0);
                enterLearnMode();
              }}
              className="w-fit text-left font-sans text-[11px] uppercase tracking-[0.28em] text-[#8a6d3b] transition-colors hover:text-[#241c12]"
            >
              Hackathon Guidebook
            </button>
            <span className="font-sans text-[11px] text-[#241c12]/38">
              by{" "}
              <a
                href="https://www.linkedin.com/in/ralfboltshauser/"
                target="_blank"
                rel="noreferrer"
                className="text-[#241c12]/50 underline-offset-4 transition-colors hover:text-[#241c12]/75 hover:underline"
              >
                Ralf Boltshauser
              </a>
              {" and "}
              <a
                href="https://www.linkedin.com/in/konrad-te-heesen-bb2876280/"
                target="_blank"
                rel="noreferrer"
                className="text-[#241c12]/50 underline-offset-4 transition-colors hover:text-[#241c12]/75 hover:underline"
              >
                Konrad te Heesen
              </a>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <div className="hidden font-sans text-xs text-[#241c12]/50 sm:block">
              {guide.length} phases / {totalChecks} operating checks
            </div>
            <div className="flex items-center rounded-full border border-[#241c12]/20 bg-[#efe7d6] p-0.5">
              <ModeButton
                active={mode === "learn"}
                onClick={enterLearnMode}
                label="Learn"
              />
              <ModeButton
                active={mode === "hack"}
                onClick={enterHackMode}
                label="Hack"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-2 sm:px-6">
          <div className="min-w-0 overflow-x-auto">
            <ol className="flex min-w-max gap-1">
              {guide.map((p, i) => {
                const active = i === phaseIdx;
                const complete = phaseComplete(i, done, customTodos);
                return (
                  <li key={p.n} className="flex-shrink-0">
                    <button
                      onClick={() => {
                        setPhaseIdx(i);
                        if (mode === "learn") {
                          setPendingScrollPhase(i);
                          scrollToPhase(i);
                        }
                      }}
                      className={`group relative flex items-baseline gap-2 rounded-md px-3 py-1.5 transition-colors ${
                        active ? "text-[#f6f1e7]" : "hover:bg-[#241c12]/5"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="phase-tab-indicator"
                          className="absolute inset-0 rounded-md bg-[#241c12]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span
                        className={`relative z-10 font-sans text-[10px] tabular-nums ${
                          active ? "text-[#f6f1e7]/60" : "text-[#241c12]/40"
                        }`}
                      >
                        {p.n}
                      </span>
                      <span className="relative z-10 text-sm">{p.title}</span>
                      {complete && (
                        <span
                          className={`relative z-10 font-sans text-xs ${
                            active ? "text-[#f6f1e7]" : "text-[#b4530a]"
                          }`}
                        >
                          done
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <nav className="flex flex-shrink-0 items-center gap-3 font-sans text-[11px] text-[#241c12]/42">
            <Link
              href="/about"
              className="underline-offset-4 transition-colors hover:text-[#241c12]/70 hover:underline"
            >
              About
            </Link>
            <a
              href="https://github.com/ralfboltshauser/hackathon-guidebook"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 transition-colors hover:text-[#241c12]/70 hover:underline"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>

      {mode === "learn" ? (
        <LearnView
          initialPhase={phaseIdx}
          pendingScrollPhase={pendingScrollPhase}
          onActivePhase={setPhaseIdx}
          onPendingScrollSettled={() => setPendingScrollPhase(null)}
          onOpenChecklist={(i) => {
            setPhaseIdx(i);
            enterHackMode();
          }}
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
          onRead={enterLearnMode}
          onPrev={() => setPhaseIdx((i) => Math.max(0, i - 1))}
          onNext={() => setPhaseIdx((i) => Math.min(guide.length - 1, i + 1))}
        />
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex min-h-9 items-center gap-2 rounded-full px-4 py-1.5 font-sans text-sm font-medium transition-colors sm:px-5 ${
        active ? "text-[#f6f1e7]" : "text-[#241c12]/60 hover:text-[#241c12]"
      }`}
    >
      {active && (
        <motion.span
          layoutId="mode-toggle-indicator"
          className="absolute inset-0 rounded-full bg-[#241c12]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative z-10">{label}</span>
      {badge && (
        <span
          className={`relative z-10 rounded-full px-1.5 text-[10px] tabular-nums transition-colors ${
            active ? "bg-[#f6f1e7]/20 text-[#f6f1e7]" : "bg-[#241c12]/10 text-[#241c12]/60"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function LearnView({
  initialPhase,
  pendingScrollPhase,
  onActivePhase,
  onPendingScrollSettled,
  onOpenChecklist,
}: {
  initialPhase: number;
  pendingScrollPhase: number | null;
  onActivePhase: (i: number) => void;
  onPendingScrollSettled: () => void;
  onOpenChecklist: (i: number) => void;
}) {
  const startPhase = useRef(initialPhase);

  useEffect(() => {
    if (startPhase.current > 0) scrollToPhase(startPhase.current, false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const phase = Number((entry.target as HTMLElement).dataset.phase);

            if (pendingScrollPhase !== null && phase !== pendingScrollPhase) {
              continue;
            }

            onActivePhase(phase);

            if (phase === pendingScrollPhase) {
              onPendingScrollSettled();
            }
          }
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("[data-phase]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onActivePhase, onPendingScrollSettled, pendingScrollPhase]);

  return (
    <main className="pb-28">
      <Hero
        onStart={() => scrollToPhase(0)}
        onChecklists={() => onOpenChecklist(0)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {guide.map((phase, i) => (
          <PhaseArticle
            key={phase.n}
            phase={phase}
            index={i}
            onOpenChecklist={() => onOpenChecklist(i)}
          />
        ))}
      </div>
    </main>
  );
}

function Hero({
  onStart,
  onChecklists,
}: {
  onStart: () => void;
  onChecklists: () => void;
}) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [isPhotoCyclePaused, setIsPhotoCyclePaused] = useState(false);

  useEffect(() => {
    if (isPhotoCyclePaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActivePhoto((current) => (current + 1) % WIN_PHOTOS.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [isPhotoCyclePaused]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
      <div className="grid gap-12 border-b border-[#241c12]/15 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-start lg:gap-16 lg:pb-16">
        {/* Message */}
        <div className="lg:pt-2">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-[#b4530a]">
            The hackathon playbook
          </p>
          <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.75rem)] font-light leading-[0.9]">
            Everything we learned winning hackathons.
          </h1>
          <p className="mt-7 max-w-xl text-xl font-light leading-snug text-[#241c12]/80">
            We have spent years competing in hackathons, using each one to push
            the edge of what we could build and learn. These are the lessons that
            kept proving themselves.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 rounded-md bg-[#241c12] px-6 py-3.5 font-sans text-sm font-medium text-[#f6f1e7] transition-colors hover:bg-[#3a2c1c]"
            >
              Open the playbook
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            <button
              onClick={onChecklists}
              className="inline-flex items-center rounded-md border border-[#241c12]/25 px-6 py-3.5 font-sans text-sm font-medium text-[#241c12]/80 transition-colors hover:border-[#b4530a] hover:text-[#241c12]"
            >
              Go to the checklists
            </button>
          </div>
        </div>

        {/* Track record card with photo */}
        <div className="overflow-hidden rounded-xl border border-[#241c12]/15 shadow-sm">
          {/* Photo strip — crossfades on row hover */}
          <div className="relative h-52 overflow-hidden bg-[#efe7d6] sm:h-60">
            {WIN_PHOTOS.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={wins[i]?.event ?? ""}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 480px"
                className={`object-cover object-center transition-opacity duration-500 ease-in-out ${
                  activePhoto === i ? "opacity-100" : "opacity-0"
                }`}
                priority={i === 0}
              />
            ))}
            {/* Subtle event label */}
            <div className="absolute bottom-3 left-4 z-10 h-5">
              {wins.map((w, i) => (
                <span
                  key={w.event}
                  className={`absolute bottom-0 left-0 whitespace-nowrap rounded-sm bg-[#241c12]/50 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm transition-opacity duration-500 ${
                    activePhoto === i ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {w.event}
                </span>
              ))}
            </div>
          </div>

          {/* Track record list */}
          <div className="bg-white/40 px-6 pb-6 pt-2 sm:px-7 sm:pb-7">
            <div className="flex items-baseline justify-between border-b border-[#241c12]/15 pb-3">
              <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#8a6d3b]">
                Track record
              </p>
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#241c12]/45">
                2023 – 2025
              </p>
            </div>
            <ul onMouseLeave={() => setIsPhotoCyclePaused(false)}>
              {wins.map((w, i) => (
                <li
                  key={w.event}
                  onMouseEnter={() => {
                    setIsPhotoCyclePaused(true);
                    setActivePhoto(i);
                  }}
                  className="border-b border-[#241c12]/10 last:border-0"
                >
                  <WinItem
                    href={w.href}
                    className="group flex items-baseline justify-between gap-4 py-3"
                  >
                    <span
                      className={`block text-base leading-tight transition-colors duration-200 ${
                        activePhoto === i
                          ? "text-[#b4530a]"
                          : "group-hover:text-[#b4530a]"
                      }`}
                    >
                      {w.event}
                    </span>
                    <span className="flex-shrink-0 font-sans text-xs uppercase tracking-wider text-[#b4530a]">
                      {w.place}
                    </span>
                  </WinItem>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function WinItem({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return <div className={className}>{children}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

function PhaseArticle({
  phase,
  index,
  onOpenChecklist,
}: {
  phase: Phase;
  index: number;
  onOpenChecklist: () => void;
}) {
  return (
    <section
      id={`phase-${index}`}
      data-phase={index}
      className="scroll-mt-32 border-b border-[#241c12]/12 py-14 first:pt-2 last:border-0 sm:py-20"
    >
      <header className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-[#b4530a]">
            Phase {phase.n}
          </p>
          <span className="h-px w-8 bg-[#241c12]/20" />
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8a6d3b]">
            {phase.timebox}
          </p>
        </div>
        <h2 className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)] font-light leading-[0.9]">
          {phase.title}
        </h2>
        <p className="mt-6 text-2xl font-light leading-snug text-[#241c12]/80 sm:text-[1.75rem] sm:leading-snug">
          {phase.thesis}
        </p>
      </header>

      <div className="mt-8 max-w-4xl border-l-2 border-[#b4530a] bg-[#efe7d6]/60 py-5 pl-6 pr-5">
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#8a6d3b]">
          Field Rule
        </p>
        <p className="mt-2 text-xl leading-snug text-[#241c12]/88">
          {phase.fieldRule}
        </p>
      </div>

      <div className="mt-14">
        <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-[#8a6d3b]">
          The Work
        </p>
        <div className="mt-2 space-y-12">
          {phase.sections.map((section, si) => (
            <section
              key={section.title}
              className="border-t border-[#241c12]/12 pt-8"
            >
              <div className="grid gap-x-10 gap-y-4 lg:grid-cols-[4.5rem_minmax(0,1fr)]">
                <div className="font-sans text-sm tabular-nums text-[#b4530a] lg:pt-1.5">
                  {phase.n}.{String(si + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-light leading-tight sm:text-3xl">
                    {section.title}
                  </h3>
                  <p className="mt-3 max-w-2xl font-sans text-[15px] leading-7 text-[#241c12]/65">
                    {section.intent}
                  </p>
                  <div className="mt-6 grid gap-x-10 gap-y-7 lg:grid-cols-2">
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#241c12]/55">
                        Do
                      </p>
                      <ul className="mt-3 space-y-3">
                        {section.moves.map((move) => (
                          <li
                            key={move}
                            className="flex gap-3 font-sans text-sm leading-6 text-[#241c12]/85"
                          >
                            <span className="mt-[0.4rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#b4530a]" />
                            <span>{move}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {section.avoid?.length ? (
                      <div className="lg:border-l lg:border-[#241c12]/10 lg:pl-10">
                        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#b4530a]/75">
                          Avoid
                        </p>
                        <ul className="mt-3 space-y-3">
                          {section.avoid.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 font-sans text-sm leading-6 text-[#241c12]/55"
                            >
                              <span className="mt-px flex-shrink-0 text-xs text-[#b4530a]/70">
                                ✕
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg bg-[#241c12] text-[#f6f1e7]">
        <div className="grid gap-6 p-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#e0b15d]">
              Mantra
            </p>
            <p className="mt-3 text-2xl font-light italic leading-snug sm:text-3xl">
              &quot;{phase.mantra}&quot;
            </p>
          </div>
          <button
            onClick={onOpenChecklist}
            className="group flex items-center justify-between gap-4 rounded-md border border-[#f6f1e7]/25 px-5 py-4 text-left transition-colors hover:border-[#e0b15d] hover:bg-[#f6f1e7]/5 sm:flex-col sm:items-start sm:gap-2"
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#e0b15d]">
              Now do it
            </span>
            <span className="flex items-center gap-2 text-lg">
              Open checklist
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function HackView({
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
}: {
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
}) {
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
    const customDone = (customTodos[checklistGroupKey(phaseIdx, groupIdx)] ?? [])
      .filter((todo) => done[customCheckKey(todo.id)]).length;

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
        <div className="flex flex-col gap-5 border-b border-[#241c12]/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-[#b4530a]">
              Checklist / Phase {phase.n}
            </p>
            <h1 className="mt-2 text-[clamp(2.75rem,8vw,6rem)] font-light leading-[0.9]">
              {phase.title}
            </h1>
            <p className="mt-4 max-w-2xl text-xl font-light leading-snug text-[#241c12]/72">
              {phase.fieldRule}
            </p>
          </div>
          <div className="sm:text-right">
            <div className="font-sans text-4xl tabular-nums">
              {complete}
              <span className="text-[#241c12]/30">/{total}</span>
            </div>
            <button
              onClick={onRead}
              className="mt-2 font-sans text-sm text-[#b4530a] underline-offset-4 hover:underline"
            >
              Read the guide
            </button>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#241c12]/10">
          <div
            className="h-full rounded-full bg-[#b4530a] transition-all duration-300"
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
                <div className="flex items-baseline justify-between border-b border-[#241c12]/15 pb-2">
                  <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-[#8a6d3b]">
                    {group.title}
                  </h2>
                  <span
                    className={`font-sans text-xs tabular-nums ${
                      gAll ? "text-[#b4530a]" : "text-[#241c12]/40"
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
                          className={`flex w-full items-center gap-4 rounded-md border px-4 py-4 text-left transition-colors sm:px-5 ${
                            checked
                              ? "border-[#b4530a]/20 bg-[#f3ecdf]"
                              : "border-[#241c12]/15 bg-white/40 hover:border-[#241c12]/30 hover:bg-white/55"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
                              checked
                                ? "border-[#b4530a] bg-[#b4530a] text-[#f6f1e7]"
                                : "border-[#241c12]/30 bg-[#f6f1e7]/70"
                            }`}
                          >
                            {checked && <Check aria-hidden="true" size={15} strokeWidth={3} />}
                          </span>
                          <span
                            className={`flex-1 font-sans text-[15px] leading-6 ${
                              checked
                                ? "text-[#241c12]/55"
                                : "text-[#241c12]"
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.critical && !checked && (
                            <span className="hidden flex-shrink-0 font-sans text-[10px] uppercase tracking-wider text-[#b4530a] sm:block">
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
                          className={`flex items-center gap-2 rounded-md border px-4 py-3 transition-colors sm:px-5 ${
                            checked
                              ? "border-[#b4530a]/20 bg-[#f3ecdf]"
                              : "border-[#241c12]/15 bg-white/40 hover:border-[#241c12]/30 hover:bg-white/55"
                          }`}
                        >
                          <button
                            data-check-key={itemKey}
                            onFocus={() => setFocusedCheckIndex(itemIndex)}
                            onClick={() => onToggle(itemKey)}
                            className="flex min-w-0 flex-1 items-center gap-4 text-left"
                          >
                            <span
                              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
                                checked
                                  ? "border-[#b4530a] bg-[#b4530a] text-[#f6f1e7]"
                                  : "border-[#241c12]/30 bg-[#f6f1e7]/70"
                              }`}
                            >
                              {checked && (
                                <Check aria-hidden="true" size={15} strokeWidth={3} />
                              )}
                            </span>
                            <span
                              className={`min-w-0 flex-1 font-sans text-[15px] leading-6 ${
                                checked
                                  ? "text-[#241c12]/55"
                                  : "text-[#241c12]"
                              }`}
                            >
                              {todo.label}
                            </span>
                            <span className="hidden flex-shrink-0 font-sans text-[10px] uppercase tracking-wider text-[#241c12]/35 sm:block">
                              custom
                            </span>
                          </button>
                          <button
                            onClick={() => onRemoveCustomTodo(groupKey, todo.id)}
                            aria-label={`Remove custom todo: ${todo.label}`}
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-[#241c12]/38 transition-colors hover:bg-[#241c12]/7 hover:text-[#b4530a]"
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
            className="rounded-md px-3 py-2 text-left text-[#241c12]/60 enabled:hover:bg-[#241c12]/5 disabled:opacity-30"
          >
            &lt;- {phaseIdx > 0 ? guide[phaseIdx - 1].title : "Beginning"}
          </button>
          <button
            onClick={onNext}
            disabled={phaseIdx === guide.length - 1}
            className="rounded-md px-3 py-2 text-right text-[#241c12]/60 enabled:hover:bg-[#241c12]/5 disabled:opacity-30"
          >
            {phaseIdx < guide.length - 1 ? guide[phaseIdx + 1].title : "Done"} -&gt;
          </button>
        </div>
      </section>

      <aside className="lg:pt-8">
        <div className="sticky top-32 space-y-4">
          <section className="rounded-md border border-[#241c12]/15 bg-white/35 p-5">
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#8a6d3b]">
              Total Progress
            </p>
            <div className="mt-3 font-sans text-5xl tabular-nums text-[#241c12]">
              {totalDone}
              <span className="text-2xl text-[#241c12]/30">/{totalChecks}</span>
            </div>
            <button
              onClick={() => setResetOpen(true)}
              disabled={totalDone === 0 && customCount === 0}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#241c12]/15 px-3 py-2.5 font-sans text-sm text-[#241c12]/65 transition-colors hover:border-[#b4530a]/45 hover:text-[#b4530a] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#241c12]/15 disabled:hover:text-[#241c12]/65"
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
      className="mt-3 flex flex-col gap-2 rounded-md border border-dashed border-[#241c12]/18 bg-[#efe7d6]/45 p-3 sm:flex-row"
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
        className="min-h-10 flex-1 rounded-md border border-[#241c12]/15 bg-white/45 px-3 font-sans text-sm text-[#241c12] outline-none transition-colors placeholder:text-[#241c12]/38 focus:border-[#b4530a]/65 focus:bg-white/65"
      />
      <button
        type="submit"
        disabled={label.trim().length === 0}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#241c12] px-4 font-sans text-sm font-medium text-[#f6f1e7] transition-colors hover:bg-[#3a2c1c] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-[#241c12]"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241c12]/35 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-checklist-title"
    >
      <div className="w-full max-w-md rounded-lg border border-[#241c12]/15 bg-[#f6f1e7] p-6 shadow-2xl shadow-[#241c12]/20">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#b4530a]/12 text-[#b4530a]">
            <AlertTriangle aria-hidden="true" size={20} />
          </span>
          <div>
            <h2 id="reset-checklist-title" className="font-sans text-lg font-medium">
              Clear checklist state?
            </h2>
            <p className="mt-2 font-sans text-sm leading-6 text-[#241c12]/68">
              Choose exactly what to clear in this browser. Built-in guide checks
              stay in the guide either way.
            </p>
            <dl className="mt-4 grid gap-2 font-sans text-xs text-[#241c12]/58">
              <div className="flex justify-between gap-4 rounded-md bg-white/35 px-3 py-2">
                <dt>Completed progress</dt>
                <dd className="tabular-nums">{progressLabel}</dd>
              </div>
              <div className="flex justify-between gap-4 rounded-md bg-white/35 px-3 py-2">
                <dt>Your added todos</dt>
                <dd className="tabular-nums">{customLabel}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="rounded-md border border-[#241c12]/15 px-4 py-2.5 font-sans text-sm text-[#241c12]/70 transition-colors hover:bg-[#241c12]/5"
          >
            Keep everything
          </button>
          <button
            onClick={onResetProgress}
            disabled={completedCount === 0}
            className="rounded-md border border-[#241c12]/15 px-4 py-2.5 font-sans text-sm text-[#241c12]/70 transition-colors hover:border-[#b4530a]/45 hover:text-[#b4530a] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#241c12]/15 disabled:hover:text-[#241c12]/70"
          >
            Clear completed checks only
          </button>
          <button
            onClick={onResetProgressAndCustomTodos}
            disabled={completedCount === 0 && customTodoCount === 0}
            className="rounded-md bg-[#b4530a] px-4 py-2.5 font-sans text-sm font-medium text-[#f6f1e7] transition-colors hover:bg-[#8f3f08] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-[#b4530a]"
          >
            Clear checks and custom todos
          </button>
        </div>
      </div>
    </div>
  );
}
