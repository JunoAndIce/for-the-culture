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
  desktop: [
    { x: 0.9, y: 0, rotY: Math.PI * -0.13, rotX: Math.PI * 0.12, zoom: 1.65, opacity: 0.05, },
    {
      x: -1.4,
      y: 0,
      rotY: Math.PI * 3.1,
      rotX: Math.PI * 0.2,
      zoom: 1.2,
      opacity: 0.12,
    },
    {
      x: 0,
      y: -0.3,
      rotY: Math.PI * 0.1,
      rotX: Math.PI * 0.5,
      zoom: 2.5,
      opacity: 0.013,
    },
    // The globe panel. Centred, framed whole, and opaque enough to read as an
    // object rather than a texture — it is the subject here, not a backdrop.
    { x: 0, y: 0, rotY: Math.PI * 1.5, rotX: 0, zoom: 0.8, opacity: 0.52 },
    // Work panel. Pushed off behind the index column and faded nearly out —
    // this screen is dense, and the sphere is wallpaper again.
    {
      x: -1.7,
      y: 0.25,
      rotY: Math.PI * 1.9,
      rotX: Math.PI * 0.16,
      zoom: 1.7,
      opacity: 0.008,
    },
  ],
  // Behind the copy: drifts down the screen instead of across it, because a
  // portrait viewport has no horizontal room to move through.
  mobile: [
    { x: 0, y: 0.75, rotY: 0, rotX: Math.PI * 0.12, zoom: 1.35 },
    { x: 0, y: 0, rotY: Math.PI * 0.6, rotX: Math.PI * 0.18, opacity: 0.02 },
    {
      x: 0,
      y: -0.9,
      rotY: Math.PI * 1.1,
      rotX: Math.PI * 0.1,
      zoom: 1.6,
      opacity: 0.06,
    },
    // Zoom stays at 1 so the whole globe fits the ~1.3 world units of width a
    // portrait viewport has; anything larger crops it at the sides.
    { x: 0, y: 0, rotY: Math.PI * 1.5, rotX: 0, zoom: 1, opacity: 0.5 },
    // Sunk below the content rather than beside it; a portrait viewport has no
    // room to the side of a panel this dense.
    {
      x: 0,
      y: -1.1,
      rotY: Math.PI * 1.9,
      rotX: Math.PI * 0.16,
      zoom: 1.5,
      opacity: 0.04,
    },
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
 * Land/ocean mask, used as the material's alphaMap so the sphere only draws
 * over land. It is a mask rather than a colour map on purpose: alphaMap decides
 * *where* the material draws and leaves the colour to SPHERE_COLOR, so the
 * globe still inverts with the theme. As a colour map it could not — the
 * material's colour multiplies the texture, and multiplying only ever darkens.
 *
 * Source texture by moryenn on CGTrader — see CREDITS.md, which is the copy
 * that has to stay accurate. Derived from design/8k_earth_specular_map.tif,
 * which stores ocean white and land black; the conversion inverts it so land
 * is what survives:
 *   ffmpeg -i <src>.tif -vf "scale=2048:1024,format=gray,negate" public/earth-mask.png
 */
export const SPHERE_MASK = "/earth-mask.png";

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
  land: 1.9,
  wire: 0.075,
};

/**
 * The wire sphere's radius as a multiple of the land sphere's. The two are
 * otherwise coplanar, and neither writes depth, so which one wins is left to
 * draw order. Floating the wire just outside settles it: the lattice always
 * reads as an outline over the fill rather than flickering through it.
 */
export const SPHERE_WIRE_OFFSET = 1.003;

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
