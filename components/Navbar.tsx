"use client";

import Link from "next/link";
import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";
import { NAV_ITEMS } from "@/lib/nav";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-20 p-4 md:p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-foreground/15 bg-neutral-100/20 px-4 py-2 shadow-lg shadow-black/20 backdrop-blur-md md:px-5 md:py-2.5 dark:bg-neutral-800/20">
        <div className="flex items-center justify-between gap-4">
          {/* Desktop: the options, dotted, on the left. */}
          <ul className="hidden flex-wrap items-center text-[0.65rem] tracking-widest uppercase md:flex md:text-xs">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.label} className="flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-2 text-foreground/40 select-none md:mx-3"
                  >
                    &bull;
                  </span>
                )}
                <Link
                  href={item.href}
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile: burger in the same slot the options take on desktop. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-m-1 block p-1 md:hidden"
          >
            <svg
              className={`ham hamRotate ham8 text-foreground${open ? " active" : ""}`}
              viewBox="0 0 100 100"
              width={34}
            >
              <path
                className="line top"
                d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
              />
              <path className="line middle" d="m 30,50 h 40" />
              <path
                className="line bottom"
                d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
              />
            </svg>
          </button>

          {/* Far right in both layouts. */}
          <ThemeToggle />
        </div>

        <ul
          id="mobile-menu"
          className={`${open ? "flex" : "hidden"} flex-col gap-3 border-t border-foreground/10 pt-3 mt-2 text-xs tracking-widest uppercase md:hidden`}
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
