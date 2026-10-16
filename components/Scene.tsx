"use client";

import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import WireframeSphere from "./WireframeSphere";
import { CAMERA, maskUrlFor } from "@/lib/choreography";
import { MaskLoader } from "@/lib/maskLoader";

// No GPU to ask yet, so a device that can't take 8k loads 4k again at mount. Rare.
if (typeof document !== "undefined") {
  useLoader.preload(MaskLoader, maskUrlFor(window.innerWidth));
}

export default function Scene() {
  return (
    // Fixed and behind every panel: the sections scroll over a canvas that
    // never moves, which is what lets one sphere serve all five screens.
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: CAMERA.position, fov: CAMERA.fov }}
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
