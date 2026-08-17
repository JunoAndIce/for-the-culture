"use client";

import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import type { Mesh } from "three";
import { BREAKPOINT_MD, SPHERE_SEGMENTS, type Layout } from "@/lib/choreography";
import { useSphereScroll } from "@/lib/useSphereScroll";

export default function WireframeSphere() {
  const mesh = useRef<Mesh>(null);

  // Canvas size, not window — updates on resize without touching `window`.
  const width = useThree((state) => state.size.width);
  const layout: Layout = width >= BREAKPOINT_MD ? "desktop" : "mobile";
  const [widthSegments, heightSegments] = SPHERE_SEGMENTS[layout];

  // Transform is owned entirely by the hook; see useSphereScroll.
  useSphereScroll(mesh);

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, widthSegments, heightSegments]} />
      <meshBasicMaterial
        color="white"
        wireframe
        transparent
        opacity={0.1}
        depthWrite={false}
      />
    </mesh>
  );
}
