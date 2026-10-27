"use client";

import type { RefObject } from "react";
import type { Material, Object3D, ShaderMaterial } from "three";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  BREAKPOINT_MD,
  GLOBE_GLOW,
  PANEL_SELECTOR,
  SPHERE_TURN_SELECTOR,
  SERVICE_TURN,
  SPHERE_LAYER_OPACITY,
  SPHERE_PATH,
  SPHERE_SCALE,
  type Layout,
  type SphereState,
} from "@/lib/choreography";
import { onSceneRoute } from "@/lib/sceneRoute";
import { onSphereTurn } from "@/lib/sphereTurn";

/**
 * The parts of the sphere this hook drives. They are separate nodes because
 * useGlobeDrag owns a node between them; see the comment on useSphereScroll.
 */
export type SphereNodes = {
  /** Where the sphere sits and how big it is. */
  frame: RefObject<Object3D | null>;
  /** The scroll-driven spin and tilt, on their own node below the user's. */
  spin: RefObject<Object3D | null>;
  /** Solid landmasses. Fades per panel at its share of the panel's opacity. */
  land: RefObject<Material | null>;
  /** The wire lattice over the land. Fades with it, at its own share. */
  wire: RefObject<Material | null>;
  /** The dust ring. Its uniforms carry every per-panel ring value. */
  glow: RefObject<ShaderMaterial | null>;
  /** The ring's lean. Above the drag node, so it never turns with the globe. */
  glowTilt: RefObject<Object3D | null>;
};

/** SphereNodes once every ref has been read and null-checked. */
type Resolved = {
  [K in keyof SphereNodes]: NonNullable<SphereNodes[K]["current"]>;
};

/** A panel's zoom is a multiplier on the layout's base scale. */
const scaleFor = (state: SphereState, base: number) => base * (state.zoom ?? 1);

/** A panel's opacity is absolute; each layer then takes its own share of it. */
const opacityFor = (
  state: SphereState,
  layer: keyof typeof SPHERE_LAYER_OPACITY,
) => state.opacity * SPHERE_LAYER_OPACITY[layer];

/** A panel's tilt is optional; upright is the default. */
const tiltFor = (state: SphereState) => state.rotX ?? 0;

/** Panels are dark by default, so the ring is opt-in per panel. */
const glowFor = (state: SphereState, layout: Layout) =>
  (state.glow ?? 0) * GLOBE_GLOW.intensity[layout];

/** A panel's ring overrides, over the GLOBE_GLOW defaults. */
const ringFor = (state: SphereState) => ({
  tilt: GLOBE_GLOW.tilt,
  radius: GLOBE_GLOW.ring,
  spread: GLOBE_GLOW.spread,
  floor: GLOBE_GLOW.floor,
  thickness: GLOBE_GLOW.thickness,
  size: GLOBE_GLOW.size,
  disc: GLOBE_GLOW.disc,
  inner: GLOBE_GLOW.inner,
  outer: GLOBE_GLOW.outer,
  gap: GLOBE_GLOW.gap,
  gapWidth: GLOBE_GLOW.gapWidth,
  bandFreq: GLOBE_GLOW.bandFreq,
  bandDepth: GLOBE_GLOW.bandDepth,
  ...state.ring,
});

/** Everything a panel poses, as tween targets, so set and timeline cannot drift. */
function poseFor(
  n: Resolved,
  state: SphereState,
  layout: Layout,
): [object, Record<string, number>][] {
  const scale = scaleFor(state, SPHERE_SCALE[layout]);
  const ring = ringFor(state);
  const u = n.glow.uniforms;
  return [
    [n.frame.position, { x: state.x, y: state.y }],
    [n.frame.scale, { x: scale, y: scale, z: scale }],
    [n.spin.rotation, { x: tiltFor(state), y: state.rotY }],
    [n.land, { opacity: opacityFor(state, "land") }],
    [n.wire, { opacity: opacityFor(state, "wire") }],
    [n.glowTilt.rotation, { x: ring.tilt }],
    [u.uOpacity, { value: glowFor(state, layout) }],
    [u.uRing, { value: ring.radius }],
    [u.uSpread, { value: ring.spread }],
    [u.uFloor, { value: ring.floor }],
    [u.uThickness, { value: ring.thickness }],
    [u.uSize, { value: ring.size }],
    [u.uDisc, { value: ring.disc }],
    [u.uInner, { value: ring.inner }],
    [u.uOuter, { value: ring.outer }],
    [u.uGap, { value: ring.gap }],
    [u.uGapWidth, { value: ring.gapWidth }],
    [u.uBandFreq, { value: ring.bandFreq }],
    [u.uBandDepth, { value: ring.bandDepth }],
  ];
}

/** Tilt outside spin, so the sphere turns about a tipped axis rather than tumbling. */
function orientAsAxis(spin: Object3D) {
  spin.rotation.order = "XYZ";
}

function buildTimeline(
  n: Resolved,
  path: SphereState[],
  layout: Layout,
  reduceMotion: boolean,
) {
  const panels = gsap.utils.toArray<HTMLElement>(PANEL_SELECTOR);
  if (panels.length < 2) return false;

  // One timeline on one ScrollTrigger. Independent scrubbed triggers hand off at
  // a hard boundary, which writes the next tween's from-value in a single frame.
  const tops = panels.map((el) => el.offsetTop);
  const span = tops[tops.length - 1] - tops[0];
  if (span <= 0) return false;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: panels[0],
      start: "top top",
      endTrigger: panels[panels.length - 1],
      end: "top top",
      // Reduced motion: stay locked to the scrollbar rather than easing toward it.
      scrub: reduceMotion ? true : 1,
    },
  });

  path.slice(1).forEach((state, i) => {
    if (!panels[i + 1]) return;

    // Each segment lasts the real scroll distance between its two panels, so
    // adding a panel extends the timeline instead of retiming earlier ones.
    const duration = (tops[i + 1] - tops[i]) / span;
    poseFor(n, state, layout).forEach(([target, vars], k) => {
      tl.to(target, { ...vars, duration }, k > 0 ? "<" : i === 0 ? 0 : ">");
    });
  });
  return true;
}

/**
 * With no panels to scroll through, a service deck turns the spin node instead:
 * a step per card, eased, with a slow drift underneath. Returns its cleanup.
 */
function turnWithDeck(n: Resolved, state: SphereState, reduceMotion: boolean) {
  const motion = { step: 0, drift: 0 };
  const apply = () => {
    n.spin.rotation.y = state.rotY + motion.step + motion.drift;
  };

  const drift = (_time: number, deltaMs: number) => {
    motion.drift += (SERVICE_TURN.drift * deltaMs) / 1000;
    apply();
  };
  if (!reduceMotion) gsap.ticker.add(drift);

  const off = onSphereTurn((index, instant) => {
    const step = index * SERVICE_TURN.step;
    if (instant || reduceMotion) {
      gsap.killTweensOf(motion);
      motion.step = step;
      apply();
      return;
    }
    gsap.to(motion, {
      step,
      duration: SERVICE_TURN.duration,
      ease: "power3.out",
      overwrite: true,
      onUpdate: apply,
    });
  });

  return () => {
    gsap.ticker.remove(drift);
    off();
    gsap.killTweensOf(motion);
  };
}

// Tall panels rest anywhere from their top to their bottom edge. Between panels
// a scroll goes on to the next top, or back to the previous panel's bottom edge.
function panelSnapTo(
  value: number,
  self: ScrollTrigger,
  panels: HTMLElement[],
) {
  const { start, end, direction } = self;
  const change = end - start;
  const first = panels[0].offsetTop;
  const rests = panels.map((el): [number, number] => {
    const top = start + el.offsetTop - first;
    return [top, top + Math.max(0, el.offsetHeight - window.innerHeight)];
  });

  const at = start + value * change;
  // GSAP's own 0.1% tolerance, so settling onto a stop can't re-fire the snap.
  const slack = change * 1e-3;
  const here = rests.find(
    ([from, to]) => at >= from - slack && at <= to + slack,
  );
  const ahead = rests.find(([from]) => from > at);
  const behind = rests.filter(([, to]) => to < at).pop();

  let target: number;
  if (here) target = Math.min(Math.max(at, here[0]), here[1]);
  else if (!ahead) target = rests[rests.length - 1][0];
  else if (!behind) target = ahead[0];
  else target = direction < 0 ? behind[1] : ahead[0];
  return (target - start) / change;
}

// Panel snapping, on its own ScrollTrigger. Built per page with the timeline but
// never on a theme change: rebuilding on the theme used to re-fire the snap.
function buildPanelSnap() {
  const panels = gsap.utils.toArray<HTMLElement>(PANEL_SELECTOR);
  if (panels.length < 2) return;
  const span = panels[panels.length - 1].offsetTop - panels[0].offsetTop;
  if (span <= 0) return;

  ScrollTrigger.create({
    trigger: panels[0],
    start: "top top",
    markers: false,
    endTrigger: panels[panels.length - 1],
    end: "top top",
    snap: {
      snapTo: (value, self) =>
        self ? panelSnapTo(value, self, panels) : value,
      duration: { min: 0.5, max: 1.9 },
      delay: 0.2,
      ease: "power2.inOut",
    },
  });
}

/** Everything one page drives: its pose, then the timeline or deck turn, and the snap. */
function buildPage(n: Resolved, layout: Layout, reduceMotion: boolean) {
  const path = SPHERE_PATH[layout];

  // Establish the layout's starting pose before the triggers capture it.
  poseFor(n, path[0], layout).forEach(([target, vars]) => gsap.set(target, vars));

  const built = buildTimeline(n, path, layout, reduceMotion);
  if (!reduceMotion) buildPanelSnap();
  if (!built && document.querySelector(SPHERE_TURN_SELECTOR)) {
    return turnWithDeck(n, path[0], reduceMotion);
  }
}

/**
 * Drives the sphere along SPHERE_PATH as the panels scroll by.
 *
 * This hook is the sole owner of the nodes it is handed and of both materials'
 * opacity — nothing renders position/rotation/scale/opacity as a prop, so a
 * React re-render can't snap them back mid-animation.
 *
 * The transform is split across two nodes so useGlobeDrag can slot its own
 * node in between. Order matters: the user's rotation has to sit above the
 * scroll spin. Both spins are about Y and so commute, but the user's tilt is
 * about X and would otherwise be swung around by whatever spin the scroll had
 * reached — dragging up would roll the globe sideways instead of tipping it.
 * Position and scale stay above everything, so no rotation can turn the
 * sphere's offset into an orbit around the origin.
 *
 * Built once per page (onSceneRoute). Nothing here depends on the theme — the
 * material colour is a React prop — and rebuilding on a toggle was jolting the
 * reader to another panel.
 */
export function useSphereScroll(nodes: SphereNodes) {
  useGSAP(
    () => {
      const frame = nodes.frame.current;
      const spin = nodes.spin.current;
      const land = nodes.land.current;
      const wire = nodes.wire.current;
      const glow = nodes.glow.current;
      const glowTilt = nodes.glowTilt.current;
      if (!frame || !spin || !land || !wire || !glow || !glowTilt) return;

      const n: Resolved = { frame, spin, land, wire, glow, glowTilt };
      orientAsAxis(spin);

      // One matchMedia for the hook's life: GSAP never drops a query's listener,
      // so one per page would leak them. Each page is a context inside it.
      let media: { layout: Layout; reduceMotion: boolean } | null = null;
      let page: gsap.Context | null = null;
      let routed = false;
      let pending = 0;
      const build = () => {
        page?.revert();
        const { layout, reduceMotion } = media!;
        page = gsap.context(() => buildPage(n, layout, reduceMotion));
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: `(min-width: ${BREAKPOINT_MD}px)`,
          isMobile: `(max-width: ${BREAKPOINT_MD - 1}px)`,
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop = false, reduceMotion = false } = context.conditions ?? {};
          media = { layout: isDesktop ? "desktop" : "mobile", reduceMotion };
          if (routed) build();
          return () => {
            page?.revert();
            page = null;
          };
        },
      );

      // The canvas outlives its pages, so each page gets its own build.
      const off = onSceneRoute(() => {
        routed = true;
        page?.revert();
        page = null;
        cancelAnimationFrame(pending);
        // Pose 0 before the new page paints; the build waits a frame for Next's scroll.
        const { layout } = media!;
        poseFor(n, SPHERE_PATH[layout][0], layout).forEach(([target, vars]) =>
          gsap.set(target, vars),
        );
        pending = requestAnimationFrame(build);
      });

      return () => {
        off();
        cancelAnimationFrame(pending);
        page?.revert();
        mm.revert();
      };
    },
    { dependencies: [] },
  );
}
