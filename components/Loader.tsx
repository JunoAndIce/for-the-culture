"use client";

import { useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { gsap, useGSAP } from "@/lib/gsap";

/** Shortest time the count stays up, so a warm cache still reads as a count. */
const MIN_MS = 1400;
/** Bail out if the loading manager never reports, rather than trapping the page. */
const TIMEOUT_S = 8;

export default function Loader() {
  // Fed by three's loading manager, which the mask preload in Scene kicks off.
  const { progress } = useProgress();
  const [done, setDone] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const shown = useRef({ value: 0 });
  const startedAt = useRef(0);

  useGSAP(() => {
    // In the mount effect, not a ref initialiser: Date.now() during render is impure.
    startedAt.current = Date.now();
    const bail = gsap.delayedCall(TIMEOUT_S, () => setDone(true));
    return () => bail.kill();
  }, []);

  useGSAP(() => {
    // Written straight to the DOM: at 60fps a state update per frame would
    // re-render the whole tree for one changing digit.
    gsap.to(shown.current, {
      value: progress,
      duration: 0.5,
      ease: "power1.out",
      overwrite: true,
      onUpdate: () => {
        const v = shown.current.value;
        if (label.current) label.current.textContent = String(Math.round(v));
        // Same tween drives both, so the bar can never disagree with the number.
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
      },
    });

    if (progress < 100) return;
    const held = Math.max(0, MIN_MS - (Date.now() - startedAt.current)) / 1000;
    gsap.to(root.current, {
      autoAlpha: 0,
      duration: 0.5,
      delay: held + 0.25,
      onComplete: () => setDone(true),
    });
  }, [progress]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background"
    >
      <span className="sr-only">Loading</span>
      {/* tabular-nums, or the number jitters sideways as the digits change. */}
      <p
        aria-hidden="true"
        className="font-mono text-[0.7rem] tracking-[0.25em] tabular-nums text-foreground/70"
      >
        <span ref={label}>0</span>
        <span className="text-foreground/40">%</span>
      </p>
      <div className="h-px w-40 overflow-hidden bg-foreground/15 md:w-56">
        {/* Inline, not scale-x-0: Tailwind v4 compiles that to the standalone
            `scale` property, which multiplies with transform rather than losing
            to it, pinning the bar at zero however it is tweened. */}
        <div
          ref={bar}
          style={{ transform: "scaleX(0)" }}
          className="h-full w-full origin-left bg-foreground/70"
        />
      </div>
    </div>
  );
}
