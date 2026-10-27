"use client";

import { Suspense, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useLoader } from "@react-three/fiber";
import WireframeSphere from "./WireframeSphere";
import { CAMERA, SCENE_ROUTES, maskUrlFor } from "@/lib/choreography";
import { MaskLoader } from "@/lib/maskLoader";
import { setSceneRoute } from "@/lib/sceneRoute";

// No GPU to ask yet, so a device that can't take 8k loads 4k again at mount. Rare.
if (typeof document !== "undefined") {
  useLoader.preload(MaskLoader, maskUrlFor(window.innerWidth));
}

// Mounted once, in the layout: a page change re-poses the sphere rather than
// building a new WebGL context and uploading the mask again.
export default function Scene() {
  const pathname = usePathname();
  // A layout effect, so the sphere takes the new page's pose before that page paints.
  useLayoutEffect(() => setSceneRoute(pathname), [pathname]);

  if (!SCENE_ROUTES.includes(pathname)) return null;

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
