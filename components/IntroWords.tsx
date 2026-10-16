"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { INTRO, SCRIPT_WIPE } from "@/lib/choreography";
import { introTimeline, registerIntroPart } from "@/lib/intro";

const named = (name: string) =>
  gsap.utils.toArray<HTMLElement>(`[data-intro="${name}"]`);

/**
 * Puts the hero's words, the navbar and the scroll cue on the intro timeline,
 * found by their data-intro marks. Renders nothing.
 *
 * Hidden states come from fromTo inside useGSAP, a layout effect, so they land
 * before the loader lifts. Without JS, or with reduced motion, nothing hides.
 */
export default function IntroWords() {
  useGSAP(() => {
    const tl = introTimeline();
    const at = INTRO.wordsAt;

    const beat = (
      name: string,
      from: gsap.TweenVars,
      to: gsap.TweenVars,
      when: number,
    ) => {
      const els = named(name);
      if (!els.length) return;
      tl.fromTo(els, from, { duration: 0.6, ease: "power2.out", ...to }, at + when);
    };

    beat("eyebrow", { autoAlpha: 0, y: 8, letterSpacing: "0.52em" }, { autoAlpha: 1, y: 0, letterSpacing: "0.34em" }, 0);
    // A connected script is one stroke, so it is wiped on rather than typed.
    beat("wordmark", { clipPath: SCRIPT_WIPE.from }, { clipPath: SCRIPT_WIPE.to, duration: 2.2, ease: "power1.inOut" }, 0.3);
    beat("tagline", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.4);
    beat("scramble", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0 }, 2);
    beat("actions", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.1 }, 2.4);
    beat("nav", { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0 }, 2.8);
    beat("cue", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0 }, 2.8);

    // The first word resolves out of noise as its line arrives.
    const word = gsap.utils.toArray<HTMLElement>("[data-scramble]")[0];
    if (word) {
      tl.to(
        word,
        {
          duration: 0.9,
          ease: "none",
          scrambleText: { text: word.textContent ?? "", chars: "upperCase", speed: 0.4 },
        },
        at + 2,
      );
    }

    return registerIntroPart("words");
  }, []);

  return null;
}
