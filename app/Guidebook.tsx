"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { guide, wins, type Phase } from "./guide";

function scrollToPhase(i: number, smooth = true) {
  document
    .getElementById(`phase-${i}`)
    ?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

type Mode = "learn" | "hack";
const CHECKLIST_STORAGE_KEY = "good-boys-hackathon-guide:checklist:v1";

const itemCount = (p: Phase) =>
  p.checklists.reduce((s, c) => s + c.items.length, 0);

const phaseComplete = (pi: number, done: Record<string, boolean>) =>
  guide[pi].checklists.every((c, gi) =>
    c.items.every((_, ii) => done[`${pi}:${gi}:${ii}`]),
  );

const totalChecks = guide.reduce((sum, phase) => sum + itemCount(phase), 0);
const validChecklistKeys = new Set(
  guide.flatMap((phase, pi) =>
    phase.checklists.flatMap((group, gi) =>
      group.items.map((_, ii) => `${pi}:${gi}:${ii}`),
    ),
  ),
);

function loadStoredChecklistState(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) => validChecklistKeys.has(key) && typeof value === "boolean",
      ),
    ) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function Guidebook() {
  const [mode, setMode] = useState<Mode>("learn");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [pendingScrollPhase, setPendingScrollPhase] = useState<number | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>(loadStoredChecklistState);

  const allDone = Object.values(done).filter(Boolean).length;

  const toggle = (gi: number, ii: number) =>
    setDone((d) => ({
      ...d,
      [`${phaseIdx}:${gi}:${ii}`]: !d[`${phaseIdx}:${gi}:${ii}`],
    }));

  const resetAllChecklists = () => setDone({});
  const enterHackMode = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMode("hack");
  };
  const enterLearnMode = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMode("learn");
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(done));
    } catch {
      // Keep the checklist usable even if storage is unavailable.
    }
  }, [done]);

  return (
    <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#241c12]">
      <div className="sticky top-0 z-30 border-b border-[#241c12]/15 bg-[#f6f1e7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <button
            onClick={() => {
              setPhaseIdx(0);
              enterLearnMode();
            }}
            className="w-fit text-left font-sans text-[11px] uppercase tracking-[0.28em] text-[#8a6d3b] transition-colors hover:text-[#241c12]"
          >
            Good Boys Hackathon Guide
          </button>

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

        <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-2 sm:px-6">
          <ol className="flex min-w-max gap-1">
            {guide.map((p, i) => {
              const active = i === phaseIdx;
              const complete = phaseComplete(i, done);
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
          totalDone={allDone}
          onToggle={toggle}
          onResetAll={resetAllChecklists}
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
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
      <div className="grid gap-12 border-b border-[#241c12]/15 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-center lg:gap-16 lg:pb-16">
        {/* Message */}
        <div>
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

        {/* Receipts */}
        <div className="rounded-xl border border-[#241c12]/15 bg-white/40 p-6 shadow-sm sm:p-7">
          <div className="flex items-baseline justify-between border-b border-[#241c12]/15 pb-4">
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#8a6d3b]">
              Track record
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#241c12]/45">
              2023 — 2025
            </p>
          </div>
          <ul>
            {wins.map((w) => (
              <li key={w.event} className="border-b border-[#241c12]/10">
                <WinItem
                  href={w.href}
                  className="group flex items-baseline justify-between gap-4 py-3.5"
                >
                  <span className="block text-lg leading-tight transition-colors group-hover:text-[#b4530a]">
                    {w.event}
                  </span>
                  <span className="font-sans text-xs uppercase tracking-wider text-[#b4530a]">
                    {w.place}
                  </span>
                </WinItem>
              </li>
            ))}
          </ul>
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
  totalDone,
  onToggle,
  onResetAll,
  onRead,
  onPrev,
  onNext,
}: {
  phaseIdx: number;
  done: Record<string, boolean>;
  totalDone: number;
  onToggle: (gi: number, ii: number) => void;
  onResetAll: () => void;
  onRead: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [resetOpen, setResetOpen] = useState(false);
  const phase = guide[phaseIdx];
  const total = phase.checklists.reduce((s, c) => s + c.items.length, 0);
  const complete = phase.checklists.reduce(
    (s, c, gi) => s + c.items.filter((_, ii) => done[`${phaseIdx}:${gi}:${ii}`]).length,
    0,
  );
  const pct = Math.round((complete / total) * 100);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 pb-28 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
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
            const gDone = group.items.filter(
              (_, ii) => done[`${phaseIdx}:${gi}:${ii}`],
            ).length;
            const gAll = gDone === group.items.length;
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
                    {gAll ? "done" : `${gDone}/${group.items.length}`}
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item, ii) => {
                    const checked = !!done[`${phaseIdx}:${gi}:${ii}`];
                    return (
                      <li key={item.label}>
                        <button
                          onClick={() => onToggle(gi, ii)}
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
                </ul>
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
              disabled={totalDone === 0}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#241c12]/15 px-3 py-2.5 font-sans text-sm text-[#241c12]/65 transition-colors hover:border-[#b4530a]/45 hover:text-[#b4530a] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#241c12]/15 disabled:hover:text-[#241c12]/65"
            >
              <Trash2 aria-hidden="true" size={15} />
              Reset checklist
            </button>
          </section>
        </div>
      </aside>

      {resetOpen && (
        <ResetChecklistDialog
          completedCount={totalDone}
          onCancel={() => setResetOpen(false)}
          onConfirm={() => {
            onResetAll();
            setResetOpen(false);
          }}
        />
      )}
    </main>
  );
}

function ResetChecklistDialog({
  completedCount,
  onCancel,
  onConfirm,
}: {
  completedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
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
              Reset all checklist progress?
            </h2>
            <p className="mt-2 font-sans text-sm leading-6 text-[#241c12]/68">
              This will clear {completedCount} completed checks from this browser. The guide content stays unchanged.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="rounded-md border border-[#241c12]/15 px-4 py-2.5 font-sans text-sm text-[#241c12]/70 transition-colors hover:bg-[#241c12]/5"
          >
            Keep progress
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-[#b4530a] px-4 py-2.5 font-sans text-sm font-medium text-[#f6f1e7] transition-colors hover:bg-[#8f3f08]"
          >
            Reset everything
          </button>
        </div>
      </div>
    </div>
  );
}
