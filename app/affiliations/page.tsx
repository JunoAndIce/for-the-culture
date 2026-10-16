import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Navbar from "@/components/Navbar";
import ProjectImage from "@/components/ProjectImage";
import Scene from "@/components/Scene";
import { Badge } from "@/components/ui/badge";
import { AFFILIATIONS, PROJECTS, TESTIMONIALS, type Project } from "@/lib/work";

export const metadata: Metadata = {
  title: "Affiliations — For the Culture",
  description:
    "The work in full and the people who lived through it: three builds start to finish, five founders on the record, and the partners we run with.",
};

const SECTION_LABEL =
  "border-t border-foreground/15 pt-4.5 font-mono text-[0.625rem] tracking-[0.28em] text-foreground/40 uppercase md:pt-5";

/** The checkable line under a voice: the label is the promise. */
function Since({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-[0.625rem] tracking-[0.06em] text-foreground/50 md:text-[0.65625rem] ${className}`}
    >
      <span className="mr-2 font-medium tracking-[0.18em] text-red-700 uppercase md:mr-2.5 dark:text-red-500">
        Since
      </span>
      {children}
    </p>
  );
}

/**
 * One project's words, folded away. The row under the image is the whole
 * control (name, what we did, the outcome, and a +); everything else waits
 * inside until someone asks. A native <details>, so it needs no script.
 */
function ProjectDetails({
  project,
  index,
  hero = false,
}: {
  project: Project;
  index: number;
  hero?: boolean;
}) {
  return (
    <details className="group/story">
      <summary className="group/summary cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-end justify-between gap-4 pt-3.5 md:gap-6 md:pt-4.5">
          <span>
            <span
              className={`flex items-baseline gap-2.5 ${hero ? "md:gap-3.5" : "md:gap-3"}`}
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-red-700 md:text-xs dark:text-red-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-lg tracking-widest uppercase ${hero ? "md:text-[1.625rem]" : "md:text-xl"}`}
              >
                {project.name}
              </span>
            </span>
            <span className="mt-1.5 block font-mono text-[0.625rem] tracking-[0.14em] text-foreground/50 uppercase md:text-[0.6875rem] md:tracking-[0.16em]">
              {project.discipline}
            </span>
            <span className="mt-1.5 block text-[0.8125rem] text-red-700 md:hidden dark:text-red-500">
              {project.outcome}
            </span>
          </span>

          <span className="flex items-center gap-3.5 md:gap-4.5">
            <span
              className={`hidden text-red-700 md:inline dark:text-red-500 ${hero ? "text-base" : "text-sm"}`}
            >
              {project.outcome}
            </span>
            <span className="grid size-11 place-items-center rounded-full border border-foreground/30 transition-[transform,background-color,border-color] duration-200 group-hover/summary:border-foreground group-open/story:rotate-45 group-open/story:bg-foreground/10 motion-reduce:transition-none md:size-7.5">
              <Plus aria-hidden="true" strokeWidth={1.4} className="size-3" />
            </span>
          </span>
        </span>
      </summary>

      <div
        className={`mt-3.5 grid gap-4.5 border-t border-foreground/15 pt-5.5 pb-1 md:mt-4.5 md:gap-5.5 md:pt-6.5 ${hero ? "md:grid-cols-[1.1fr_1fr] md:gap-14" : ""}`}
      >
        <p className="font-gelasio text-base leading-[1.6] text-foreground/80 md:text-lg">
          {project.summary}
        </p>

        <div className="flex flex-col gap-4.5 md:gap-5.5">
          <p className="font-mono text-xs leading-[1.7] text-foreground/60 md:text-[0.78125rem]">
            {project.detail}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.badges.map((badge) => (
              <Badge
                key={badge}
                variant="outline"
                className="h-auto border-foreground/25 px-2.5 py-1 text-[0.625rem] tracking-[0.15em] text-foreground/70 uppercase"
              >
                {badge}
              </Badge>
            ))}
          </div>

          <dl className="flex gap-9 md:gap-10">
            <div>
              <dt className="font-mono text-[0.5625rem] tracking-[0.18em] text-foreground/45 uppercase">
                Year
              </dt>
              <dd className="mt-0.5 text-[0.9375rem] tabular-nums">
                {project.year}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.5625rem] tracking-[0.18em] text-foreground/45 uppercase">
                Build
              </dt>
              <dd className="mt-0.5 text-[0.9375rem] tabular-nums">
                {project.build}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </details>
  );
}

/**
 * The long version of the Projects and Testimonials panels. Like /overview, it
 * marks no [data-panel] sections, so the sphere holds its opening pose behind
 * the scrim rather than being scrolled through.
 *
 * Images first: the work fills the first screen, its words fold away behind a
 * +, and the partners and the quotes come after it.
 */
export default function AffiliationsPage() {
  const [hero, ...rest] = PROJECTS;
  const [featured, ...voices] = TESTIMONIALS;

  return (
    <div className="relative bg-background">
      <Scene />
      {/* The sphere is texture here, not the subject: this page is for the work. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-background/85"
      />
      <Navbar />

      <main className="relative z-10 px-5 pt-24 pb-20 md:px-16 md:pt-28 md:pb-28 xl:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3.5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
                Selected work
              </p>
              <h1 className="mt-2.5 text-4xl leading-[1.05] font-bold tracking-tight md:mt-3 md:text-[3.5rem] md:leading-[1.04]">
                Built with them.
              </h1>
            </div>

            <nav
              aria-label="On this page"
              className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] text-foreground/35 uppercase md:gap-3 md:pb-2 md:text-[0.6875rem]"
            >
              <a
                href="#work"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Work
              </a>
              <span aria-hidden="true">&bull;</span>
              <a
                href="#partners"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Partners
              </a>
              <span aria-hidden="true">&bull;</span>
              <a
                href="#voices"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                Voices
              </a>
            </nav>
          </div>

          {/* The work. The first project is the hero; the rest sit two-up. Each
              keeps its slug as an id, which is what the Projects panel links to. */}
          <div id="work" className="mt-5.5 scroll-mt-24 md:mt-7 md:scroll-mt-28">
            <section id={hero.slug} className="scroll-mt-24 md:scroll-mt-28">
              <div className="group">
                <ProjectImage
                  project={hero}
                  index={0}
                  variant="wide"
                  className="hidden md:block"
                />
                <ProjectImage
                  project={hero}
                  index={0}
                  variant="card"
                  className="md:hidden"
                />
              </div>
              <ProjectDetails project={hero} index={0} hero />
            </section>

            <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 md:items-start md:gap-8">
              {rest.map((project, i) => (
                <section
                  key={project.slug}
                  id={project.slug}
                  className="scroll-mt-24 md:scroll-mt-28"
                >
                  <div className="group">
                    <ProjectImage
                      project={project}
                      index={i + 1}
                      variant="card"
                    />
                  </div>
                  <ProjectDetails project={project} index={i + 1} />
                </section>
              ))}
            </div>
          </div>

          <section
            id="partners"
            className="mt-16 scroll-mt-24 md:mt-24 md:scroll-mt-28"
          >
            <h2 className={SECTION_LABEL}>Partners</h2>

            <ul className="mt-5 grid grid-cols-3 gap-2.5 md:mt-6 md:grid-cols-6 md:gap-6">
              {AFFILIATIONS.map((name) => (
                <li key={name}>
                  <ImagePlaceholder
                    label={name}
                    ratio="aspect-[5/2] md:aspect-[3/1]"
                    compact
                  />
                </li>
              ))}
            </ul>
          </section>

          <section
            id="voices"
            className="mt-16 scroll-mt-24 md:mt-24 md:scroll-mt-28"
          >
            <h2 className={SECTION_LABEL}>Voices</h2>

            <blockquote className="mt-6 md:mt-8 md:max-w-250">
              <p className="font-gelasio text-2xl leading-[1.3] tracking-tight italic text-pretty md:text-[2.125rem]">
                <span className="text-red-700 dark:text-red-500">&ldquo;</span>
                {featured.quote}
                <span className="text-red-700 dark:text-red-500">&rdquo;</span>
              </p>

              <div className="mt-4 flex flex-col gap-0.5 md:mt-5 md:flex-row md:flex-wrap md:items-baseline md:gap-x-3.5 md:gap-y-1.5">
                <p className="text-xs tracking-widest text-foreground uppercase">
                  {featured.name}
                </p>
                <p className="text-[0.8125rem] font-light text-foreground/50 md:text-sm">
                  {featured.role}
                </p>
                <Since className="mt-1.5 md:mt-0">{featured.since}</Since>
              </div>
            </blockquote>

            <ul className="mt-9 grid gap-7 md:mt-14 md:grid-cols-2 md:gap-x-14 md:gap-y-10">
              {voices.map(({ quote, name, role, since }) => (
                <li key={name}>
                  <blockquote className="border-t border-foreground/15 pt-4.5 md:pt-5">
                    <p className="font-gelasio text-[1.0625rem] leading-normal italic text-foreground/85 md:text-lg">
                      &ldquo;{quote}&rdquo;
                    </p>
                    <p className="mt-3 font-mono text-[0.65625rem] tracking-[0.16em] uppercase md:mt-3.5 md:text-[0.6875rem]">
                      {name}{" "}
                      <span className="text-foreground/45">
                        &middot; {role}
                      </span>
                    </p>
                    <Since className="mt-2">{since}</Since>
                  </blockquote>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-14 grid gap-3 border-t border-foreground/15 pt-7 md:mt-20 md:flex md:flex-wrap md:items-center md:gap-4 md:pt-8">
            <a
              href="#"
              className="rounded-lg bg-foreground px-6 py-4 text-center text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80 md:py-3 lg:px-8 lg:py-4 lg:text-sm"
            >
              Ask them yourself
            </a>
            <Link
              href="/"
              className="rounded-lg border border-foreground/40 px-6 py-4 text-center text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10 md:py-3 lg:px-8 lg:py-4 lg:text-sm"
            >
              Back to the work
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
