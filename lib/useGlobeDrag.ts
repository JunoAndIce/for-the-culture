"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Object3D } from "three";
import {
  GLOBE_DRAG_SENSITIVITY,
  GLOBE_MAX_SPIN,
  GLOBE_MIN_SPIN,
  GLOBE_SPIN_DECAY,
  GLOBE_STAGE_SELECTOR,
  GLOBE_TILT_LIMIT,
} from "@/lib/choreography";
import { takeSpinTarget } from "@/lib/waypoints";

/** A pause this long before releasing means the drag has stopped, not flung. */
const STALE_FLING_MS = 80;

/** Fraction of the remaining turn covered each second on the way to a waypoint. */
const TURN_RATE = 7;

/** Radians from the target at which the turn is done. */
const TURN_SETTLED = 0.0015;

// Cached rather than queried per frame: a picked waypoint cuts straight to
// place where motion is unwelcome, instead of sweeping there.
let reduceMotion: MediaQueryList | null = null;
const noTurnEase = () => {
  if (!reduceMotion && typeof window !== "undefined") {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  }
  return reduceMotion?.matches ?? false;
};

const clamp = (v: number, limit: number) => Math.min(limit, Math.max(-limit, v));

/**
 * Tilt outside spin, with no third term. Read right to left, the sphere turns
 * on its own axis first and the result is then tipped toward the viewer, which
 * is how a globe on a stand behaves; the reverse order would swing the poles
 * around the screen instead. "XYZ" is three's default, set here because the
 * hook depends on it rather than merely tolerating it.
 */
function orientAsGlobe(target: Object3D) {
  target.rotation.order = "XYZ";
}

/**
 * Adds one increment of spin. The yaw runs free; the tilt stops short of the
 * poles, both so the globe cannot end up upside down and so a vertical drag has
 * a floor and a ceiling the hand can feel. Returns false once the tilt is
 * pinned there, which is how the fling knows to stop pushing.
 */
function rotate(target: Object3D, yaw: number, pitch: number) {
  target.rotation.y += yaw;

  const tilt = target.rotation.x + pitch;
  target.rotation.x = clamp(tilt, GLOBE_TILT_LIMIT);
  return target.rotation.x === tilt;
}

/**
 * Lets the user spin the globe by dragging, but only on the panel that puts a
 * stage element in the DOM.
 *
 * The gate is the listener itself: handlers live on the stage element, so a
 * drag anywhere else in the document never reaches this hook. There is no
 * "is the right panel showing" test to fall out of sync with the layout.
 *
 * Ownership is split from useSphereScroll rather than shared: that hook drives
 * the nodes above and below this one, so a pose the user leaves behind
 * survives scrolling away and back, and neither writer clobbers the other.
 * See useSphereScroll for why this node sits where it does in the chain.
 */
export function useGlobeDrag(globe: RefObject<Object3D | null>) {
  // Angular velocity in rad/s, carried out of a fling and decayed in useFrame.
  const spin = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  // Where a picked waypoint wants the globe. Null unless a turn is running.
  const turn = useRef<{ yaw: number; pitch: number } | null>(null);

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(GLOBE_STAGE_SELECTOR);
    const target = globe.current;
    if (!stage || !target) return;

    orientAsGlobe(target);

    const noInertia = window.matchMedia("(prefers-reduced-motion: reduce)");

    let pointer: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Ignore secondary buttons; a right-click drag should stay a context menu.
      if (e.button !== 0 || pointer !== null) return;

      // Stops a mouse drag from painting a text selection across the copy it
      // passes over. Left to touch, the same call can suppress panning in some
      // engines, and touch-action is already handling that case.
      if (e.pointerType === "mouse") e.preventDefault();

      pointer = e.pointerId;
      dragging.current = true;
      spin.current.x = 0;
      spin.current.y = 0;
      // A hand on the globe outranks a turn it was part-way through.
      turn.current = null;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = e.timeStamp;

      // Keeps the drag alive past the edge of the stage. Not essential, and
      // it throws if the pointer went away between the event and this line.
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {}
      stage.dataset.grabbing = "true";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = (e.timeStamp - lastTime) / 1000;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = e.timeStamp;

      const yaw = dx * GLOBE_DRAG_SENSITIVITY;
      const pitch = dy * GLOBE_DRAG_SENSITIVITY;

      rotate(target, yaw, pitch);

      // Speed of this one move, kept so releasing mid-drag can fling.
      // Coarse pointers can report two moves on the same millisecond.
      if (dt > 0) {
        spin.current.y = clamp(yaw / dt, GLOBE_MAX_SPIN);
        spin.current.x = clamp(pitch / dt, GLOBE_MAX_SPIN);
      }
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;

      pointer = null;
      dragging.current = false;
      delete stage.dataset.grabbing;

      // Three ways a release is not a fling: the browser or the OS took the
      // gesture away mid-drag, the user asked for less motion, or they held the
      // globe still before letting go — in which case the last move's speed is
      // stale and would throw it unprompted.
      const held = e.timeStamp - lastTime > STALE_FLING_MS;
      if (e.type === "pointercancel" || noInertia.matches || held) {
        spin.current.x = 0;
        spin.current.y = 0;
      }
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerEnd);
    stage.addEventListener("pointercancel", onPointerEnd);

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerEnd);
      stage.removeEventListener("pointercancel", onPointerEnd);
      delete stage.dataset.grabbing;
      dragging.current = false;
    };
  }, [globe]);

  useFrame((_, delta) => {
    const target = globe.current;
    if (!target || dragging.current) return;

    const picked = takeSpinTarget();
    if (picked) {
      // Shorter way round, and a fling still decaying would fight the turn.
      const laps = Math.round((target.rotation.y - picked.yaw) / (Math.PI * 2));
      turn.current = {
        yaw: picked.yaw + laps * Math.PI * 2,
        pitch: clamp(picked.pitch, GLOBE_TILT_LIMIT),
      };
      spin.current.x = 0;
      spin.current.y = 0;
    }

    const to = turn.current;
    if (to) {
      // Frame-rate independent, and instant where motion is unwelcome. Goes
      // through rotate() so the tilt limit holds here as it does for a drag.
      const k = noTurnEase() ? 1 : 1 - Math.exp(-TURN_RATE * delta);
      rotate(
        target,
        (to.yaw - target.rotation.y) * k,
        (to.pitch - target.rotation.x) * k,
      );

      if (
        Math.abs(to.yaw - target.rotation.y) < TURN_SETTLED &&
        Math.abs(to.pitch - target.rotation.x) < TURN_SETTLED
      ) {
        rotate(
          target,
          to.yaw - target.rotation.y,
          to.pitch - target.rotation.x,
        );
        turn.current = null;
      }
      return;
    }

    const v = spin.current;
    if (v.x === 0 && v.y === 0) return;

    // A fling that has tipped the globe as far as it goes keeps its spin but
    // loses its climb, rather than pressing into the limit for a second.
    if (!rotate(target, v.y * delta, v.x * delta)) v.x = 0;

    // Frame-rate independent decay: the same fraction of speed is left after a
    // given second whether the display runs at 60Hz or 144Hz.
    const keep = Math.pow(GLOBE_SPIN_DECAY, delta);
    v.y *= keep;
    v.x *= keep;

    if (Math.abs(v.y) < GLOBE_MIN_SPIN) v.y = 0;
    if (Math.abs(v.x) < GLOBE_MIN_SPIN) v.x = 0;
  });
}
