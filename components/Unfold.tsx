"use client";

import { useUnfold } from "@/lib/useUnfold";

/** Mounts the scroll-driven copy builds. Renders nothing. */
export default function Unfold() {
  useUnfold();
  return null;
}
