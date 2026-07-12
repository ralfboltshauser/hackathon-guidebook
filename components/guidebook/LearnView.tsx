"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { guide, wins, type Phase } from "@/app/guide";
import { scrollToPhase } from "@/lib/guidebook";

const WIN_PHOTOS = [
  "/hackathon-proof/start-hack.jpg",
  "/hackathon-proof/moin-hack.png",
  "/hackathon-proof/eth-ai-hack.jpeg",
  "/hackathon-proof/basel-hack.jpeg",
  "/hackathon-proof/eth-agentic-systems-lab.jpeg",
  "/hackathon-proof/ibm-bobathon.jpeg",
  "/hackathon-proof/konrad-hack-team.jpeg",
];

type LearnViewProps = {
  initialPhase: number;
  pendingScrollPhase: number | null;
  onActivePhase: (i: number) => void;
  onPendingScrollSettled: () => void;
  onOpenChecklist: (i: number) => void;
};

export function LearnView({
  initialPhase,
  pendingScrollPhase,
  onActivePhase,
  onPendingScrollSettled,
  onOpenChecklist,
}: LearnViewProps) {
  const startPhase = useRef(initialPhase);

  useEffect(() => {
    if (startPhase.current > 0) {
      scrollToPhase(startPhase.current, false);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const phase = Number((entry.target as HTMLElement).dataset.phase);

          if (pendingScrollPhase !== null && phase !== pendingScrollPhase) {
            continue;
          }

          onActivePhase(phase);

          if (phase === pendingScrollPhase) {
            onPendingScrollSettled();
          }
        }
      },
      { rootMargin: "-26% 0px -62% 0px", threshold: 0 },
    );

    document
      .querySelectorAll("[data-phase]")
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [onActivePhase, onPendingScrollSettled, pendingScrollPhase]);

  return (
    <main className="overflow-hidden bg-page pb-24">
      <Hero
        onStart={() => scrollToPhase(0)}
        onChecklists={() => onOpenChecklist(0)}
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-x border-ink/15">
          <header className="relative overflow-hidden border-y border-ink/20 px-5 py-12 sm:px-9 sm:py-16">
            <span className="absolute inset-y-0 left-1/4 hidden w-px bg-ink/10 lg:block" />
            <span className="absolute inset-y-0 right-1/4 hidden w-px bg-ink/10 lg:block" />
            <p className="relative font-sans text-[10px] text-accent">002</p>
            <div className="relative mx-auto mt-14 max-w-3xl text-center">
              <span className="inline-flex rounded-md bg-accent px-3 py-1 font-sans text-[11px] text-white">
                Problem:
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 560 128"
                className="mx-auto h-20 w-full max-w-xl text-ink/60"
                fill="none"
              >
                <path
                  d="M34 18c0 65 50 78 194 78 99 0 157-35 238-18 31 7 53 18 58 34"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
              </svg>
              <h2 className="-mt-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.06em]">
                The 6 Phases
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ink/62">
                A field guide for turning a short weekend into a deliberate team
                advantage.
              </p>
            </div>
          </header>

          <div className="px-5 sm:px-9">
            {guide.map((phase, index) => (
              <PhaseArticle
                key={phase.n}
                phase={phase}
                index={index}
                onOpenChecklist={() => onOpenChecklist(index)}
              />
            ))}
          </div>
        </div>
      </section>
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
    }, 3800);

    return () => window.clearInterval(interval);
  }, [isPhotoCyclePaused]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="relative overflow-hidden border border-ink/25">
        <span className="absolute inset-y-0 left-1/4 hidden w-px bg-ink/10 lg:block" />
        <span className="absolute inset-y-0 right-1/4 hidden w-px bg-ink/10 lg:block" />
        <div className="absolute inset-x-0 top-[7.25rem] h-px bg-ink/10" />
        <p className="absolute left-5 top-5 z-10 font-sans text-[10px] text-accent sm:left-7">
          001
        </p>
        <div className="grid min-h-[38rem] lg:grid-cols-[1.08fr_.92fr]">
          <div className="relative flex flex-col justify-end px-5 pb-8 pt-28 sm:px-9 sm:pb-11 lg:pt-36">
            <p className="font-sans text-[11px] text-ink/58">available now</p>
            <h1 className="mt-7 max-w-xl text-[clamp(3.6rem,8vw,7.8rem)] leading-[0.78] tracking-[-0.075em]">
              Structure your{" "}
              <span className="block text-accent">thinking.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-ink/66">
              The patterns, checklists, and hard-won context behind teams that
              repeatedly made their hackathon weekends count.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onStart}
                className="rounded-lg bg-accent px-5 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-accent-strong"
              >
                Read the playbook
              </button>
              <button
                onClick={onChecklists}
                className="rounded-lg border border-ink/30 bg-page px-5 py-3 font-sans text-sm transition-colors hover:border-accent hover:text-accent"
              >
                Open checklist
              </button>
            </div>
          </div>

          <div className="relative border-t border-ink/15 bg-panel/35 lg:border-l lg:border-t-0">
            <div className="relative h-72 overflow-hidden border-b border-ink/15 sm:h-80 lg:h-[23.5rem]">
              {WIN_PHOTOS.map((source, index) => (
                <Image
                  key={source}
                  src={source}
                  alt={wins[index]?.event ?? "Hackathon team"}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 1023px) calc(100vw - 2rem), 40vw"
                  className={`object-cover transition-opacity duration-700 ${
                    activePhoto === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <span className="absolute bottom-4 left-4 bg-page px-2 py-1 font-sans text-[10px] text-ink/70">
                {wins[activePhoto]?.event}
              </span>
            </div>
            <ul
              onMouseLeave={() => setIsPhotoCyclePaused(false)}
              className="divide-y divide-ink/10 px-5 py-3 sm:px-7"
            >
              {wins.slice(0, 4).map((win, index) => (
                <li key={win.event}>
                  <WinItem
                    href={win.href}
                    className={`flex items-center justify-between gap-4 py-2.5 text-sm transition-colors ${
                      activePhoto === index
                        ? "text-accent"
                        : "text-ink/68 hover:text-accent"
                    }`}
                    onMouseEnter={() => {
                      setIsPhotoCyclePaused(true);
                      setActivePhoto(index);
                    }}
                  >
                    <span>{win.event}</span>
                    <span className="font-sans text-[10px] uppercase tracking-[0.12em]">
                      {win.place}
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
  onMouseEnter,
}: {
  href?: string;
  className: string;
  children: ReactNode;
  onMouseEnter: () => void;
}) {
  if (!href) {
    return (
      <div className={className} onMouseEnter={onMouseEnter}>
        {children}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onMouseEnter={onMouseEnter}
    >
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
      className="scroll-mt-16 border-b border-ink/15 py-14 first:pt-12 sm:py-20"
    >
      <header className="grid gap-6 border-b border-ink/15 pb-9 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="font-sans text-xs text-accent">
            {phase.n.padStart(2, "0")}
          </p>
          <p className="mt-2 font-sans text-[11px] text-ink/50">{phase.timebox}</p>
        </div>
        <div>
          <h2 className="text-[clamp(2.5rem,6.4vw,5.2rem)] leading-[0.84] tracking-[-0.06em] text-accent">
            {phase.title}
          </h2>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-ink/70 sm:text-2xl">
            {phase.thesis}
          </p>
        </div>
      </header>

      <div className="grid gap-7 pt-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
        <div className="font-sans text-[11px] text-ink/50">Field rule</div>
        <div>
          <p className="max-w-3xl text-lg leading-8 text-ink/85">{phase.fieldRule}</p>
          <div className="mt-10 space-y-10">
            {phase.sections.map((section, sectionIndex) => (
              <section key={section.title} className="border-t border-ink/15 pt-6">
                <div className="grid gap-5 lg:grid-cols-[4rem_minmax(0,1fr)]">
                  <span className="font-sans text-xs text-accent">
                    {phase.n}.{String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-2xl leading-tight sm:text-3xl">{section.title}</h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ink/62">
                      {section.intent}
                    </p>
                    <div className="mt-6 grid gap-7 sm:grid-cols-2">
                      <div>
                        <p className="font-sans text-[11px] text-accent">Do</p>
                        <ul className="mt-3 space-y-2.5 text-sm leading-6 text-ink/82">
                          {section.moves.map((move) => (
                            <li key={move} className="flex gap-3">
                              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                              <span>{move}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {section.avoid?.length ? (
                        <div className="border-l border-ink/10 pl-5">
                          <p className="font-sans text-[11px] text-ink/52">Avoid</p>
                          <ul className="mt-3 space-y-2.5 text-sm leading-6 text-ink/55">
                            {section.avoid.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span aria-hidden="true" className="text-accent">
                                  ×
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

          <div className="mt-10 grid gap-5 border border-ink/20 bg-panel/55 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-8">
            <div>
              <p className="font-sans text-[11px] text-accent">Mantra</p>
              <p className="mt-3 max-w-2xl text-xl italic leading-8 text-ink/80">
                &quot;{phase.mantra}&quot;
              </p>
            </div>
            <button
              onClick={onOpenChecklist}
              className="rounded-lg bg-accent px-5 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-accent-strong"
            >
              Open checklist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
