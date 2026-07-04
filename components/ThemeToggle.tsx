"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem("hackathon-guidebook-theme");

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const initialTheme = readInitialTheme();
      applyTheme(initialTheme);
      setTheme(initialTheme);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem("hackathon-guidebook-theme", nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-ink/20 bg-panel text-ink/65 transition-colors hover:border-accent/55 hover:text-accent"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" size={17} />
      ) : (
        <Moon aria-hidden="true" size={17} />
      )}
    </button>
  );
}
