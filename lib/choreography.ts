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
   * Axial tilt in radians, applied outside rotY the way Earth's is: the sphere
   * spins about an axis that has been tipped, rather than tumbling end over
   * end. Positive tips the north pole toward the viewer. Omit for upright.
   */
  rotX?: number;
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
  /**
   * Strength of the tri-colour halo on this panel, 0 to 1, scaled by
   * GLOBE_GLOW.intensity. Omit for no glow — which is every panel but the one
   * where the globe is yours to spin.
   */
  glow?: number;
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
    { x: 0.9, y: 0, rotY: Math.PI * -0.13, rotX: Math.PI * 0.12, zoom: 1.65, opacity: 0.3, glow: 1 },
    { x: -1.4, y: 0, rotY: Math.PI * -0.5, rotX: Math.PI * -0.1, zoom: 1.2, opacity: 0.5, glow: 1 },
    { x: 0, y: -0.3, rotY: Math.PI * 0.1, rotX: Math.PI * 0.5, zoom: 2.5, opacity: 0.1,},
    { x: 0, y: 0, rotY: Math.PI * 1.5, rotX: 0, zoom: 0.8, opacity: 1, glow: 1 },
    { x: -1.7, y: 0.25, rotY: Math.PI * 1.9, rotX: Math.PI * 0.16, zoom: 1.7, opacity: 0.05,},
  ],
  mobile: [
    { x: 0, y: 0.75, rotY: 0, rotX: Math.PI * 0.12, zoom: 1.35 },
    { x: 0, y: 0, rotY: Math.PI * 0.6, rotX: Math.PI * 0.18, opacity: 0.1 },
    { x: 0, y: -0.9, rotY: Math.PI * 1.1, rotX: Math.PI * 0.1, zoom: 1.6, opacity: 0.06, },
    { x: 0, y: 0, rotY: Math.PI * 1.5, rotX: 0, zoom: 1, opacity: 1, glow: 1 },
    { x: 0, y: 1.1, rotY: Math.PI * 2, rotX: Math.PI * 0.3, zoom: 1.5, opacity: 0.04, },
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

/**
 * Land/ocean mask, used as the material's alphaMap
 * As a colour map it could not — the material's colour multiplies the texture, and multiplying only ever darkens.
 *
 * Source texture by moryenn on CGTrader — see CREDITS.md, which is the copy
 * that has to stay accurate.
 *   
 * ffmpeg -i <src>.tif -vf "scale=WxH,format=gray,negate" public/earth-mask-Nk.png
 *
 * Both sizes here are roughly double what that measurement asks for — desktop
 * draws the globe ~1235px across and wants ~3900, mobile ~664px and wants
 * ~2090. The headroom is deliberate, chosen on how it looked: it costs 170MB of
 * VRAM on desktop and 43MB on mobile, against 43MB and 11MB at the measured
 * sizes. design/earth-mask-2k.png is a spare if mobile turns out too heavy.
 */
export const SPHERE_MASK: Record<Layout, string> = {
  desktop: "/earth-mask-8k.png",
  mobile: "/earth-mask-4k.png",
};

/**
 * The one place the mask URL is decided. Both the preload in Scene and the load
 * in WireframeSphere go through it — if they picked separately and disagreed,
 * the page would quietly fetch two masks and show the slower one.
 */
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
  wire: 0.05,
};

export const SPHERE_WIRE_OFFSET = 1.003;

export const GLOBE_GLOW = {
  /** How many motes. Cheap — these are single points, not geometry. */
  count: 14000,
  /** Radius of the ring, in globe radii. 1 is exactly the silhouette. */
  ring: 1.3,
  /** Gaussian spread of the ring across its radius. Bigger is hazier. */
  spread: 0.1,
  /** Gaussian depth through the screen, in globe radii. Gives the ring body. */
  thickness: 0.07,
  floor: 1.08,
  tilt: 0,
  size: 1.5,
  /**
   * How steeply brightness is weighted toward the dim end. 1 is even; higher
   * leaves most motes faint and a few bright, which is what stops a point
   * cloud looking like uniform static. Past about 3 the colour stops reading.
   */
  contrast: 1.7,
  /** Ceiling on brightness, before a panel's own `glow` scales it down. */
  intensity: 1.6,
  /** Radians per second the ring turns in its own plane. 0 holds it still. */
  drift: 0.05,
  /**
   * Bearing of the colour sweep, in radians. 0 runs left to right — the same
   * direction as the script line on the services panel.
   */
  angle: 0,
  /**
   * Red, gold, green. Ordered to match the services gradient rather than the
   * order they were asked for, so the two read as one palette; swap the
   * entries to re-run the sweep.
   */
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

/**
 * How far a vertical drag can tip the globe off its axis, in radians — the
 * knob for how much up-and-down travel the user gets. Stopping short of a right
 * angle keeps a pole from swinging through the centre of the frame, and gives
 * the gesture a floor and a ceiling, which matters because the globe stage
 * takes vertical swipes away from the page scroll.
 *
 * 0.5 would put the pole dead centre at the extreme; below about 0.2 the drag
 * stops feeling like it does anything.
 */
export const GLOBE_TILT_LIMIT = Math.PI * 0.4;

/** Fraction of the fling's speed that survives each second after release. */
export const GLOBE_SPIN_DECAY = 0.06;

/** Ceiling on fling speed, in radians per second, so a fast flick stays readable. */
export const GLOBE_MAX_SPIN = 4;

/** Below this speed the fling has effectively stopped; snap it to rest. */
export const GLOBE_MIN_SPIN = 0.002;
