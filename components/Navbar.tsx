"use client";

import { useState } from "react";

const NAV_ITEMS = [
  "Overview",
  "Affiliations",
  "Projects",
  "Resources",
  "Family",
  "Contact Us"
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-20 p-6 md:p-12">
      {/* Desktop: centered row with dots between items. */}
      <ul className="hidden flex-wrap items-center justify-center text-xs tracking-widest uppercase md:flex md:text-md lg:text-lg">
        {NAV_ITEMS.map((item, i) => (
          <li key={item} className="flex items-center">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="mx-3 text-foreground/40 select-none md:mx-5"
              >
                &bull;
              </span>
            )}
            <a
              href="#"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile: burger in the top-left. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-m-2 block p-2 md:hidden"
      >
        <svg
          className={`ham hamRotate ham8 text-foreground${open ? " active" : ""}`}
          viewBox="0 0 100 100"
          width={48}
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

      <ul
        id="mobile-menu"
        className={`${open ? "flex" : "hidden"} mt-4 flex-col gap-4 text-sm tracking-widest uppercase md:hidden`}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item}>
            <a
              href="#"
              onClick={() => setOpen(false)}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
