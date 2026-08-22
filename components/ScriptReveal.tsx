"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  children: string;
  className?: string;
  /** Seconds the hand takes to cross the word. */
  duration?: number;
};

/**
 * Writes a line of script text on, left to right, as the panel scrolls into
 * view.
 *
 * The reveal is a clip-path wipe rather than a per-character type-on. A
 * connected script is one continuous stroke — revealing it letter by letter
 * would pop disjoint glyphs into existence with gaps between them, which reads
 * as broken rather than handwritten. Wiping the same stroke left to right is
 * what looks like a pen moving.
 *
 * The inset's negative bottom leaves the descenders and swashes outside the
 * clip; a script face hangs well below its baseline and a flat 0 shears them.
 *
 * The clip is applied from inside useGSAP, which runs in a layout effect, so
 * it lands before the browser paints and there is no flash of finished text.
 * Setting it in CSS instead would leave the line permanently invisible to
 * anyone without JS.
 */
export default function ScriptReveal({
  children,
  className,
  duration = 2.4,
}: Props) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;

      const mm = gsap.matchMedia();

      // Reduced motion never clips, so the line is simply there from the start.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(node, { clipPath: "inset(-15% 100% -30% -5%)" });
        const tween = gsap.to(node, {
          clipPath: "inset(-15% -5% -30% -5%)",
          duration,
          ease: "power1.inOut",
          scrollTrigger: { trigger: node, start: "top 85%" },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    },
    { dependencies: [children, duration] },
  );

  return (
    <span ref={el} className={className}>
      {children}
    </span>
  );
}
