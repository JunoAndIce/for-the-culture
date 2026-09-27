"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PANEL_SELECTOR, UNFOLD } from "@/lib/choreography";

const VARIANTS = {
  rise: {
    from: { autoAlpha: 0, y: UNFOLD.rise },
    to: { autoAlpha: 1, y: 0 },
  },
  // Project cards start past the carousel's clipped edge and travel in with no
  // fade: a card that fades while it moves reads as a fade, not a slide.
  slide: {
    from: { x: (_i: number, el: HTMLElement) => el.parentElement?.clientWidth ?? 0 },
    to: { x: 0, duration: UNFOLD.slideDuration, ease: "power4.out" },
  },
  draw: {
    from: { scaleX: 0, transformOrigin: "0% 50%" },
    to: { scaleX: 1 },
  },
};

// At rest: the panel fills the screen. Tolerance covers the snap's last pixels.
const covers = (panel: HTMLElement) => {
  const { top, bottom } = panel.getBoundingClientRect();
  return top <= 8 && bottom >= window.innerHeight - 8;
};

// Each panel's copy waits, hidden, while it arrives, and builds on a timer once
// scrolling has stopped on it, so the build is seen and not scrolled past.
export function useUnfold() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Reduced motion never hides anything, so the copy is simply there.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Home is the intro's.
      const builds = gsap.utils
        .toArray<HTMLElement>(PANEL_SELECTOR)
        .slice(1)
        .flatMap((panel) => {
          const items = gsap.utils.toArray<HTMLElement>("[data-unfold]", panel);
          if (!items.length) return [];

          const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
          items.forEach((el, k) => {
            // A bare data-unfold renders as "true", so anything unnamed rises.
            const named = el.dataset.unfold ?? "";
            const kind = named in VARIANTS ? (named as keyof typeof VARIANTS) : "rise";
            const { from, to } = VARIANTS[kind];
            tl.fromTo(el, from, { duration: UNFOLD.duration, ...to }, k * UNFOLD.stagger);
          });
          return [{ panel, tl, played: false }];
        });

      const settle = () => {
        for (const build of builds) {
          if (build.played || !covers(build.panel)) continue;
          build.played = true;
          // Re-measure: a slide starts one container width away, and that may have changed.
          build.tl.invalidate().play(0);
        }
      };

      let idle: gsap.core.Tween | undefined;
      const onScroll = () => {
        idle?.kill();
        idle = gsap.delayedCall(UNFOLD.settle, settle);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      // A load that lands on a panel never scrolls, so check once.
      idle = gsap.delayedCall(UNFOLD.settle, settle);

      // Fully off screen, a panel resets, so it builds again on its next arrival.
      const resets = builds.map((build) =>
        ScrollTrigger.create({
          trigger: build.panel,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) return;
            build.played = false;
            build.tl.pause(0);
          },
        }),
      );

      return () => {
        window.removeEventListener("scroll", onScroll);
        idle?.kill();
        resets.forEach((trigger) => trigger.kill());
        builds.forEach((build) => build.tl.kill());
      };
    });
  }, []);
}
