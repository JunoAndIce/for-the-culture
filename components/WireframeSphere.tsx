"use client";

import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useTheme } from "next-themes";
import { NoColorSpace } from "three";
import type { Group, MeshBasicMaterial } from "three";
import {
  BREAKPOINT_MD,
  SPHERE_COLOR,
  SPHERE_SEGMENTS,
  SPHERE_WIRE_OFFSET,
  maskUrlFor,
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
  const spin = useRef<Group>(null);
  const land = useRef<MeshBasicMaterial>(null);
  const wire = useRef<MeshBasicMaterial>(null);

  // Canvas size, not window — updates on resize without touching `window`.
  const width = useThree((state) => state.size.width);
  const layout: Layout = width >= BREAKPOINT_MD ? "desktop" : "mobile";
  const [widthSegments, heightSegments] = SPHERE_SEGMENTS[layout];

  // Falls back to dark before hydration, matching defaultTheme in layout.tsx.
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const color = SPHERE_COLOR[theme];

  // Land/ocean mask. Tagged NoColorSpace because it is data, not colour —
  // decoding it as sRGB would bend the mask values on the way in. Anisotropy
  // matters here: near the sphere's edge the texture is sampled at a hard
  // angle, which is exactly where coastlines would otherwise smear.
  //
  // Resolved once, at mount, rather than from the reactive canvas width above:
  // a URL that tracked the breakpoint would suspend and refetch the texture
  // every time someone dragged the window across it. Measured on
  // window.innerWidth to match the preload in Scene exactly.
  const gl = useThree((state) => state.gl);
  const [maskUrl] = useState(() =>
    maskUrlFor(typeof window === "undefined" ? BREAKPOINT_MD : window.innerWidth),
  );
  const mask = useTexture(maskUrl, (loaded) => {
    const texture = Array.isArray(loaded) ? loaded[0] : loaded;
    texture.colorSpace = NoColorSpace;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
  });

  useSphereScroll({ frame, spin, land, wire }, theme);
  useGlobeDrag(globe);

  const segments = [1, widthSegments, heightSegments] as const;

  return (
    <group ref={frame}>
      <group ref={globe}>
        {/*
         * Two meshes, not one: a material is either filled or wireframe, so
         * solid land with a lattice over it takes one of each. They share this
         * node, so the scroll spin and the user's drag move them as one globe.
         */}
        <group ref={spin}>
          <mesh>
            <sphereGeometry args={[...segments]} />
            {/*
             * The land. alphaMap decides where it draws — white in the mask is
             * land — while colour stays on the material, which is what lets the
             * globe keep inverting with the theme. A colour map could not: the
             * material's colour multiplies the texture, and multiplying only
             * darkens. alphaMap also multiplies with material.opacity, so the
             * per-panel fade useSphereScroll drives still composes on top.
             */}
            <meshBasicMaterial
              ref={land}
              color={color}
              alphaMap={mask}
              transparent
              depthWrite={false}
            />
          </mesh>

          {/* The outline, floated just outside the fill. No mask: the lattice
              is the whole sphere, which is what gives the globe its shape. */}
          <mesh scale={SPHERE_WIRE_OFFSET}>
            <sphereGeometry args={[...segments]} />
            <meshBasicMaterial
              ref={wire}
              color={color}
              wireframe
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
