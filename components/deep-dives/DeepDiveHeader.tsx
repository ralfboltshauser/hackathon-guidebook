"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

type DeepDiveHeaderProps = {
  active?: "learn" | "hack" | "deep-dives";
};

export function DeepDiveHeader({ active = "deep-dives" }: DeepDiveHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/15 bg-page/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <Link
            href="/?tab=learn&phase=1"
            className="w-fit font-sans text-[11px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-ink"
          >
            Hackathon Guidebook
          </Link>
          <span className="font-sans text-[11px] text-ink/38">
            by{" "}
            <a
              href="https://www.linkedin.com/in/ralfboltshauser/"
              target="_blank"
              rel="noreferrer"
              className="text-ink/50 underline-offset-4 transition-colors hover:text-ink/75 hover:underline"
            >
              Ralf Boltshauser
            </a>
            {" and "}
            <a
              href="https://www.linkedin.com/in/konrad-te-heesen-bb2876280/"
              target="_blank"
              rel="noreferrer"
              className="text-ink/50 underline-offset-4 transition-colors hover:text-ink/75 hover:underline"
            >
              Konrad te Heesen
            </a>
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <ThemeToggle />
          <nav
            className="flex items-center rounded-none border border-ink/20 bg-panel p-0.5"
            aria-label="Primary"
          >
            <HeaderTab href="/?tab=learn&phase=1" label="Learn" active={active === "learn"} />
            <HeaderTab href="/?tab=hack&phase=1" label="Hack" active={active === "hack"} />
            <HeaderTab href="/deep-dives" label="Deep Dives" active={active === "deep-dives"} />
          </nav>
        </div>
      </div>
    </header>
  );
}

function HeaderTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }}
      className={`relative flex min-h-9 items-center rounded-none px-4 py-1.5 font-sans text-sm font-medium transition-colors sm:px-5 ${
        active ? "text-page" : "text-ink/60 hover:text-ink"
      }`}
    >
      {active && (
        <span className="absolute inset-0 rounded-none bg-accent" />
      )}
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
