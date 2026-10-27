"use client";

import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { resetSphereTurn, turnSphereTo } from "@/lib/sphereTurn";

/**
 * Turns the globe a step as each `[data-sphere-step]` section reaches the middle
 * of the screen, the way the service deck does per card. Renders nothing; the
 * page also needs `data-sphere-turn` for the sphere to listen.
 */
export default function SphereSteps() {
  useGSAP(() => {
    const steps = document.querySelectorAll<HTMLElement>("[data-sphere-step]");
    steps.forEach((step, i) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) turnSphereTo(i);
        },
      }),
    );
    return () => resetSphereTurn();
  }, []);

  return null;
}
