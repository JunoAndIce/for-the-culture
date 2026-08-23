"use client";

import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registered once for the whole app. Import gsap from here, not from "gsap",
// so plugins are guaranteed registered before any animation is built.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin);

export { gsap, ScrambleTextPlugin, ScrollTrigger, useGSAP };
