"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Both icons are always in the DOM; CSS picks which is visible off the `.dark`
 * class on <html>. That avoids the usual hydration mismatch — the server can't
 * know the stored theme, so branching in JS would render the wrong icon first.
 *
 * Bare button, no positioning of its own: the navbar box places it. shrink-0
 * keeps it its full size when the options row is wide enough to compete.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex size-8 shrink-0 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
    >
      <Sun className="size-4 scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
    </button>
  );
}
