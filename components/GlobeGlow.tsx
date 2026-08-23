"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color } from "three";
import type { Points, ShaderMaterial } from "three";
import { GLOBE_GLOW } from "@/lib/choreography";

/**
 * The dust the globe hangs in: a ring of motes orbiting the sphere, tinted red
 * through gold to green across their bearing.
 *
 * Points rather than a painted halo. A gradient has to stop somewhere and that
 * somewhere is an edge; a scatter just thins out.
 */

/**
 * Seeded, so the scatter is the same on every reload. Tuning against a cloud
 * that reshuffles each refresh is guesswork, and a fixed layout can be judged.
 */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertexShader = /* glsl */ `
  attribute float aSize;
  uniform float uSize;
  uniform float uPixelRatio;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    // Flat pixel size rather than distance-attenuated: the dust only shows on
    // one panel, at one zoom, and constant motes read as dust while attenuated
    // ones read as depth-of-field.
    gl_PointSize = uSize * aSize * uPixelRatio;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;

  void main() {
    // Round the mote off. At this size a square is nearly invisible, but the
    // soft rim is what keeps it from crawling as the ring drifts.
    float mask = smoothstep(0.5, 0.15, length(gl_PointCoord - 0.5));
    if (mask <= 0.0) discard;

    gl_FragColor = vec4(vColor, 1.0);
    #include <colorspace_fragment>

    // The fade is folded into the colour, not the alpha. The canvas is
    // premultiplied, and three maps AdditiveBlending to blendFunc(ONE, ONE) in
    // that case, so alpha stops scaling the colour — anything left there would
    // draw at full strength however far the panel had faded it.
    gl_FragColor = vec4(gl_FragColor.rgb * mask * uOpacity, mask * uOpacity);
  }
`;

export default function GlobeGlow({
  materialRef,
}: {
  /** Owned by useSphereScroll, which fades uOpacity per panel. */
  materialRef: RefObject<ShaderMaterial | null>;
}) {
  const shell = useRef<Points>(null);

  // Built once: rebuilding the buffers on a re-render would reshuffle the dust
  // mid-scroll and hand three new attributes to upload every frame.
  const { positions, colors, sizes } = useMemo(() => {
    const {
      count, ring, spread, thickness, floor, contrast, angle, colors: stops,
    } = GLOBE_GLOW;
    const random = mulberry32(0x5eed);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Linear, because the shader encodes on the way out.
    const [a, b, c] = stops.map((hex) => new Color(hex));
    const bearing = [Math.cos(angle), Math.sin(angle)] as const;
    const mixed = new Color();

    // Box-Muller. Two independent normals per call, so the radius and the
    // depth do not share a value and streak the ring.
    const gaussian = () => {
      const u = Math.max(random(), 1e-9);
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
    };

    for (let i = 0; i < count; i++) {
      const bearingAngle = random() * Math.PI * 2;
      // Soft Gaussian edges rather than a flat band with two hard rims. The
      // floor is what keeps the tail out of the gap at the globe's edge.
      const radius = Math.max(floor, ring + gaussian() * spread);

      const x = Math.cos(bearingAngle) * radius;
      const y = Math.sin(bearingAngle) * radius;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = gaussian() * thickness;

      // The sweep completes across the ring's own width, so all three colours
      // land inside the visible band.
      const t = Math.min(
        1,
        Math.max(0, (x * bearing[0] + y * bearing[1]) / (2 * ring) + 0.5),
      );
      if (t < 0.5) mixed.copy(a).lerp(b, t * 2);
      else mixed.copy(b).lerp(c, (t - 0.5) * 2);

      // Weighted to the dim end. An even spread reads as static; a long tail of
      // faint motes with a few bright ones reads as dust.
      const brightness = Math.pow(random(), contrast);
      colors[i * 3] = mixed.r * brightness;
      colors[i * 3 + 1] = mixed.g * brightness;
      colors[i * 3 + 2] = mixed.b * brightness;

      sizes[i] = 0.6 + random() * 0.8;
    }

    return { positions, colors, sizes };
  }, []);

  const uniforms = useMemo(
    () => ({
      uSize: { value: GLOBE_GLOW.size },
      uPixelRatio: { value: 1 },
      // Starts dark; the scroll timeline writes the real value on its first
      // pass, and panel one asks for none.
      uOpacity: { value: 0 },
    }),
    [],
  );

  // gl_PointSize is in physical pixels, so without this the motes come out
  // half-size on a retina display. Read through useThree and written by prop
  // rather than assigned in the frame loop: it changes only when the window
  // moves between displays, and the frame loop must not write to a memoised
  // object it does not own.
  const pixelRatio = useThree((state) => state.viewport.dpr);

  useFrame((_, delta) => {
    const node = shell.current;
    if (!node) return;
    // Nothing to turn on the panels that never light it.
    if ((materialRef.current?.uniforms.uOpacity.value ?? 0) <= 0.001) return;
    // About Z, the view axis, so the ring turns in its own plane. About Y it
    // would swing edge-on and disappear twice a cycle.
    node.rotation.z += GLOBE_GLOW.drift * delta;
  });

  return (
    // The tilt lives on a parent so it is applied after the drift below it,
    // which keeps the ring turning within its own tipped plane rather than
    // wobbling as the two rotations fight.
    <group rotation={[GLOBE_GLOW.tilt, 0, 0]}>
      {/*
       * renderOrder, because nothing in this scene writes depth: with every
       * mesh transparent, draw order decides what sits on top, and three sorts
       * transparent objects by distance, which is a tie at a shared origin.
       */}
      <points ref={shell} renderOrder={-1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          uniforms-uPixelRatio-value={pixelRatio}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          // Turns on the `color` attribute and the `vColor` plumbing three
          // injects for it; without this the attribute is uploaded and ignored.
          vertexColors
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}
