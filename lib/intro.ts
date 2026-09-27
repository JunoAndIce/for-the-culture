import { gsap } from "@/lib/gsap";
import { INTRO } from "@/lib/choreography";

// One timeline for the whole post-loader intro. The loader, the camera and the
// words live in different React trees, so they meet here, like lib/waypoints.ts.

type Part = "camera" | "words";
type Phase = "pending" | "playing" | "done";

const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

let timeline: gsap.core.Timeline | null = null;
// "done" is the resting phase: a page with no loader has no intro to wait on.
let phase: Phase = "done";
let wanted = false;
let giveUp: gsap.core.Tween | null = null;
const ready = new Set<Part>();
const listeners = new Set<() => void>();

export function introTimeline() {
  return (timeline ??= gsap.timeline({
    paused: true,
    defaults: { ease: "none" },
    onComplete: finish,
  }));
}

/** Opens an intro. The loader calls this first, before any part registers. */
export function beginIntro() {
  phase = "pending";
  wanted = false;
}

/** A part has put its tweens on the timeline. Returns its cleanup. */
export function registerIntroPart(part: Part) {
  ready.add(part);
  maybeStart();
  return () => {
    ready.delete(part);
  };
}

export const isIntroDone = () => phase === "done";

/** Runs `fn` once the intro has finished, or at once if there is none. */
export function whenIntroDone(fn: () => void) {
  if (phase === "done") {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** The loader is ready to reveal the page. */
export function requestIntro() {
  wanted = true;
  // A part that never arrives must not leave the copy hidden.
  giveUp = gsap.delayedCall(2, completeIntro);
  maybeStart();
}

function maybeStart() {
  if (phase !== "pending" || !wanted) return;
  if (!ready.has("camera") || !ready.has("words")) return;
  giveUp?.kill();

  // Reduced motion, or a reload partway down the page: nothing to play.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || window.scrollY > 8) {
    completeIntro();
    return;
  }

  phase = "playing";
  window.scrollTo(0, 0);
  document.documentElement.classList.add("intro-lock");
  for (const type of SKIP_EVENTS) {
    window.addEventListener(type, skipIntro, { passive: true });
  }
  introTimeline().play(0);
}

/** Jumps to the end state at once. */
export function completeIntro() {
  if (phase === "done") return;
  giveUp?.kill();
  introTimeline().progress(1);
  finish();
}

/** Any input while it plays: catch up to the end quickly instead of cutting. */
export function skipIntro() {
  if (phase !== "playing") return;
  for (const type of SKIP_EVENTS) window.removeEventListener(type, skipIntro);
  const tl = introTimeline();
  tl.pause();
  gsap.to(tl, {
    time: tl.duration(),
    duration: INTRO.skip,
    ease: "power2.out",
    overwrite: true,
  });
}

function finish() {
  if (phase === "done") return;
  phase = "done";
  document.documentElement.classList.remove("intro-lock");
  for (const type of SKIP_EVENTS) window.removeEventListener(type, skipIntro);
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/** Tears the intro down when the page unmounts, so the next mount starts clean. */
export function resetIntro() {
  giveUp?.kill();
  timeline?.kill();
  timeline = null;
  ready.clear();
  listeners.clear();
  wanted = false;
  phase = "done";
  document.documentElement.classList.remove("intro-lock");
  for (const type of SKIP_EVENTS) window.removeEventListener(type, skipIntro);
}
