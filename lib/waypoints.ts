import { Vector3 } from "three";

export type Waypoint = {
  id: string;
  city: string;
  region: string;
  tag: string;
  lat: number;
  lon: number;
  role: string;
  body: string;
};

// Placeholder cities and copy.
export const WAYPOINTS: readonly Waypoint[] = [
  {
    id: "hou",
    city: "Houston",
    region: "TX",
    tag: "HQ",
    lat: 29.76,
    lon: -95.37,
    role: "Home base",
    body: "Where the studio sits. Every project starts with a call that lands here.",
  },
  {
    id: "lit",
    city: "Little Rock",
    region: "AR",
    tag: "Market",
    lat: 34.75,
    lon: -92.29,
    role: "Partner market",
    body: "Retail and restaurant brands. The first market we worked outside Texas.",
  },
  {
    id: "lis",
    city: "Lisbon",
    region: "PT",
    tag: "Studio",
    lat: 38.72,
    lon: -9.14,
    role: "Partner studio",
    body: "Design and production overflow, five hours ahead when a launch needs a night shift.",
  },
  {
    id: "lag",
    city: "Lagos",
    region: "NG",
    tag: "Market",
    lat: 6.52,
    lon: 3.38,
    role: "Partner market",
    body: "Consumer brands building for the diaspora and for home at the same time.",
  },
] as const;

const DEG = Math.PI / 180;

/**
 * Marker direction in the sphere's own space, following SphereGeometry's UV
 * convention — so a pin lands where the equirectangular mask draws that city.
 */
function directionFor({ lat, lon }: Waypoint) {
  const theta = (90 - lat) * DEG;
  const phi = (lon + 180) * DEG;
  const s = Math.sin(theta);
  return new Vector3(-Math.cos(phi) * s, Math.cos(theta), Math.sin(phi) * s);
}

/** Built once: the projector reads these every frame. */
export const DIRECTIONS = new Map(WAYPOINTS.map((w) => [w.id, directionFor(w)]));

// The DOM pins and the sphere live in two React trees — the canvas has its own
// reconciler — so they meet here rather than through context.
const pins = new Map<string, HTMLElement>();

export function registerPin(id: string, el: HTMLElement | null) {
  if (el) pins.set(id, el);
  else pins.delete(id);
}

export const pinFor = (id: string) => pins.get(id);

let requested: string | null = null;

/** A waypoint the reader picked. Consumed by the projector on the next frame. */
export function requestWaypoint(id: string) {
  requested = id;
}

export function takeWaypointRequest() {
  const id = requested;
  requested = null;
  return id;
}

let spinTarget: { yaw: number; pitch: number } | null = null;

/** Where the drag node has to land for that waypoint to face the camera. */
export function setSpinTarget(target: { yaw: number; pitch: number }) {
  spinTarget = target;
}

export function takeSpinTarget() {
  const target = spinTarget;
  spinTarget = null;
  return target;
}
