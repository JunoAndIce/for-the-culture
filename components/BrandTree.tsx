"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Leaf = { slug: string; name: string; launched: string };

const LINE = "w-px bg-foreground/30 origin-top";
const VERB = "absolute top-1/2 left-3 -translate-y-1/2 font-mono text-[0.625rem] tracking-[0.18em] text-red-700 uppercase dark:text-red-500";

/**
 * Who backs whom, drawn top down: FTC funds the collective, and the collective
 * launched these. It draws itself once, the first time it scrolls into view.
 */
export default function BrandTree({ root, leaves }: { root: string; leaves: Leaf[] }) {
  const tree = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(tree);
      gsap
        .timeline({
          defaults: { duration: 0.45, ease: "power2.inOut" },
          scrollTrigger: { trigger: tree.current, start: "top 75%", once: true },
        })
        .from(q("[data-tree='ftc']"), { autoAlpha: 0, y: 8, ease: "power2.out" })
        .from(q("[data-tree='stem']"), { scaleY: 0 })
        .from(q("[data-tree='root']"), { autoAlpha: 0, scale: 0.9, ease: "back.out(2)" }, "-=0.1")
        .from(q("[data-tree='trunk']"), { scaleY: 0 })
        .from(q("[data-tree='branch']"), { scaleX: 0 })
        .from(q("[data-tree='drop']"), { scaleY: 0, duration: 0.3 })
        .from(q("[data-tree='leaf']"), { autoAlpha: 0, y: 10, ease: "back.out(2)", stagger: 0.12 }, "-=0.05")
        .from(q("[data-tree='verb']"), { autoAlpha: 0, duration: 0.3, stagger: 0.1 }, 0.5);
    },
    { scope: tree },
  );

  return (
    <figure ref={tree} className="flex flex-col items-center">
      <figcaption className="sr-only">
        For the Culture funds {root}, which launched {leaves.map((l) => l.name).join(" and ")}.
      </figcaption>
      <span data-tree="ftc" className="font-inter text-3xl leading-none font-black">
        FTC
      </span>

      <div className="relative">
        <div data-tree="stem" className={`${LINE} h-10`} />
        <span data-tree="verb" className={VERB}>
          funds
        </span>
      </div>

      <span
        data-tree="root"
        className="rounded-full border border-foreground/30 bg-background/70 px-5 py-2.5 text-xs tracking-widest uppercase md:text-sm"
      >
        {root}
      </span>

      <div className="relative">
        <div data-tree="trunk" className={`${LINE} h-10`} />
        <span data-tree="verb" className={VERB}>
          launched
        </span>
      </div>

      <div className="w-full">
        <div data-tree="branch" className="mx-auto h-px w-1/2 bg-foreground/30" />
        <div className="grid grid-cols-2 gap-3">
          {leaves.map((leaf) => (
            <div key={leaf.slug} className="flex flex-col items-center">
              <div data-tree="drop" className={`${LINE} h-6`} />
              <a
                href={`#${leaf.slug}`}
                data-tree="leaf"
                className="w-full rounded-2xl border border-red-500/45 bg-red-500/10 px-3 py-3 text-center transition-colors hover:border-red-500 md:px-4"
              >
                <span className="block text-sm font-semibold tracking-wide break-words md:text-base">
                  {leaf.name}
                </span>
                <span className="mt-1 block font-mono text-[0.625rem] text-foreground/55">
                  {leaf.launched}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
