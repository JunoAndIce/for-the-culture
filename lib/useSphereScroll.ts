"use client";

import type { RefObject } from "react";
import type { Material, Object3D } from "three";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  BREAKPOINT_MD,
  PANEL_SELECTOR,
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
  /** The wireframe's material, whose opacity fades per panel. */
  material: RefObject<Material | null>;
};

/** A panel's zoom is a multiplier on the layout's base scale. */
const scaleFor = (state: SphereState, base: number) => base * (state.zoom ?? 1);

/** A panel's opacity is absolute; it falls back to the theme's base. */
const opacityFor = (state: SphereState, theme: SphereTheme) =>
  state.opacity ?? SPHERE_OPACITY[theme];

/** A panel's tilt is optional; upright is the default. */
const tiltFor = (state: SphereState) => state.rotX ?? 0;

/**
 * Tilt outside spin, so the sphere turns about an axis that has been tipped
 * rather than tumbling end over end. "XYZ" is three's default, set here because
 * the choreography depends on it rather than merely tolerating it.
 */
function orientAsAxis(spin: Object3D) {
  spin.rotation.order = "XYZ";
}

function buildTimeline(
  frame: Object3D,
  spin: Object3D,
  material: Material,
  path: SphereState[],
  base: number,
  theme: SphereTheme,
  scrub: number | boolean,
) {
  const panels = gsap.utils.toArray<HTMLElement>(PANEL_SELECTOR);
  if (panels.length < 2) return;

  // One timeline on one ScrollTrigger, rather than a trigger per panel.
  // Independent scrubbed triggers hand off at a hard boundary: because scrub
  // makes the sphere lag the scroll, crossing that boundary clamps the next
  // tween to progress 0 and writes its from-value in a single frame — a visible
  // snap, most obvious when scrolling back up.
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
      scrub,
    },
  });

  path.slice(1).forEach((state, i) => {
    if (!panels[i + 1]) return;

    // Each segment lasts the real scroll distance between its two panels, so
    // adding a panel extends the timeline instead of retiming earlier ones.
    const duration = (tops[i + 1] - tops[i]) / span;
    const scale = scaleFor(state, base);
    const at = "<";

    tl.to(
      frame.position,
      { x: state.x, y: state.y, duration },
      i === 0 ? 0 : ">",
    )
      .to(frame.scale, { x: scale, y: scale, z: scale, duration }, at)
      .to(spin.rotation, { x: tiltFor(state), y: state.rotY, duration }, at)
      .to(material, { opacity: opacityFor(state, theme), duration }, at);
  });
}

/**
 * Drives the sphere along SPHERE_PATH as the panels scroll by.
 *
 * This hook is the sole owner of both nodes it is handed and of the material's
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
      const material = nodes.material.current;
      if (!frame || !spin || !material) return;

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
          const start = path[0];
          const startScale = scaleFor(start, base);

          // Establish the layout's starting pose before the triggers capture it.
          gsap.set(frame.position, { x: start.x, y: start.y });
          gsap.set(frame.scale, {
            x: startScale,
            y: startScale,
            z: startScale,
          });
          gsap.set(spin.rotation, { x: tiltFor(start), y: start.rotY });
          gsap.set(material, { opacity: opacityFor(start, theme) });

          // Reduced motion: stay locked to the scrollbar rather than easing toward it.
          buildTimeline(
            frame,
            spin,
            material,
            path,
            base,
            theme,
            reduceMotion ? true : 1,
          );
        },
      );
    },
    { dependencies: [theme], revertOnUpdate: true },
  );
}
