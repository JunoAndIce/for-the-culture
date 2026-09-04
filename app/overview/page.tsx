import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Navbar from "@/components/Navbar";
import Scene from "@/components/Scene";
import { PROOF, SERVICES, STEPS } from "@/lib/services";

export const metadata: Metadata = {
  title: "Overview — For the Culture",
  description:
    "The five services in full: traditional media, digital media, search, branding, and strategy. What each one covers, what you get, and when to use it.",
};

/**
 * The long version of the Services panel. No [data-panel] sections here on
 * purpose: with fewer than two, the sphere holds its opening pose and simply
 * sits behind the page instead of being scrolled through.
 */
export default function OverviewPage() {
  return (
    <div className="relative bg-background">
      <Scene />
      {/* The sphere is texture here, not the subject: this page is for reading. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-background/85" />
      <Navbar />

      <main className="relative z-10 px-8 pt-32 pb-20 md:px-16 md:pt-40 md:pb-28 xl:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
            What we do, in full
          </p>

          <h1 className="mt-3 text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.06] font-bold tracking-tight text-balance">
            <span>We focus on what&apos;s important.</span>{" "}
            <span className="text-foreground/50">
              From physical media to SEO, we make sure each part of your outreach is covered.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
            Nothing here is subcontracted out and marked up. The people who plan
            the work are the people who run it. We have teams for all types of media, if you&apos;re
            lacking in a department, we can cover for you.
          </p>

          <ImagePlaceholder
            label="Hero — the team at work"
            ratio="aspect-[16/10] md:aspect-[21/9]"
            className="mt-8"
          />

          {/* Jump list. The page is long enough that the top should offer a way past it. */}
          <nav aria-label="Services" className="mt-8 w-full border-t border-foreground/15">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-4">
              {SERVICES.map(({ slug, name }, i) => (
                <li key={slug}>
                  <a
                    href={`#${slug}`}
                    className="flex items-baseline gap-2 text-[0.7rem] tracking-widest text-foreground/60 uppercase transition-colors hover:text-foreground"
                  >
                    <span className="font-mono text-[0.6rem] text-red-700 dark:text-red-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {SERVICES.map(({ slug, icon: Icon, name, body, detail, includes, outcome }, i) => (
            <section
              key={slug}
              id={slug}
              className="scroll-mt-28 border-t border-foreground/15 pt-8 pb-4 mt-12 md:scroll-mt-36 md:mt-16"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-red-700 dark:text-red-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.6}
                  className="size-4 shrink-0 text-red-700 dark:text-red-500"
                />
                <h2 className="text-[0.7rem] tracking-widest text-foreground uppercase md:text-xs">
                  {name}
                </h2>
              </div>

              <p className="mt-4 max-w-2xl text-[clamp(1.1rem,2.4vw,1.6rem)] leading-[1.15] font-bold tracking-tight text-balance">
                {body}
              </p>

              <p className="mt-4 max-w-2xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
                {detail}
              </p>

              <ImagePlaceholder label={`${name} — work sample`} className="mt-6" />

              <p className="mt-7 font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase">
                What you get
              </p>

              <ul className="mt-2 grid w-full border-t border-foreground/15 sm:grid-cols-2 sm:gap-x-8">
                {includes.map((line) => (
                  <li
                    key={line}
                    className="border-b border-foreground/15 py-2.5 text-xs leading-relaxed font-light text-foreground/60"
                  >
                    {line}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[0.7rem] leading-relaxed tracking-wide text-foreground/50">
                {outcome}
              </p>
            </section>
          ))}

          {/* The bottom of the panel this page expands, repeated where it lands. */}
          <div className="mt-16 border-t border-foreground/15 pt-8">
            <p className="font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase">
              How it runs
            </p>

            <ol className="mt-4 grid w-full gap-4 sm:grid-cols-3">
              {STEPS.map(({ n, title, body }) => (
                <li key={n}>
                  <span className="font-mono text-[0.65rem] tracking-[0.2em] text-red-700 dark:text-red-500">
                    {n}
                  </span>
                  <p className="mt-1 text-[0.7rem] tracking-widest text-foreground uppercase">
                    {title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed font-light text-foreground/60">
                    {body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80"
              >
                Start with a conversation
              </a>
              <Link
                href="/"
                className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
              >
                Back to the work
              </Link>
            </div>

            <ul className="mt-6 flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-t border-foreground/15 pt-4 font-mono text-[0.65rem] tracking-[0.15em] text-foreground/50 uppercase">
              {PROOF.map((fact, i) => (
                <li key={fact} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-foreground/25">
                      &bull;
                    </span>
                  )}
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
