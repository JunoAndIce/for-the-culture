"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import ProjectImage from "@/components/ProjectImage";
import { PROJECTS } from "@/lib/work";

export default function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef<{ x: number; scrollLeft: number; pointerId: number } | null>(
    null,
  );
  const dragged = useRef(false);
  const pendingScrollLeft = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => () => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
  }, []);

  const cardOffset = (trackRect: DOMRect, track: HTMLElement, card: HTMLElement) =>
    card.getBoundingClientRect().left - trackRect.left + track.scrollLeft;

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    dragOrigin.current = {
      x: e.clientX,
      scrollLeft: track.scrollLeft,
      pointerId: e.pointerId,
    };
    dragged.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    const origin = dragOrigin.current;
    if (!track || !origin) return;
    const dx = e.clientX - origin.x;
    if (!dragged.current && Math.abs(dx) > 4) {
      dragged.current = true;
      track.setPointerCapture(origin.pointerId);
    }
    if (!dragged.current) return;

    pendingScrollLeft.current = origin.scrollLeft - dx;
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        if (pendingScrollLeft.current !== null && trackRef.current) {
          trackRef.current.scrollLeft = pendingScrollLeft.current;
        }
      });
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    if (dragged.current) trackRef.current?.releasePointerCapture(e.pointerId);
    dragOrigin.current = null;
  };

  // A drag that lets go over a card's link should scroll, not navigate.
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragged.current) {
      e.preventDefault();
      dragged.current = false;
    }
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const elCenter = cardOffset(trackRect, track, el) + el.offsetWidth / 2;
      const distance = Math.abs(elCenter - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    });
    setActive(closest);
  };

  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      <div className="flex min-w-0 flex-col items-center justify-center">
        <div className="flex w-full min-w-0 flex-col items-start text-left md:max-w-5xl lg:max-w-6xl">
          <div className="flex w-full items-end gap-4">
            <div className="min-w-0">
              <p
                data-unfold
                className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs lg:text-sm dark:text-red-500"
              >
                Selected work
              </p>

              <h2
                data-unfold
                className="mt-3 text-[clamp(1.6rem,3.6vw,3.5rem)] leading-[1.08] font-bold tracking-tight text-balance"
              >
                <span>See the brands we&apos;ve elevated.</span>{" "}
              </h2>
            </div>

            <p
              data-unfold
              className="ml-auto shrink-0 pb-1 text-right font-mono text-[0.65rem] tracking-[0.15em] text-foreground/45 uppercase lg:text-xs"
            >
              Scroll &rarr;
            </p>
          </div>

          <div
            ref={trackRef}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
            onScroll={onScroll}
            role="region"
            aria-label="Selected work, scroll or drag to browse"
            className="mt-8 flex w-full min-w-0 touch-none cursor-grab gap-6 overflow-x-auto lg:gap-8 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          >
            {PROJECTS.map((project, i) => (
              <Link
                key={project.slug}
                data-unfold="slide"
                href={`/affiliations#${project.slug}`}
                draggable={false}
                className="group w-[85%] shrink-0 select-none sm:w-[75%] lg:w-2xl xl:w-184"
              >
                <ProjectImage project={project} index={i} />
                <h3 className="mt-4 text-base tracking-widest uppercase md:text-lg lg:text-xl">
                  {project.name}
                </h3>
                <p className="mt-1 text-xs text-red-700 md:text-sm lg:text-base dark:text-red-500">
                  {project.outcome}
                </p>
              </Link>
            ))}
          </div>

          <div
            data-unfold
            className="mt-6 flex w-full flex-wrap items-center justify-between gap-4 lg:mt-8"
          >
            <div className="flex gap-1.5 lg:gap-2" aria-hidden="true">
              {PROJECTS.map((project, i) => (
                <span
                  key={project.slug}
                  className={`size-1.5 rounded-full transition-colors lg:size-2 ${
                    i === active ? "bg-red-700 dark:bg-red-500" : "bg-foreground/25"
                  }`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80 lg:px-8 lg:py-4 lg:text-sm"
              >
                Start a project
              </a>
              <Link
                href="/affiliations"
                className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10 lg:px-8 lg:py-4 lg:text-sm"
              >
                See the full archive
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
