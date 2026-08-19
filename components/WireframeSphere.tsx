"use client";

import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import type { Mesh } from "three";
import {
  BREAKPOINT_MD,
  SPHERE_COLOR,
  SPHERE_SEGMENTS,
  type Layout,
} from "@/lib/choreography";
import { useSphereScroll } from "@/lib/useSphereScroll";

export default function WireframeSphere() {
  const mesh = useRef<Mesh>(null);

  // Canvas size, not window — updates on resize without touching `window`.
  const width = useThree((state) => state.size.width);
  const layout: Layout = width >= BREAKPOINT_MD ? "desktop" : "mobile";
  const [widthSegments, heightSegments] = SPHERE_SEGMENTS[layout];

  // Falls back to dark before hydration, matching defaultTheme in layout.tsx.
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const color = SPHERE_COLOR[theme];

  // Transform is owned entirely by the hook; see useSphereScroll.
  useSphereScroll(mesh, theme);

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, widthSegments, heightSegments]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
