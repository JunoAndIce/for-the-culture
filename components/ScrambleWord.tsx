"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  /** Cycled in order. The first is rendered server-side and shown if motion is reduced. */
  words: readonly string[];
  /** Seconds the scramble itself runs. */
  scramble?: number;
  /** Seconds each word is held once resolved. */
  hold?: number;
  className?: string;
};

export default function ScrambleWord({
  words,
  scramble = 0.9,
  hold = 2,
  className,
}: Props) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;

      const mm = gsap.matchMedia();

      // Only animate when the visitor has not asked for reduced motion.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ repeat: -1 });

        // Start from the second word so the first render is held, not re-scrambled.
        [...words.slice(1), words[0]].forEach((word) => {
          tl.to(node, {
            duration: scramble,
            ease: "none",
            scrambleText: { text: word, chars: "upperCase", speed: 0.4 },
          }).to({}, { duration: hold });
        });

        return () => tl.kill();
      });
    },
    { dependencies: [words, scramble, hold] },
  );

  return (
    /*
     * Every word is rendered invisibly and stacked in one grid cell, so the box
     * is as wide as the WIDEST rendered word — not the one with most characters,
     * which is what letter-width variation makes different.
     *
     * The animated span is absolutely positioned so mid-scramble frames (random
     * glyphs, unpredictable widths) can never push the rest of the sentence.
     */
    <span className={`relative inline-grid align-bottom ${className ?? ""}`}>
      {words.map((word) => (
        <span
          key={word}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1 whitespace-nowrap"
        >
          {word}
        </span>
      ))}
      <span
        ref={el}
        aria-hidden="true"
        className="absolute inset-y-0 left-0 whitespace-nowrap"
      >
        {words[0]}
      </span>
      {/* Screen readers get one stable word instead of the churn. */}
      <span className="sr-only">{words[0]}</span>
    </span>
  );
}
