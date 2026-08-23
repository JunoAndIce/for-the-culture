/**
 * Where the sphere sits on each full-screen panel, per layout.
 *
 * To add a screen: add a <section data-panel> to app/page.tsx and append one
 * entry to BOTH paths below. Order must match document order.
 *
 * Index 0 is the sphere's starting state. Every later entry is the state it
 * animates to as that panel scrolls into view.
 */

/** Per-panel ring overrides. Every field is tweened between panels. */
export type RingState = {
  tilt?: number;
  radius?: number;
  spread?: number;
  floor?: number;
  thickness?: number;
  size?: number;
};

export type SphereState = {
  x: number;
  y: number;
  rotY: number;
  rotX?: number;
  zoom?: number;
  /**
   * Wireframe opacity for this panel. Absolute, not a multiplier.
   * Omit to use SPHERE_OPACITY for the active theme.
   */
  opacity?: number;
  glow?: number;
  ring?: RingState;
};

export type Layout = "desktop" | "mobile";

/** Matches Tailwind's `md`. Keep these in sync. */
export const BREAKPOINT_MD = 768;

/** Panels opt in explicitly, so unrelated <section> tags can't shift the timing. */
export const PANEL_SELECTOR = "[data-panel]";

export const SPHERE_PATH: Record<Layout, SphereState[]> = {
  // Beside the copy: right on panel one, left on panel two.
  //
  // The tilt leans through the middle of the page and unwinds to nothing on
  // the globe panel, so the sphere arrives upright and square to the viewer
  // just as it becomes something to handle, then leans off again for the work.
  // That panel is also the only one that lights the halo — see `glow`.
  desktop: [
    { x: 0.9, y: 0, rotY: Math.PI * -0.13, rotX: Math.PI * 0.12, zoom: 1.65, opacity: 0.3, glow: 1, ring: { tilt: 1.1, radius: 1.5 } },
    { x: -1.4, y: 0, rotY: Math.PI * -0.5, rotX: Math.PI * -0.1, zoom: 1.2, opacity: 0.5, glow: 1, ring: { tilt: 1.65, radius: 1.45 } },
    { x: 0, y: -0.3, rotY: Math.PI * 0.1, rotX: Math.PI * 0.5, zoom: 2.5, opacity: 0.1,},
    { x: 0, y: 0, rotY: Math.PI * 1.5, rotX: 0, zoom: 0.8, opacity: 1, glow: 1, ring: {spread: 0.1, floor: 1.06} },
    { x: -1.7, y: 0.25, rotY: Math.PI * 1.9, rotX: Math.PI * 0.16, zoom: 1.7, opacity: 0.05, glow: 1, ring: { tilt: 1.57, radius: 1.45 }},
  ],
  mobile: [
    { x: 0, y: 0.75, rotY: 0, rotX: Math.PI * 0.12, zoom: 0.95, opacity: 0.2, glow: 1, ring: { tilt: 2.2, radius: 1.5 } },
    { x: 0, y: 0, rotY: Math.PI * 0.6, rotX: Math.PI * 0.18, zoom: 0.75, opacity: 0.08, glow: 1, ring: { tilt: 1.85, radius: 1.45 } },
    { x: 0, y: -0.9, rotY: Math.PI * 1.1, rotX: Math.PI * 0.1, zoom: 1.6, opacity: 0.06, glow: 1, ring: { tilt: 0.95, radius: 1.45 } },
    { x: 0, y: 0, rotY: Math.PI * 1.5, rotX: 0, zoom: 0.75, opacity: 1, glow: 1 },
    { x: 0, y: 1.1, rotY: Math.PI * 2, rotX: Math.PI * 0.3, zoom: 1.5, opacity: 0.04, glow: 1, ring: { tilt: 1.57, radius: 1.45 } },
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

export const SPHERE_MASK: Record<Layout, string> = {
  desktop: "/earth-mask-8k.png",
  mobile: "/earth-mask-4k.png",
};

export function maskUrlFor(width: number) {
  return width >= BREAKPOINT_MD ? SPHERE_MASK.desktop : SPHERE_MASK.mobile;
}

/**
 * The globe is two layers on one sphere: solid landmasses, and the wire
 * lattice over them that gives the shape an outline. They have to be separate
 * meshes because one material cannot be both filled and wireframe.
 *
 * Each layer's share of whatever opacity the current panel calls for. The land
 * carries the globe; the wire is structure drawn on top and reads heavier than
 * the land at matching values, so it runs lighter. Set `wire` to 0 for solid
 * continents alone, or `land` to 0 for the bare lattice the site had before.
 */
export const SPHERE_LAYER_OPACITY = {
  land: 2,
  wire: 0.09,
};

export const SPHERE_WIRE_OFFSET = 1.003;

export const GLOBE_GLOW = {
  /** How many motes. Baked at mount, so this one cannot be per-panel. */
  count: 14000,
  /** Ring radius in globe radii. 1 is exactly the silhouette. */
  ring: 1.18,
  /** Gaussian spread across the radius. Bigger is hazier. */
  spread: 0.07,
  /** Gaussian depth through the screen, in globe radii. */
  thickness: 0.07,
  /** Hard inner limit, keeping the Gaussian's tail off the globe's face. */
  floor: 1.09,
  /** Lean in radians. 0 is face-on; ~1.15 reads as Saturn, past 1.4 is a line. */
  tilt: 0,
  /** Mote size in CSS pixels. */
  size: 1.5,
  /** Brightness weighting toward the dim end. Baked, so not per-panel. */
  contrast: 1.7,
  /** Ceiling on brightness, before a panel's own `glow` scales it down. */
  intensity: 2,
  /** Radians per second the ring turns in its own plane. */
  drift: 0.03,
  /** Bearing of the colour sweep, in radians. 0 runs left to right. */
  angle: 0,
  /** Red, gold, green — the services gradient's palette and order. */
  colors: ["#E0413A", "#F4BC48", "#2FA05E"],
} as const;

/**
 * The one panel whose markup opts into spinning the globe by hand. Every other
 * panel leaves the sphere entirely to the scroll timeline, so interactivity is
 * scoped by which element exists in the DOM rather than by a runtime check.
 */
export const GLOBE_STAGE_SELECTOR = "[data-globe-stage]";

/** Radians of spin per pixel dragged. */
export const GLOBE_DRAG_SENSITIVITY = 0.006;

export const GLOBE_TILT_LIMIT = Math.PI * 0.4;

/** Fraction of the fling's speed that survives each second after release. */
export const GLOBE_SPIN_DECAY = 0.06;

/** Ceiling on fling speed, in radians per second, so a fast flick stays readable. */
export const GLOBE_MAX_SPIN = 4;

/** Below this speed the fling has effectively stopped; snap it to rest. */
export const GLOBE_MIN_SPIN = 0.002;
