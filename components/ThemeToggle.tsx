"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Both icons are always in the DOM; CSS picks which is visible off the `.dark`
 * class on <html>. That avoids the usual hydration mismatch — the server can't
 * know the stored theme, so branching in JS would render the wrong icon first.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="fixed top-0 right-0 z-30 p-6 md:p-8">
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        className="relative flex size-10 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
      >
        <Sun className="size-5 scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute size-5 scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
      </button>
    </div>
  );
}
