"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import WireframeSphere from "./WireframeSphere";
import { maskUrlFor } from "@/lib/choreography";

// Starts the mask fetch as soon as this module evaluates, rather than waiting
// for the sphere to mount and suspend. The sphere is the first thing on the
// page, so the gap between the two is the gap where there is no globe.
//
// Browser only, and not merely as an optimisation: TextureLoader reaches for
// document.createElementNS, so on the server it throws. R3F runs loaders inside
// a promise executor and caches the result through suspend-react, which turns
// that throw into a cached rejected promise rather than a visible crash — the
// build passes and the failure hides. Never call it where document is absent.
//
// Must resolve the URL exactly as WireframeSphere does, hence the shared
// helper: preloading one mask while the sphere asks for another would fetch
// both and wait on the slower one.
if (typeof document !== "undefined") {
  useTexture.preload(maskUrlFor(window.innerWidth));
}

export default function Scene() {
  return (
    // Fixed and behind every panel: the sections scroll over a canvas that
    // never moves, which is what lets one sphere serve all five screens.
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 16 }}
        // Phones often report DPR 3+; uncapped that means ~9x the pixels.
        dpr={[1, 2]}
        gl={{ powerPreference: "low-power" }}
      >
        {/* The sphere suspends while the mask loads; nothing else to show. */}
        <Suspense fallback={null}>
          <WireframeSphere />
        </Suspense>
      </Canvas>
    </div>
  );
}
