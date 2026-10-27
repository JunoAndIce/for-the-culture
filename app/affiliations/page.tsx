import type { Metadata } from "next";
import Link from "next/link";

import BrandTree from "@/components/BrandTree";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Navbar from "@/components/Navbar";
import ProjectImage from "@/components/ProjectImage";
import SphereSteps from "@/components/SphereSteps";
import WorkFrame from "@/components/WorkFrame";
import { Badge } from "@/components/ui/badge";
import { BACKED, PROJECTS } from "@/lib/work";

export const metadata: Metadata = {
  title: "Affiliations — For the Culture",
  description:
    "What we've built and what we back: Kyro & Bros., launched by For the Culture, and HWY6 Studios, the Houston collective we fund, with SHERUNSHOUSTON and 6athletics.",
};

const LABEL =
  "font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500";
const SMALL_LABEL = "font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase";
const PRIMARY =
  "rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80";
const SECONDARY =
  "rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10";

/** "a, b and c", for the line about HWY6's older groups. */
const listed = (items: readonly string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items.join("");

/**
 * The work, shown big: the one brand FTC launched, then the collective it funds
 * and the two brands that came of it. No [data-panel] sections, so the sphere
 * sits behind the scrim; each `data-sphere-step` turns it a step instead.
 */
export default function AffiliationsPage() {
  const kyro = PROJECTS.find(({ slug }) => slug === "kyro-bros");
  if (!kyro) throw new Error("Kyro & Bros. is missing from PROJECTS");

  return (
    <div className="relative">
      {/* The sphere is texture here, not the subject: this page is for the work. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-background/85" />
      <Navbar />
      <SphereSteps />

      <main
        data-sphere-turn
        className="relative z-10 px-5 pt-28 pb-20 md:px-16 md:pt-36 md:pb-28 xl:px-24"
      >
        <div className="mx-auto max-w-6xl">
          <header className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className={LABEL}>What we&apos;ve built</p>
              <h1 className="mt-3 text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.06] font-bold tracking-tight text-balance">
                <span>See it for yourself.</span>{" "}
                <span className="text-foreground/50">
                  One brand we launched from scratch, and a Houston collective we
                  back, with the two brands it started on our funding.
                </span>
              </h1>
            </div>
            <p className="max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm lg:pb-2">
              We design and build 3D websites, motion, apps for brands, search,
              marketing and graphic design. Everything here is out in the world,
              so look closely.
            </p>
          </header>

          <section
            id={kyro.slug}
            data-sphere-step
            className="mt-14 scroll-mt-28 border-t border-foreground/15 pt-5 md:mt-20 md:scroll-mt-32"
          >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <p className={LABEL}>Launched by FTC</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{kyro.name}</h2>
                <p className="mt-2 font-mono text-[0.65rem] tracking-[0.16em] text-foreground/55 uppercase md:text-xs">
                  {kyro.discipline}
                </p>
              </div>
              <p className="text-lg text-red-700 md:text-2xl dark:text-red-500">{kyro.outcome}</p>
            </div>

            <WorkFrame className="mt-6 md:mt-8">
              <ProjectImage project={kyro} index={0} variant="wide" className="hidden md:block" />
              <ProjectImage project={kyro} index={0} variant="card" className="md:hidden" />
            </WorkFrame>

            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1.2fr_1fr] md:gap-14">
              <div>
                <p className="text-[clamp(1.1rem,2vw,1.5rem)] leading-[1.35] font-medium text-balance">
                  {kyro.summary}
                </p>
                <p className="mt-4 font-mono text-xs leading-relaxed text-foreground/65 md:text-[0.8rem]">
                  {kyro.detail}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <p className={SMALL_LABEL}>What we built</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {kyro.badges.map((badge) => (
                      <li key={badge}>
                        <Badge
                          variant="outline"
                          className="h-auto border-foreground/25 px-2.5 py-1 text-[0.625rem] tracking-[0.15em] text-foreground/75 uppercase"
                        >
                          {badge}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                <dl className="flex gap-10">
                  <div>
                    <dt className={SMALL_LABEL}>Year</dt>
                    <dd className="mt-1 tabular-nums">{kyro.year}</dd>
                  </div>
                  <div>
                    <dt className={SMALL_LABEL}>Build</dt>
                    <dd className="mt-1 tabular-nums">{kyro.build}</dd>
                  </div>
                </dl>

                <div>
                  <Link href="/contact" className={`inline-block ${PRIMARY}`}>
                    Book a build like this
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section
            id={BACKED.slug}
            data-sphere-step
            className="mt-20 scroll-mt-28 border-t border-foreground/15 pt-5 md:mt-28 md:scroll-mt-32"
          >
            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
              <div>
                <p className={LABEL}>Backed by FTC</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{BACKED.name}</h2>
                <p className="mt-5 max-w-xl text-[clamp(1.05rem,1.8vw,1.35rem)] leading-[1.4] text-foreground/85">
                  {BACKED.summary}
                </p>
                <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-foreground/50">
                  Already part of HWY6 before we came in: {listed(BACKED.earlier)}.
                </p>
                <a
                  href={BACKED.site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-block ${SECONDARY}`}
                >
                  {BACKED.site.label}
                </a>
              </div>

              <BrandTree
                root={BACKED.name}
                leaves={BACKED.brands.map(({ slug, name, launched }) => ({ slug, name, launched }))}
              />
            </div>
          </section>

          <div data-sphere-step className="mt-16 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-8">
            {BACKED.brands.map((brand) => (
              <article key={brand.slug} id={brand.slug} className="scroll-mt-28 md:scroll-mt-32">
                <WorkFrame>
                  <ImagePlaceholder label={brand.media} ratio="aspect-[16/10]" />
                </WorkFrame>
                <h3 className="mt-5 text-xl font-bold tracking-tight md:text-2xl">{brand.name}</h3>
                {brand.tagline && (
                  <p className="mt-1 text-red-700 dark:text-red-500">{brand.tagline}</p>
                )}
                <p className="mt-2 font-mono text-[0.65rem] tracking-[0.16em] text-foreground/50 uppercase">
                  {brand.launched}
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/75 md:text-base">
                  {brand.summary}
                </p>
                {brand.link && (
                  <a
                    href={brand.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-xs tracking-widest text-foreground/80 uppercase underline decoration-red-500 underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {brand.link.label}
                  </a>
                )}
              </article>
            ))}
          </div>

          <section className="mt-24 border-t border-foreground/15 pt-10 md:mt-32 md:pt-14">
            <h2 className="max-w-3xl text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.06] font-bold tracking-tight text-balance">
              Want yours to look like this?
            </h2>
            <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
              Tell us what you&apos;re building. We&apos;ll show you what it could
              look like, and what it would take.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className={PRIMARY}>
                Book a call
              </Link>
              <Link href="/overview" className={SECONDARY}>
                See what we do
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
