"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/** Degrees the frame leans toward the cursor at its edge. */
const TILT = 5;

/**
 * A piece of work, held like an object: it leans toward a mouse cursor in 3D.
 * Touch and reduced motion get a still frame. The `group` class lets the media
 * inside run its own hover zoom.
 */
export default function WorkFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    // Read once rather than through gsap.matchMedia, whose query listeners never detach.
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pointer || still) return;

    gsap.set(el, { transformPerspective: 1100 });
    const tiltX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const tiltY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tiltY(((e.clientX - r.left) / r.width - 0.5) * TILT * 2);
      tiltX(-((e.clientY - r.top) / r.height - 0.5) * TILT * 2);
    };
    const onLeave = () => {
      tiltX(0);
      tiltY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div ref={frame} className={`group ${className}`}>
      {children}
    </div>
  );
}
