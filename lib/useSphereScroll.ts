"use client";

import type { RefObject } from "react";
import type { Mesh } from "three";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  BREAKPOINT_MD,
  PANEL_SELECTOR,
  SPHERE_PATH,
  SPHERE_SCALE,
  type Layout,
  type SphereState,
} from "@/lib/choreography";

/** A panel's zoom is a multiplier on the layout's base scale. */
const scaleFor = (state: SphereState, base: number) => base * (state.zoom ?? 1);

function buildTriggers(
  mesh: Mesh,
  path: SphereState[],
  base: number,
  scrub: number | boolean,
) {
  const panels = gsap.utils.toArray<HTMLElement>(PANEL_SELECTOR);

  path.slice(1).forEach((state, i) => {
    const panel = panels[i + 1];
    if (!panel) return;

    const scrollTrigger = {
      trigger: panel,
      start: "top bottom",
      end: "top top",
      scrub,
    };

    const s = scaleFor(state, base);

    gsap.to(mesh.position, { x: state.x, y: state.y, scrollTrigger });
    gsap.to(mesh.rotation, { y: state.rotY, scrollTrigger });
    gsap.to(mesh.scale, { x: s, y: s, z: s, scrollTrigger });
  });
}

/**
 * Drives the sphere along SPHERE_PATH as the panels scroll by.
 *
 * This hook is the sole owner of the mesh's transform — the mesh deliberately
 * renders without position/rotation props, so a React re-render can't snap it
 * back mid-animation.
 */
export function useSphereScroll(mesh: RefObject<Mesh | null>) {
  useGSAP(() => {
    const m = mesh.current;
    if (!m) return;

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
        gsap.set(m.position, { x: start.x, y: start.y });
        gsap.set(m.rotation, { y: start.rotY });
        gsap.set(m.scale, { x: startScale, y: startScale, z: startScale });

        // Reduced motion: stay locked to the scrollbar rather than easing toward it.
        buildTriggers(m, path, base, reduceMotion ? true : 1);
      },
    );
  }, []);
}
