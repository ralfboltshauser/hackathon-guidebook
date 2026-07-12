"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { type Mode } from "@/lib/guidebook";

type GuidebookHeaderProps = {
  mode: Mode;
  onLogoClick: () => void;
  onModeChange: (mode: Mode) => void;
};

export function GuidebookHeader({
  mode,
  onLogoClick,
  onModeChange,
}: GuidebookHeaderProps) {
  const dark = mode === "hack";
  const text = dark ? "text-[#f1f4ff]" : "text-ink";
  const subdued = dark ? "text-[#9aa0b1]" : "text-ink/58";

  return (
    <header
      className={`sticky top-0 z-30 border-b ${
        dark ? "border-white/20 bg-black" : "border-ink/25 bg-page"
      }`}
    >
      <div className="mx-auto flex min-h-11 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          onClick={onLogoClick}
          className={`min-w-0 truncate text-left font-sans text-[11px] transition-colors hover:text-accent ${text}`}
        >
          hackathon guidebook <span className={subdued}>+ field notes</span>
        </button>
        <nav
          className={`flex items-center gap-4 overflow-x-auto whitespace-nowrap font-sans text-[11px] ${subdued}`}
          aria-label="Primary"
        >
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <HeaderButton
            active={mode === "hack"}
            dark={dark}
            onClick={() => onModeChange("hack")}
          >
            Hack
          </HeaderButton>
          <HeaderButton
            active={mode === "learn"}
            dark={dark}
            onClick={() => onModeChange("learn")}
          >
            Skills
          </HeaderButton>
          <Link href="/deep-dives" className="transition-colors hover:text-accent">
            Deep Dives
          </Link>
          <Link href="/about" className="transition-colors hover:text-accent">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HeaderButton({
  active,
  dark,
  onClick,
  children,
}: {
  active: boolean;
  dark: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`transition-colors hover:text-accent ${
        active ? (dark ? "text-[#f1f4ff]" : "text-ink") : ""
      }`}
    >
      {children}
    </button>
  );
}
