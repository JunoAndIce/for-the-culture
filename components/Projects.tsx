"use client";

import { useState } from "react";
import Link from "next/link";

import ProjectImage from "@/components/ProjectImage";
import { Badge } from "@/components/ui/badge";
import { PROJECTS } from "@/lib/work";

export default function Projects() {
  const [open, setOpen] = useState(0);
  const project = PROJECTS[open];

  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      {/* Column right, because the sphere and its ring sit far left on this
          pose (SPHERE_PATH desktop index 2), as on the Services panel. */}
      <div className="flex min-w-0 flex-col justify-center md:items-end">
        <div className="flex w-full min-w-0 flex-col items-start text-left md:mr-12 md:max-w-4xl">
          <p className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
            Selected work
          </p>

          <h2 className="mt-3 text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.08] font-bold tracking-tight text-balance">
            <span>Brick by brick, not launch by launch.</span>{" "}
            <span className="text-foreground/50">
              Three businesses that still run on what we built with them.
            </span>
          </h2>

          <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
            We build for the second year, not the first week. Every project here
            ended with the client able to run the thing themselves.
          </p>

          <div className="mt-7 grid w-full min-w-0 gap-6 border-t border-foreground/15 pt-7 md:grid-cols-2 md:gap-10">
            <ProjectImage project={project} index={open} />

            <div className="flex min-w-0 flex-col">
              <h3 className="text-lg tracking-widest uppercase md:text-2xl">
                {project.name}
              </h3>
              <p className="mt-1 font-mono text-[0.6rem] tracking-[0.16em] text-foreground/50 uppercase md:text-[0.65rem]">
                {project.discipline}
              </p>

              <p className="mt-3 font-gelasio text-sm leading-relaxed text-foreground/70 md:text-base">
                {project.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="border-foreground/25 tracking-widest text-foreground/70 uppercase"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Three facts, one of them the point — so only that one takes
                  the accent. mt-auto drops the row to the frame's baseline. */}
              <dl className="mt-5 grid grid-cols-3 gap-x-6 border-t border-foreground/15 pt-4 md:mt-auto">
                <div>
                  <dt className="font-mono text-[0.55rem] tracking-[0.18em] text-foreground/45 uppercase">
                    Year
                  </dt>
                  <dd className="mt-0.5 text-xs tabular-nums md:text-sm">
                    {project.year}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.55rem] tracking-[0.18em] text-foreground/45 uppercase">
                    Build
                  </dt>
                  <dd className="mt-0.5 text-xs tabular-nums md:text-sm">
                    {project.build}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.55rem] tracking-[0.18em] text-foreground/45 uppercase">
                    Outcome
                  </dt>
                  <dd className="mt-0.5 text-xs text-red-700 md:text-sm dark:text-red-500">
                    {project.outcome}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Every project stays on the surface, and a closed one still carries
              its outcome — the fact that would make someone open it. */}
          <ul className="mt-7 w-full border-t border-foreground/15">
            {PROJECTS.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-current={i === open}
                  className="grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-b border-foreground/15 py-3 text-left transition-colors hover:border-foreground/40 aria-current:border-red-700 md:grid-cols-[auto_11rem_1fr_auto] md:gap-x-6 dark:aria-current:border-red-500"
                >
                  <span
                    className={`font-mono text-[0.6rem] tracking-[0.16em] tabular-nums ${
                      i === open
                        ? "text-red-700 dark:text-red-500"
                        : "text-foreground/40"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[0.7rem] tracking-widest uppercase md:text-xs ${
                      i === open ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className="col-span-2 col-start-2 font-mono text-[0.58rem] tracking-widest text-foreground/45 uppercase md:col-span-1 md:col-start-3">
                    {p.outcome}
                  </span>
                  <span
                    className={`col-start-3 row-start-1 font-mono text-[0.55rem] tracking-[0.16em] uppercase md:col-start-4 ${
                      i === open
                        ? "text-red-700 dark:text-red-500"
                        : "text-foreground/40"
                    }`}
                  >
                    {i === open ? "Open" : "View"}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* The ask, carried here rather than saved for the last panel. */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80"
            >
              Start a project
            </a>
            <Link
              href="/affiliations"
              className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
            >
              See the full archive
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
