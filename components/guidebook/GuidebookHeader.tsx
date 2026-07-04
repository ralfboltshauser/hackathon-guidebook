"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BrandLockup } from "@/components/BrandLockup";
import { ThemeToggle } from "@/components/ThemeToggle";
import { type CustomTodo } from "@/app/checklist-store";
import { guide } from "@/app/guide";
import { phaseComplete, type Mode } from "@/lib/guidebook";

type GuidebookHeaderProps = {
  mode: Mode;
  phaseIdx: number;
  done: Record<string, boolean>;
  customTodos: Record<string, CustomTodo[]>;
  onLogoClick: () => void;
  onModeChange: (mode: Mode) => void;
  onPhaseSelect: (phaseIdx: number) => void;
};

export function GuidebookHeader({
  mode,
  phaseIdx,
  done,
  customTodos,
  onLogoClick,
  onModeChange,
  onPhaseSelect,
}: GuidebookHeaderProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-ink/15 bg-page/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <BrandLockup>
          <button
            onClick={onLogoClick}
            className="w-fit text-left font-sans text-[11px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-ink"
          >
            Hackathon Guidebook
          </button>
        </BrandLockup>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <ThemeToggle />
          <div className="flex items-center rounded-none border border-ink/20 bg-panel p-0.5">
            <ModeButton
              active={mode === "learn"}
              onClick={() => onModeChange("learn")}
              label="Learn"
            />
            <ModeButton
              active={mode === "hack"}
              onClick={() => onModeChange("hack")}
              label="Hack"
            />
            <ModeLink href="/deep-dives" label="Deep Dives" />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-2 sm:px-6">
        <div className="min-w-0 overflow-x-auto">
          <ol className="flex min-w-max gap-1">
            {guide.map((phase, i) => {
              const active = i === phaseIdx;
              const complete = phaseComplete(i, done, customTodos);
              return (
                <li key={phase.n} className="flex-shrink-0">
                  <button
                    onClick={() => onPhaseSelect(i)}
                    className={`group relative flex items-baseline gap-2 rounded-none px-3 py-1.5 transition-colors ${
                      active ? "text-page" : "hover:bg-ink/5"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="phase-tab-indicator"
                        className="absolute inset-0 rounded-none bg-accent"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span
                      className={`relative z-10 font-sans text-[10px] tabular-nums ${
                        active ? "text-page/60" : "text-ink/40"
                      }`}
                    >
                      {phase.n}
                    </span>
                    <span className="relative z-10 text-sm">{phase.title}</span>
                    {complete && (
                      <span
                        className={`relative z-10 font-sans text-xs ${
                          active ? "text-page" : "text-accent"
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
        <nav className="flex flex-shrink-0 items-center gap-3 font-sans text-[11px] text-ink/42">
          <Link
            href="/about"
            className="underline-offset-4 transition-colors hover:text-ink/70 hover:underline"
          >
            About
          </Link>
          <a
            href="https://github.com/ralfboltshauser/hackathon-guidebook"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 transition-colors hover:text-ink/70 hover:underline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </div>
  );
}

function ModeLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative flex min-h-9 items-center gap-2 rounded-none px-4 py-1.5 font-sans text-sm font-medium text-ink/60 transition-colors hover:text-ink sm:px-5"
    >
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex min-h-9 items-center gap-2 rounded-none px-4 py-1.5 font-sans text-sm font-medium transition-colors sm:px-5 ${
        active ? "text-page" : "text-ink/60 hover:text-ink"
      }`}
    >
      {active && <span className="absolute inset-0 rounded-none bg-accent" />}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
