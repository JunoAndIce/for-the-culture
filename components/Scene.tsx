"use client";

import { Canvas } from "@react-three/fiber";
import WireframeSphere from "./WireframeSphere";

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        // Phones often report DPR 3+; uncapped that means ~9x the pixels.
        dpr={[1, 2]}
        gl={{ powerPreference: "low-power" }}
      >
        <WireframeSphere />
      </Canvas>
    </div>
  );
}
