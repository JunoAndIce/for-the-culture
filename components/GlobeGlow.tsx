"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color } from "three";
import type { Group, Points, ShaderMaterial } from "three";
import { GLOBE_GLOW } from "@/lib/choreography";

/** Seeded, so the scatter is identical every reload and can be tuned against. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// `position` carries per-mote randomness, not a location: bearing, radial offset
// and depth offset. The shape comes from uniforms so a panel can retune and tween
// it. It has to live on `position` because three takes the draw count from there.
const vertexShader = /* glsl */ `
  attribute float aBright;
  attribute float aSize;

  uniform float uRing;
  uniform float uSpread;
  uniform float uFloor;
  uniform float uThickness;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAngle;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vColor;

  void main() {
    float bearing = position.x;
    float radius = max(uFloor, uRing + position.y * uSpread);
    vec3 local = vec3(
      cos(bearing) * radius,
      sin(bearing) * radius,
      position.z * uThickness
    );

    // Sweep completes across the ring's width, so all three colours land in view.
    float t = clamp(
      dot(local.xy, vec2(cos(uAngle), sin(uAngle))) / (2.0 * uRing) + 0.5, 0.0, 1.0
    );
    vColor = aBright * (t < 0.5
      ? mix(uColorA, uColorB, t * 2.0)
      : mix(uColorB, uColorC, (t - 0.5) * 2.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(local, 1.0);
    // Flat, not distance-attenuated: constant motes read as dust, attenuated as
    // depth of field. uPixelRatio because gl_PointSize is in physical pixels.
    gl_PointSize = uSize * aSize * uPixelRatio;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;

  void main() {
    float mask = smoothstep(0.5, 0.15, length(gl_PointCoord - 0.5));
    if (mask <= 0.0) discard;

    gl_FragColor = vec4(vColor, 1.0);
    #include <colorspace_fragment>

    // Fade folded into rgb: the canvas is premultiplied, so AdditiveBlending is
    // blendFunc(ONE, ONE) and alpha stops scaling the colour.
    float alpha = mask * uOpacity;
    gl_FragColor = vec4(gl_FragColor.rgb * alpha, alpha);
  }
`;

export default function GlobeGlow({
  materialRef,
  tiltRef,
}: {
  /** useSphereScroll owns the uniforms: fade, radius, spread, floor, depth, size. */
  materialRef: RefObject<ShaderMaterial | null>;
  /** useSphereScroll owns rotation.x on this node — the ring's lean. */
  tiltRef: RefObject<Group | null>;
}) {
  const spin = useRef<Points>(null);

  const { seeds, bright, sizes } = useMemo(() => {
    const { count, contrast } = GLOBE_GLOW;
    const random = mulberry32(0x5eed);
    const seeds = new Float32Array(count * 3);
    const bright = new Float32Array(count);
    const sizes = new Float32Array(count);

    // Box-Muller, two draws a call so radius and depth never share a value.
    const gaussian = () => {
      const u = Math.max(random(), 1e-9);
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
    };

    for (let i = 0; i < count; i++) {
      seeds[i * 3] = random() * Math.PI * 2;
      seeds[i * 3 + 1] = gaussian();
      seeds[i * 3 + 2] = gaussian();
      // Weighted to the dim end, or the cloud reads as uniform static.
      bright[i] = Math.pow(random(), contrast);
      sizes[i] = 0.6 + random() * 0.8;
    }

    return { seeds, bright, sizes };
  }, []);

  const uniforms = useMemo(() => {
    const [a, b, c] = GLOBE_GLOW.colors.map((hex) => new Color(hex));
    return {
      uRing: { value: GLOBE_GLOW.ring },
      uSpread: { value: GLOBE_GLOW.spread },
      uFloor: { value: GLOBE_GLOW.floor },
      uThickness: { value: GLOBE_GLOW.thickness },
      uSize: { value: GLOBE_GLOW.size },
      uAngle: { value: GLOBE_GLOW.angle },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uColorA: { value: a },
      uColorB: { value: b },
      uColorC: { value: c },
    };
  }, []);

  const pixelRatio = useThree((state) => state.viewport.dpr);

  useFrame((_, delta) => {
    const node = spin.current;
    if (!node) return;
    if ((materialRef.current?.uniforms.uOpacity.value ?? 0) <= 0.001) return;
    // About Z, the ring's own normal, so it turns within its plane.
    node.rotation.z += GLOBE_GLOW.drift * delta;
  });

  return (
    <group ref={tiltRef}>
      {/* renderOrder 1 puts the ring after the globe's transparent layers, so the
          near half draws over it; the far half is cut by the depth proxy instead.
          frustumCulled off because `position` holds seeds, not real bounds. */}
      <points ref={spin} renderOrder={1} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[seeds, 3]} />
          <bufferAttribute attach="attributes-aBright" args={[bright, 1]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          uniforms-uPixelRatio-value={pixelRatio}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}
