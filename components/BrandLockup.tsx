import type { ReactNode } from "react";

type BrandLockupProps = {
  children: ReactNode;
};

export function BrandLockup({ children }: BrandLockupProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {children}
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
      </span>
    </div>
  );
}
