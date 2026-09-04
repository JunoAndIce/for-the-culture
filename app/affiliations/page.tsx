import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Navbar from "@/components/Navbar";
import ProjectImage from "@/components/ProjectImage";
import Scene from "@/components/Scene";
import { Badge } from "@/components/ui/badge";
import { AFFILIATIONS, PROJECTS, TESTIMONIALS } from "@/lib/work";

export const metadata: Metadata = {
  title: "Affiliations — For the Culture",
  description:
    "The work in full and the people who lived through it: three builds start to finish, five founders on the record, and the partners we run with.",
};

/**
 * The long version of the Projects and Testimonials panels. Like /overview, it
 * marks no [data-panel] sections, so the sphere holds its opening pose behind
 * the scrim rather than being scrolled through.
 */
export default function AffiliationsPage() {
  return (
    <div className="relative bg-background">
      <Scene />
      {/* The sphere is texture here, not the subject: this page is for reading. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-background/85"
      />
      <Navbar />

      <main className="relative z-10 px-8 pt-32 pb-20 md:px-16 md:pt-40 md:pb-28 xl:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
            Who we build with
          </p>

          <h1 className="mt-3 text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.06] font-bold tracking-tight text-balance">
            <span>Three builds, five founders, one bench.</span>{" "}
            <span className="text-foreground/50">
              The work in full, and the people who lived through it.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
            Every name here will take your call. We make the introduction
            ourselves, and we do not tell them what to say first.
          </p>

          <ImagePlaceholder
            label="The partners, on site"
            ratio="aspect-[16/10] md:aspect-[21/9]"
            className="mt-8"
          />

          {/* The work, start to finish. */}
          <h2
            id="work"
            className="mt-16 scroll-mt-28 border-t border-foreground/15 pt-6 font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase md:scroll-mt-36"
          >
            The work
          </h2>

          {PROJECTS.map((project, i) => (
            <section
              key={project.slug}
              id={project.slug}
              className="mt-10 scroll-mt-28 md:scroll-mt-36"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-red-700 dark:text-red-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg tracking-widest uppercase md:text-2xl">
                  {project.name}
                </h3>
              </div>

              <p className="mt-1 font-mono text-[0.6rem] tracking-[0.16em] text-foreground/50 uppercase md:text-[0.65rem]">
                {project.discipline}
              </p>

              <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-10">
                <ProjectImage project={project} index={i} />

                <div className="flex min-w-0 flex-col">
                  <p className="font-gelasio text-sm leading-relaxed text-foreground/70 md:text-base">
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

              {/* The part the panel has no room for. */}
              <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
                {project.detail}
              </p>
            </section>
          ))}

          {/* Every voice, not just the featured one. */}
          <h2
            id="voices"
            className="mt-16 scroll-mt-28 border-t border-foreground/15 pt-6 font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase md:scroll-mt-36"
          >
            The voices
          </h2>

          <ul className="mt-6">
            {TESTIMONIALS.map(({ quote, name, role, since }) => (
              <li
                key={name}
                className="border-b border-foreground/15 py-6 first:border-t first:border-foreground/15"
              >
                <blockquote>
                  <p className="font-gelasio text-[clamp(1rem,1.7vw,1.35rem)] leading-[1.4] tracking-tight italic text-pretty">
                    <span className="text-red-700 dark:text-red-500">
                      &ldquo;
                    </span>
                    {quote}
                    <span className="text-red-700 dark:text-red-500">
                      &rdquo;
                    </span>
                  </p>

                  <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-[0.7rem] tracking-widest text-foreground uppercase">
                      {name}
                    </p>
                    <p className="text-xs font-light text-foreground/50">
                      {role}
                    </p>
                  </div>

                  <p className="mt-3 inline-flex flex-wrap items-baseline gap-x-3 font-mono text-[0.65rem] tracking-[0.1em] text-foreground/60">
                    <span className="tracking-[0.18em] text-red-700 uppercase dark:text-red-500">
                      Since
                    </span>
                    {since}
                  </p>
                </blockquote>
              </li>
            ))}
          </ul>

          {/* The ticker, standing still. A page can hold what a panel cannot. */}
          <h2
            id="partners"
            className="mt-16 scroll-mt-28 border-t border-foreground/15 pt-6 font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase md:scroll-mt-36"
          >
            The partners
          </h2>

          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {AFFILIATIONS.map((name) => (
              <li key={name}>
                <ImagePlaceholder label={name} ratio="aspect-[3/1]" />
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-foreground/15 pt-8">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80"
              >
                Ask them yourself
              </a>
              <Link
                href="/"
                className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
              >
                Back to the work
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
