"use client";

import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, type Group } from "three";
import {
  DIRECTIONS,
  WAYPOINTS,
  pinFor,
  setSpinTarget,
  takeWaypointRequest,
} from "@/lib/waypoints";

// Scratch vectors, reused every frame rather than allocated per pin.
const world = new Vector3();
const normal = new Vector3();
const toCamera = new Vector3();
const center = new Vector3();
const turned = new Vector3();

/**
 * Puts the DOM pins where their cities are, and turns clicks on them into a
 * rotation useGlobeDrag can apply. Renders nothing.
 *
 * Pins are DOM buttons rather than 3D objects because the canvas is fixed
 * behind the panels with the drag surface over it, so a raycast never reaches
 * them — and buttons come with focus and labels for free.
 */
export default function Waypoints({ spin }: { spin: RefObject<Group | null> }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useFrame(() => {
    const node = spin.current;
    if (!node) return;

    // GSAP writes the rotations on its own ticker, and r3f updates matrices
    // after this callback, so refresh the chain before reading it.
    node.updateWorldMatrix(true, false);
    center.setFromMatrixPosition(node.matrixWorld);

    const picked = takeWaypointRequest();
    const direction = picked && DIRECTIONS.get(picked);
    if (direction) {
      // The drag node is this node's parent, so aim from the direction the
      // scroll spin has already left the city in. Rx(pitch)·Ry(yaw)·v = +Z.
      turned.copy(direction).applyQuaternion(node.quaternion);
      setSpinTarget({
        yaw: Math.atan2(-turned.x, turned.z),
        pitch: Math.atan2(turned.y, Math.hypot(turned.x, turned.z)),
      });
    }

    for (const waypoint of WAYPOINTS) {
      const el = pinFor(waypoint.id);
      const local = DIRECTIONS.get(waypoint.id);
      if (!el || !local) continue;

      world.copy(local).applyMatrix4(node.matrixWorld);
      normal.copy(world).sub(center);
      toCamera.copy(camera.position).sub(world);
      const front = normal.dot(toCamera) > 0;

      world.project(camera);
      const x = (world.x * 0.5 + 0.5) * size.width;
      const y = (world.y * -0.5 + 0.5) * size.height;

      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.toggleAttribute("data-back", !front);
    }
  });

  return null;
}
