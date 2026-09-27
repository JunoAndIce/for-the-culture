"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { WAYPOINTS, registerPin, requestWaypoint } from "@/lib/waypoints";

/** How long the drag hint stays up once the globe panel is on screen. */
const HINT_MS = 6000;

/**
 * The waypoints, and the key that turns the globe to them.
 *
 * The key is not decoration: dragging cannot be tabbed to, so this is the only
 * way a keyboard reaches the globe at all.
 */
export default function GlobeKey() {
  const root = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const [hintGone, setHintGone] = useState(false);
  const clearOpen = useRef<number | null>(null);

  // Pins are viewport-fixed, because the canvas behind them is. Without this
  // gate they would float over every other panel.
  useGSAP(
    () => {
      const panel = root.current?.closest("[data-panel]");
      if (!panel) return;
      ScrollTrigger.create({
        trigger: panel as HTMLElement,
        start: "top 30%",
        end: "bottom 70%",
        onToggle: (self) => {
          setInView(self.isActive);
          if (clearOpen.current) window.clearTimeout(clearOpen.current);
          // Keep the selection alive for the fade, so an open dialog leaves
          // with the key rather than blinking out ahead of it.
          if (!self.isActive)
            clearOpen.current = window.setTimeout(() => setOpenId(null), 300);
        },
      });
    },
    { scope: root },
  );

  useEffect(
    () => () => {
      if (clearOpen.current) window.clearTimeout(clearOpen.current);
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // The clock runs only while the panel is on screen, and leaving early
  // restarts it, so the hint is never spent unseen.
  useEffect(() => {
    if (!inView || hintGone) return;
    const timer = window.setTimeout(() => setHintGone(true), HINT_MS);
    return () => window.clearTimeout(timer);
  }, [inView, hintGone]);

  const pick = (id: string) => {
    setOpenId(id);
    requestWaypoint(id);
  };

  const open = WAYPOINTS.find((w) => w.id === openId);

  return (
    <div ref={root} className="contents">
      <div
        aria-hidden={!inView}
        className={`pointer-events-none fixed inset-0 z-20 transition-opacity duration-300 motion-reduce:transition-none ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        {WAYPOINTS.map((w) => (
          <button
            key={w.id}
            ref={(el) => {
              registerPin(w.id, el);
              return () => registerPin(w.id, null);
            }}
            type="button"
            tabIndex={inView ? 0 : -1}
            onClick={() => pick(w.id)}
            aria-expanded={openId === w.id}
            aria-label={`${w.city}, ${w.region} — ${w.role}`}
            // The far side keeps its place in the tab order, just quietly.
            className="group pointer-events-auto absolute top-0 left-0 grid size-7 place-items-center rounded-full transition-opacity data-back:opacity-25 motion-reduce:transition-none"
          >
            <span className="relative grid size-2.5 place-items-center">
              {/* The ping ring shares the dot's footprint — it only scales via
                  transform, so it never nudges the city label's left-5 offset. */}
              <span className="absolute size-2.5 animate-ping rounded-full bg-red-500 opacity-60 motion-reduce:hidden" />
              <span className="relative size-2.5 rounded-full bg-red-500 shadow-[0_0_0_3px_rgba(224,65,58,0.22),0_0_12px_rgba(224,65,58,0.7)] transition-transform group-hover:scale-150 group-aria-expanded:scale-150 motion-reduce:transition-none" />
            </span>
            <span className="absolute left-5 font-mono text-[0.55rem] tracking-[0.16em] whitespace-nowrap text-foreground/70 uppercase drop-shadow-[0_0_6px_var(--background)] group-data-back:hidden">
              {w.city}
            </span>
          </button>
        ))}
      </div>

      <div
        className={`fixed z-20 flex flex-col gap-3 transition-opacity duration-300 motion-reduce:transition-none max-lg:inset-x-4 max-lg:bottom-6 lg:top-1/2 lg:left-8 lg:flex-row lg:items-start lg:gap-8 lg:-translate-y-1/2 xl:left-16 ${
          inView ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* order-2 puts this to the right of the key on lg+ while leaving it
            first in source order, which is where it still needs to sit for
            the stacked mobile layout below lg. No card: a drop-shadow glow
            (same trick the pin labels use) keeps it legible over the globe
            without boxing it in. */}
        {open && (
          <div
            role="dialog"
            aria-label={`${open.city} detail`}
            className="pb-1 lg:order-2 lg:w-80 xl:w-96"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-xs font-bold tracking-[0.18em] text-foreground uppercase drop-shadow-[0_0_6px_var(--background)] lg:text-lg">
                {open.city}, {open.region}
              </p>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close"
                className="text-foreground/60 drop-shadow-[0_0_6px_var(--background)] transition-colors hover:text-foreground"
              >
                &times;
              </button>
            </div>
            <p className="mt-1 font-mono text-[0.6rem] tracking-[0.16em] text-red-700 uppercase drop-shadow-[0_0_6px_var(--background)] dark:text-red-500 lg:mt-2 lg:text-sm">
              {open.role}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed font-medium text-foreground/80 drop-shadow-[0_0_6px_var(--background)] lg:mt-4 lg:max-w-sm lg:text-lg">
              {open.body}
            </p>
          </div>
        )}

        {/* The key builds as its own beat. The fixed container around it keeps
            fading with the panel, so it still leaves with the panel. */}
        <nav
          data-unfold
          aria-label="Waypoints"
          className="flex flex-col lg:order-1 lg:w-64 lg:shrink-0 xl:w-72"
        >
          <p className="hidden border-b border-foreground/15 pb-2 font-mono text-[0.55rem] tracking-[0.28em] text-foreground/40 uppercase lg:block lg:text-xs">
            Key
          </p>

          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
            {WAYPOINTS.map((w) => (
              <button
                key={w.id}
                type="button"
                tabIndex={inView ? 0 : -1}
                onClick={() => pick(w.id)}
                aria-current={openId === w.id}
                className="group flex shrink-0 items-center gap-2.5 rounded-full border border-foreground/20 bg-background/80 px-3 py-1.5 backdrop-blur-md transition-colors aria-[current=true]:border-red-500 lg:grid lg:w-full lg:grid-cols-[auto_1fr_auto] lg:gap-x-2.5 lg:rounded-none lg:border-0 lg:border-b lg:border-foreground/15 lg:bg-transparent lg:px-0.5 lg:py-2.5 lg:backdrop-blur-none lg:hover:border-foreground/40"
              >
                <span className="size-1.5 rounded-full bg-foreground/25 transition-colors group-aria-[current=true]:bg-red-500 group-aria-[current=true]:shadow-[0_0_0_3px_rgba(224,65,58,0.2)] motion-reduce:transition-none" />
                <span className="font-mono text-[0.6rem] tracking-[0.16em] text-foreground/60 uppercase group-aria-[current=true]:text-foreground lg:text-left lg:text-xs">
                  {w.city}
                </span>
                <span className="hidden font-mono text-[0.55rem] tracking-[0.1em] text-foreground/40 uppercase lg:block lg:text-[0.6rem]">
                  {w.tag}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile only: lifted clear of the key row, and out of its way while
          a waypoint is open. The desktop column never reaches down here. */}
      <div
        data-unfold
        className="relative row-start-3 mb-12 flex flex-col items-center gap-4 text-center max-lg:pointer-events-none lg:mb-0"
      >
        <p
          className={`max-w-2xl text-xs leading-relaxed font-bold text-foreground/70 transition-opacity duration-300 motion-reduce:transition-none md:text-lg ${
            openId ? "max-lg:opacity-0" : ""
          }`}
        >
          Our partners run out of Lagos, Lisbon, and Little Rock. The work
          travels further than we do, and it is meant to.
        </p>
        {/* Fades rather than unmounts, so the caption above never shifts. */}
        <p
          aria-hidden={hintGone}
          className={`text-[0.65rem] tracking-[0.3em] text-foreground/50 uppercase transition-opacity duration-300 motion-reduce:transition-none md:text-xs ${
            hintGone ? "opacity-0" : ""
          }`}
        >
          Drag to spin the globe
        </p>
      </div>
    </div>
  );
}
