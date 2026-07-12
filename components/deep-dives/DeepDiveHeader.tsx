import Link from "next/link";

type DeepDiveHeaderProps = {
  active?: "hack" | "skills" | "deep-dives" | "about";
};

const navItems = [
  { href: "/learn?tab=hack&phase=1", label: "Hack", value: "hack" },
  { href: "/learn?tab=learn&phase=1", label: "Skills", value: "skills" },
  { href: "/deep-dives", label: "Deep Dives", value: "deep-dives" },
  { href: "/about", label: "About", value: "about" },
] as const;

export function DeepDiveHeader({ active = "deep-dives" }: DeepDiveHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/20 bg-white text-[#101010]">
      <div className="mx-auto flex min-h-12 max-w-[1024px] items-center justify-between gap-5 border-x border-black/10 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-sans text-[11px] leading-none transition-colors hover:text-[#3834dc]"
        >
          hackathon guidebook
        </Link>

        <nav
          className="flex items-center gap-4 overflow-x-auto whitespace-nowrap font-sans text-[11px] text-black/55 sm:gap-6"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const isActive = active === item.value;

            return (
              <Link
                key={item.value}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-4 transition-colors hover:text-[#3834dc] ${
                  isActive ? "text-[#3834dc]" : ""
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px bg-[#3834dc]"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
