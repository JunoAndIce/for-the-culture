// The /overview deck is in the DOM tree and the sphere in the canvas's own
// reconciler, so the card index crosses here, like lib/waypoints.ts.

type Listener = (index: number, instant: boolean) => void;

let current = 0;
const listeners = new Set<Listener>();

/** The deck's card changed. */
export function turnSphereTo(index: number) {
  current = index;
  listeners.forEach((fn) => fn(index, false));
}

/** Starts from the card already showing, without a turn. Returns the unsubscribe. */
export function onSphereTurn(fn: Listener) {
  listeners.add(fn);
  fn(current, true);
  return () => {
    listeners.delete(fn);
  };
}

/** The deck unmounted: the next one starts on its first card. */
export function resetSphereTurn() {
  current = 0;
}
