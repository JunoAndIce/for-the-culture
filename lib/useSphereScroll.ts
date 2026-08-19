"use client";

import type { RefObject } from "react";
import type { Material, Mesh } from "three";
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

/** A panel's zoom is a multiplier on the layout's base scale. */
const scaleFor = (state: SphereState, base: number) => base * (state.zoom ?? 1);

/** A panel's opacity is absolute; it falls back to the theme's base. */
const opacityFor = (state: SphereState, theme: SphereTheme) =>
  state.opacity ?? SPHERE_OPACITY[theme];

function buildTriggers(
  mesh: Mesh,
  material: Material,
  path: SphereState[],
  base: number,
  theme: SphereTheme,
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
    gsap.to(material, { opacity: opacityFor(state, theme), scrollTrigger });
  });
}

/**
 * Drives the sphere along SPHERE_PATH as the panels scroll by.
 *
 * This hook is the sole owner of the mesh's transform and the material's
 * opacity — the mesh deliberately renders without position/rotation/opacity
 * props, so a React re-render can't snap them back mid-animation.
 *
 * Rebuilds when the theme changes, because opacity is theme-dependent.
 */
export function useSphereScroll(
  mesh: RefObject<Mesh | null>,
  theme: SphereTheme,
) {
  useGSAP(
    () => {
      const m = mesh.current;
      if (!m) return;

      const material = m.material as Material;
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
          gsap.set(material, { opacity: opacityFor(start, theme) });

          // Reduced motion: stay locked to the scrollbar rather than easing toward it.
          buildTriggers(
            m,
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
