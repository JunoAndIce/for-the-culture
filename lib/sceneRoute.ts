// The pathname reaches the canvas through here, set from Scene's layout effect so
// the sphere re-poses in the same commit as the new page, like lib/sphereTurn.ts.

type Listener = (path: string) => void;

let current: string | null = null;
const listeners = new Set<Listener>();

/** The page changed. Scene calls this before the new page paints. */
export function setSceneRoute(path: string) {
  if (path === current) return;
  current = path;
  listeners.forEach((fn) => fn(path));
}

/** Fires at once with the current path, if there is one. Returns the unsubscribe. */
export function onSceneRoute(fn: Listener) {
  listeners.add(fn);
  if (current !== null) fn(current);
  return () => {
    listeners.delete(fn);
  };
}
