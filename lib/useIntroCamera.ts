"use client";

import { useThree } from "@react-three/fiber";
import { useGSAP } from "@/lib/gsap";
import { BREAKPOINT_MD, CAMERA, INTRO, SPHERE_PATH } from "@/lib/choreography";
import { introTimeline, isIntroDone, registerIntroPart } from "@/lib/intro";

/**
 * Sole owner of the camera's position and roll. Opens pulled back and centred
 * on the planet, then dollies and trucks to CAMERA's rest view on the shared
 * intro timeline. The sphere's own nodes belong to useSphereScroll and are
 * never touched here, so the two can't fight.
 */
export function useIntroCamera() {
  // Read through get() inside the effect: the camera is mutated, not rendered from.
  const get = useThree((state) => state.get);

  useGSAP(
    () => {
      const { camera } = get();
      const [, , restZ] = CAMERA.position;
      const rest = () => {
        camera.position.set(...CAMERA.position);
        camera.rotation.z = 0;
      };

      // The intro can be over before the sphere has mounted, or skipped outright.
      if (isIntroDone()) {
        rest();
        return;
      }

      const layout = window.innerWidth >= BREAKPOINT_MD ? "desktop" : "mobile";
      const home = SPHERE_PATH[layout][0];
      const from = {
        x: home.x,
        y: home.y,
        z: INTRO.pullBack[layout],
        roll: (INTRO.rollDeg * Math.PI) / 180,
      };
      const cam = { ...from };
      const apply = () => {
        camera.position.set(cam.x, cam.y, cam.z);
        camera.rotation.z = cam.roll;
      };
      apply();

      const { pan, truckLag, rollShare } = INTRO;
      introTimeline()
        .fromTo(cam, { z: from.z }, { z: restZ, duration: pan, ease: "power3.inOut", onUpdate: apply }, 0)
        .fromTo(cam, { x: from.x, y: from.y }, { x: 0, y: 0, duration: pan - truckLag, ease: "power2.inOut", onUpdate: apply }, truckLag)
        .fromTo(cam, { roll: from.roll }, { roll: 0, duration: pan * rollShare, ease: "sine.out", onUpdate: apply }, 0);

      const unregister = registerIntroPart("camera");
      return () => {
        unregister();
        rest();
      };
    },
    { dependencies: [get] },
  );
}
