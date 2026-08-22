"use client";

import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import {
  BREAKPOINT_MD,
  SPHERE_COLOR,
  SPHERE_SEGMENTS,
  type Layout,
} from "@/lib/choreography";
import { useGlobeDrag } from "@/lib/useGlobeDrag";
import { useSphereScroll } from "@/lib/useSphereScroll";

export default function WireframeSphere() {
  // Three nested nodes, one writer each. Outside in: where the sphere sits,
  // how the user has turned it, and how far the scroll has spun it. The order
  // is load-bearing — see useSphereScroll.
  const frame = useRef<Group>(null);
  const globe = useRef<Group>(null);
  const spin = useRef<Mesh>(null);
  const material = useRef<MeshBasicMaterial>(null);

  // Canvas size, not window — updates on resize without touching `window`.
  const width = useThree((state) => state.size.width);
  const layout: Layout = width >= BREAKPOINT_MD ? "desktop" : "mobile";
  const [widthSegments, heightSegments] = SPHERE_SEGMENTS[layout];

  // Falls back to dark before hydration, matching defaultTheme in layout.tsx.
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const color = SPHERE_COLOR[theme];

  useSphereScroll({ frame, spin, material }, theme);
  useGlobeDrag(globe);

  return (
    <group ref={frame}>
      <group ref={globe}>
        <mesh ref={spin}>
          <sphereGeometry args={[1, widthSegments, heightSegments]} />
          <meshBasicMaterial
            ref={material}
            color={color}
            wireframe
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
