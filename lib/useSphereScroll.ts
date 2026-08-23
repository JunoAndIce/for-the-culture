"use client";

import type { RefObject } from "react";
import type { Material, Object3D, ShaderMaterial } from "three";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  BREAKPOINT_MD,
  GLOBE_GLOW,
  PANEL_SELECTOR,
  SPHERE_LAYER_OPACITY,
  SPHERE_OPACITY,
  SPHERE_PATH,
  SPHERE_SCALE,
  type Layout,
  type SphereState,
} from "@/lib/choreography";

export type SphereTheme = "light" | "dark";

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

/** Absolute per panel, falling back to the theme's base; each layer takes a share. */
const opacityFor = (
  state: SphereState,
  theme: SphereTheme,
  layer: keyof typeof SPHERE_LAYER_OPACITY,
) => (state.opacity ?? SPHERE_OPACITY[theme]) * SPHERE_LAYER_OPACITY[layer];

/** A panel's tilt is optional; upright is the default. */
const tiltFor = (state: SphereState) => state.rotX ?? 0;

/** Panels are dark by default, so the ring is opt-in per panel. */
const glowFor = (state: SphereState) => (state.glow ?? 0) * GLOBE_GLOW.intensity;

/** A panel's ring overrides, over the GLOBE_GLOW defaults. */
const ringFor = (state: SphereState) => ({
  tilt: GLOBE_GLOW.tilt,
  radius: GLOBE_GLOW.ring,
  spread: GLOBE_GLOW.spread,
  floor: GLOBE_GLOW.floor,
  thickness: GLOBE_GLOW.thickness,
  size: GLOBE_GLOW.size,
  ...state.ring,
});

/** Everything a panel poses, as tween targets, so set and timeline cannot drift. */
function poseFor(
  n: Resolved,
  state: SphereState,
  base: number,
  theme: SphereTheme,
): [object, Record<string, number>][] {
  const scale = scaleFor(state, base);
  const ring = ringFor(state);
  const u = n.glow.uniforms;
  return [
    [n.frame.position, { x: state.x, y: state.y }],
    [n.frame.scale, { x: scale, y: scale, z: scale }],
    [n.spin.rotation, { x: tiltFor(state), y: state.rotY }],
    [n.land, { opacity: opacityFor(state, theme, "land") }],
    [n.wire, { opacity: opacityFor(state, theme, "wire") }],
    [n.glowTilt.rotation, { x: ring.tilt }],
    [u.uOpacity, { value: glowFor(state) }],
    [u.uRing, { value: ring.radius }],
    [u.uSpread, { value: ring.spread }],
    [u.uFloor, { value: ring.floor }],
    [u.uThickness, { value: ring.thickness }],
    [u.uSize, { value: ring.size }],
  ];
}

/** Tilt outside spin, so the sphere turns about a tipped axis rather than tumbling. */
function orientAsAxis(spin: Object3D) {
  spin.rotation.order = "XYZ";
}

function buildTimeline(
  n: Resolved,
  path: SphereState[],
  base: number,
  theme: SphereTheme,
  reduceMotion: boolean,
) {
  const panels = gsap.utils.toArray<HTMLElement>(PANEL_SELECTOR);
  if (panels.length < 2) return;

  // One timeline on one ScrollTrigger. Independent scrubbed triggers hand off at
  // a hard boundary, which writes the next tween's from-value in a single frame.
  const tops = panels.map((el) => el.offsetTop);
  const span = tops[tops.length - 1] - tops[0];
  if (span <= 0) return;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: panels[0],
      start: "top top",
      endTrigger: panels[panels.length - 1],
      end: "top top",
      // Reduced motion: locked to the scrollbar, and no snap — moving the page
      // on the reader's behalf is exactly what they asked not to happen.
      scrub: reduceMotion ? true : 1,
      snap: reduceMotion
        ? undefined
        : {
            // Real panel tops, not an even increment, so a panel taller than the
            // viewport still lands square.
            snapTo: tops.map((top) => (top - tops[0]) / span),
            duration: { min: 0.5, max: 1.9 },
            delay: 0.2,
            ease: "power2.inOut",
          },
    },
  });

  path.slice(1).forEach((state, i) => {
    if (!panels[i + 1]) return;

    // Each segment lasts the real scroll distance between its two panels, so
    // adding a panel extends the timeline instead of retiming earlier ones.
    const duration = (tops[i + 1] - tops[i]) / span;
    poseFor(n, state, base, theme).forEach(([target, vars], k) => {
      tl.to(target, { ...vars, duration }, k > 0 ? "<" : i === 0 ? 0 : ">");
    });
  });
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
 * Rebuilds when the theme changes, because opacity is theme-dependent.
 */
export function useSphereScroll(nodes: SphereNodes, theme: SphereTheme) {
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

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: `(min-width: ${BREAKPOINT_MD}px)`,
          isMobile: `(max-width: ${BREAKPOINT_MD - 1}px)`,
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop = false, reduceMotion = false } =
            context.conditions ?? {};

          const layout: Layout = isDesktop ? "desktop" : "mobile";
          const path = SPHERE_PATH[layout];
          const base = SPHERE_SCALE[layout];

          // Establish the layout's starting pose before the triggers capture it.
          poseFor(n, path[0], base, theme).forEach(([target, vars]) =>
            gsap.set(target, vars),
          );

          buildTimeline(n, path, base, theme, reduceMotion);
        },
      );
    },
    { dependencies: [theme], revertOnUpdate: true },
  );
}
