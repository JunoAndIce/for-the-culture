"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import WireframeSphere from "./WireframeSphere";
import { maskUrlFor } from "@/lib/choreography";

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
