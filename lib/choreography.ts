/**
 * Where the sphere sits on each full-screen panel, per layout.
 *
 * To add a screen: add a <section data-panel> to app/page.tsx and append one
 * entry to BOTH paths below. Order must match document order.
 *
 * Index 0 is the sphere's starting state. Every later entry is the state it
 * animates to as that panel scrolls into view.
 */

export type SphereState = {
  /** World-space X. Positive is right. */
  x: number;
  /** World-space Y. Positive is up. */
  y: number;
  /** Y-axis rotation in radians. */
  rotY: number;
  /**
   * Zoom for this panel, multiplied onto the layout's base scale.
   * 1 (default) = normal, >1 = closer, <1 = further away.
   */
  zoom?: number;
  /**
   * Wireframe opacity for this panel. Absolute, not a multiplier.
   * Omit to use SPHERE_OPACITY for the active theme.
   */
  opacity?: number;
};

export type Layout = "desktop" | "mobile";

/** Matches Tailwind's `md`. Keep these in sync. */
export const BREAKPOINT_MD = 768;

/** Panels opt in explicitly, so unrelated <section> tags can't shift the timing. */
export const PANEL_SELECTOR = "[data-panel]";

export const SPHERE_PATH: Record<Layout, SphereState[]> = {
  // Beside the copy: right on panel one, left on panel two.
  desktop: [
    { x: 0.9, y: 0, rotY: 0, zoom: 1.8 },
    { x: -1.4, y: 0, rotY: Math.PI * 0.6, zoom: 1.2, opacity: 0.18 },
  ],
  // Behind the copy: drifts down the screen instead of across it, because a
  // portrait viewport has no horizontal room to move through.
  mobile: [
    { x: 0, y: 0.75, rotY: 0, zoom: 1.35 },
    { x: 0, y: 0, rotY: Math.PI * 0.6, opacity: 0.02 },
  ],
};

/**
 * The camera's fov is vertical, so a portrait viewport sees only ~1.3 world
 * units of width. At scale 1 the sphere (2 units across) would overflow it.
 */
export const SPHERE_SCALE: Record<Layout, number> = {
  desktop: 1,
  mobile: 0.55,
};

/** Geometry detail. Mobile gets a quarter of the segments; invisible at 0.1 opacity. */
export const SPHERE_SEGMENTS: Record<Layout, [number, number]> = {
  desktop: [64, 32],
  mobile: [32, 16],
};

/**
 * Wireframe colour per theme. A white mesh is invisible on a light
 * background, so the lines invert with the theme.
 */
export const SPHERE_COLOR: Record<"light" | "dark", string> = {
  light: "#000000",
  dark: "#ffffff",
};

/**
 * Base wireframe opacity per theme, used when a panel does not set its own.
 * Dark lines on a light background read heavier than the reverse at the same
 * value, so light runs lower.
 */
export const SPHERE_OPACITY: Record<"light" | "dark", number> = {
  light: 0.07,
  dark: 0.1,
};
