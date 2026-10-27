"use client";

import { useEffect, useRef, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import type {
  Group,
  MeshBasicMaterial,
  ShaderMaterial,
  WebGLProgramParametersWithUniforms,
} from "three";
import {
  BREAKPOINT_MD,
  SPHERE_COLOR,
  SPHERE_SEGMENTS,
  SPHERE_WIRE_OFFSET,
  maskUrlFor,
  type Layout,
} from "@/lib/choreography";
import GlobeGlow from "./GlobeGlow";
import Waypoints from "./Waypoints";
import { markSphereReady } from "@/lib/intro";
import { MaskLoader } from "@/lib/maskLoader";
import { useGlobeDrag } from "@/lib/useGlobeDrag";
import { useSphereScroll } from "@/lib/useSphereScroll";

// The mask is one channel, so alpha comes from .r; a greyscale image fallback has r = g.
const alphaFromRed = (shader: WebGLProgramParametersWithUniforms) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <alphamap_fragment>",
    "#ifdef USE_ALPHAMAP\n\tdiffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).r;\n#endif",
  );
};
const alphaFromRedKey = () => "alphamap-r";

export default function WireframeSphere() {
  // Three nested nodes, one writer each. Outside in: where the sphere sits,
  // how the user has turned it, and how far the scroll has spun it. The order
  // is load-bearing — see useSphereScroll.
  const frame = useRef<Group>(null);
  const globe = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const land = useRef<MeshBasicMaterial>(null);
  const wire = useRef<MeshBasicMaterial>(null);
  const glow = useRef<ShaderMaterial>(null);
  const glowTilt = useRef<Group>(null);

  // Canvas size, not window — updates on resize without touching `window`.
  const width = useThree((state) => state.size.width);
  const layout: Layout = width >= BREAKPOINT_MD ? "desktop" : "mobile";
  const [widthSegments, heightSegments] = SPHERE_SEGMENTS[layout];

  // Falls back to dark before hydration, matching defaultTheme in layout.tsx.
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const color = SPHERE_COLOR[theme];

  // Land/ocean mask, one byte per pixel (MaskLoader). Anisotropy matters here:
  // near the sphere's edge the texture is sampled at a hard angle, which is
  // exactly where coastlines would otherwise smear.
  //
  // Resolved once, at mount, rather than from the reactive canvas width above:
  // a URL that tracked the breakpoint would suspend and refetch the texture
  // every time someone dragged the window across it. Measured on
  // window.innerWidth to match the preload in Scene exactly.
  const gl = useThree((state) => state.gl);
  const [maskUrl] = useState(() =>
    maskUrlFor(
      typeof window === "undefined" ? BREAKPOINT_MD : window.innerWidth,
      gl.capabilities.maxTextureSize,
    ),
  );
  const mask = useLoader(MaskLoader, maskUrl);

  useSphereScroll({ frame, spin, land, wire, glow, glowTilt });
  useGlobeDrag(globe);
  // Past the useTexture suspend, so the mask is in: the loader can lift.
  useEffect(markSphereReady, []);

  const segments = [1, widthSegments, heightSegments] as const;

  return (
    <group ref={frame}>
      {/* Depth-only stand-in for the planet: writes depth, paints nothing, so the
          ring's far half is cut by the globe's silhouette. 0.99 keeps it behind
          the land (1) and the wire (SPHERE_WIRE_OFFSET), which are FrontSide. */}
      <mesh renderOrder={-10}>
        <sphereGeometry args={[0.99, 32, 16]} />
        <meshBasicMaterial colorWrite={false} />
      </mesh>

      {/* Inside frame so it travels and scales with the globe, but above the drag
          and spin nodes, so the baked colour sweep never turns with it. */}
      <GlobeGlow materialRef={glow} tiltRef={glowTilt} />

      <Waypoints spin={spin} />

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
              alphaMap-anisotropy={gl.capabilities.getMaxAnisotropy()}
              onBeforeCompile={alphaFromRed}
              customProgramCacheKey={alphaFromRedKey}
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
