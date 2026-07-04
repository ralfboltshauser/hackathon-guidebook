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
      <div className="grid gap-12 border-b border-ink/15 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-start lg:gap-16 lg:pb-16">
        <div className="lg:pt-2">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-accent">
            The hackathon playbook
          </p>
          <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.75rem)] font-light leading-[0.9]">
            Everything we learned winning and losing hackathons.
          </h1>
          <p className="mt-7 max-w-xl text-xl font-light leading-snug text-ink/80">
            We have spent years competing in hackathons, using each one to push
            the edge of what we could build and learn. These are the lessons that
            kept proving themselves.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 rounded-none bg-accent px-6 py-3.5 font-sans text-sm font-medium text-page transition-colors hover:bg-accent-strong"
            >
              Open the playbook
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
            <button
              onClick={onChecklists}
              className="inline-flex items-center rounded-none border border-ink/25 px-6 py-3.5 font-sans text-sm font-medium text-ink/80 transition-colors hover:border-accent hover:text-ink"
            >
              Go to the checklists
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-none border border-ink/15 shadow-sm">
          <div className="relative h-52 overflow-hidden bg-panel sm:h-60">
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
            <div className="absolute bottom-3 left-4 z-10 h-5">
              {wins.map((w, i) => (
                <span
                  key={w.event}
                  className={`absolute bottom-0 left-0 whitespace-nowrap rounded-none bg-page/70 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.22em] text-ink/80 backdrop-blur-sm transition-opacity duration-500 ${
                    activePhoto === i ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {w.event}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-panel/70 px-6 pb-6 pt-2 sm:px-7 sm:pb-7">
            <div className="flex items-baseline justify-between border-b border-ink/15 pb-3">
              <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-muted">
                Track record
              </p>
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink/45">
                2023 &ndash; 2025
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
                  className="border-b border-ink/10 last:border-0"
                >
                  <WinItem
                    href={w.href}
                    className="group flex items-baseline justify-between gap-4 py-3"
                  >
                    <span
                      className={`block text-base leading-tight transition-colors duration-200 ${
                        activePhoto === i
                          ? "text-accent"
                          : "group-hover:text-accent"
                      }`}
                    >
                      {w.event}
                    </span>
                    <span className="flex-shrink-0 font-sans text-xs uppercase tracking-wider text-accent">
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
  children: ReactNode;
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
      className="scroll-mt-32 border-b border-ink/12 py-14 first:pt-2 last:border-0 sm:py-20"
    >
      <header className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-accent">
            Phase {phase.n}
          </p>
          <span className="h-px w-8 bg-ink/20" />
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted">
            {phase.timebox}
          </p>
        </div>
        <h2 className="mt-5 text-[clamp(2.8rem,7vw,5.5rem)] font-light leading-[0.9]">
          {phase.title}
        </h2>
        <p className="mt-6 text-2xl font-light leading-snug text-ink/80 sm:text-[1.75rem] sm:leading-snug">
          {phase.thesis}
        </p>
      </header>

      <div className="mt-8 max-w-4xl border-l-2 border-accent bg-panel/60 py-5 pl-6 pr-5">
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-muted">
          Field Rule
        </p>
        <p className="mt-2 text-xl leading-snug text-ink/88">
          {phase.fieldRule}
        </p>
      </div>

      <div className="mt-14">
        <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-muted">
          The Work
        </p>
        <div className="mt-2 space-y-12">
          {phase.sections.map((section, si) => (
            <section key={section.title} className="border-t border-ink/12 pt-8">
              <div className="grid gap-x-10 gap-y-4 lg:grid-cols-[4.5rem_minmax(0,1fr)]">
                <div className="font-sans text-sm tabular-nums text-accent lg:pt-1.5">
                  {phase.n}.{String(si + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-light leading-tight sm:text-3xl">
                    {section.title}
                  </h3>
                  <p className="mt-3 max-w-2xl font-sans text-[15px] leading-7 text-ink/65">
                    {section.intent}
                  </p>
                  <div className="mt-6 grid gap-x-10 gap-y-7 lg:grid-cols-2">
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-ink/55">
                        Do
                      </p>
                      <ul className="mt-3 space-y-3">
                        {section.moves.map((move) => (
                          <li
                            key={move}
                            className="flex gap-3 font-sans text-sm leading-6 text-ink/85"
                          >
                            <span className="mt-[0.4rem] h-1.5 w-1.5 flex-shrink-0 rounded-none bg-accent" />
                            <span>{move}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {section.avoid?.length ? (
                      <div className="lg:border-l lg:border-ink/10 lg:pl-10">
                        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-accent/75">
                          Avoid
                        </p>
                        <ul className="mt-3 space-y-3">
                          {section.avoid.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 font-sans text-sm leading-6 text-ink/55"
                            >
                              <span className="mt-px flex-shrink-0 text-xs text-accent/70">
                                &times;
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

      <div className="mt-10 overflow-hidden rounded-none bg-panel-strong text-ink">
        <div className="grid gap-6 p-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-accent-strong">
              Mantra
            </p>
            <p className="mt-3 text-2xl font-light italic leading-snug sm:text-3xl">
              &quot;{phase.mantra}&quot;
            </p>
          </div>
          <button
            onClick={onOpenChecklist}
            className="group flex items-center justify-between gap-4 rounded-none border border-ink/25 px-5 py-4 text-left transition-colors hover:border-accent-strong hover:bg-ink/5 sm:flex-col sm:items-start sm:gap-2"
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-accent-strong">
              Now do it
            </span>
            <span className="flex items-center gap-2 text-lg">
              Open checklist
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
