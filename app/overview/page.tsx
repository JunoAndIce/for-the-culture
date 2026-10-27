import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ServiceDeck from "@/components/ServiceDeck";
import { PROOF, STEPS } from "@/lib/services";

export const metadata: Metadata = {
  title: "Overview — For the Culture",
  description:
    "The five services in full: traditional media, digital media, search, branding, and strategy. What each one covers, what you get, and when to use it.",
};

/**
 * The long version of the Services panel. No [data-panel] sections here on
 * purpose: the sphere holds its opening pose, and the service deck turns it.
 */
export default function OverviewPage() {
  return (
    <div className="relative">
      {/* The sphere is texture here, not the subject: this page is for reading. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-background/85" />
      <Navbar />

      <main className="relative z-10 px-5 pt-28 pb-20 md:px-16 md:pt-36 md:pb-28 xl:px-24">
        <div className="mx-auto max-w-6xl">
          <header className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
                What we do, in full
              </p>
              <h1 className="mt-3 text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.06] font-bold tracking-tight text-balance">
                <span>We focus on what&apos;s important.</span>{" "}
                <span className="text-foreground/50">
                  From physical media to SEO, we make sure each part of your outreach is covered.
                </span>
              </h1>
            </div>

            <p className="max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm lg:pb-2">
              Nothing here is subcontracted out and marked up. The people who plan
              the work are the people who run it. We have teams for all types of media, if you&apos;re
              lacking in a department, we can cover for you.
            </p>
          </header>

          <ServiceDeck />

          {/* The bottom of the panel this page expands, repeated where it lands. */}
          <div className="mt-16 border-t border-foreground/15 pt-8 md:mt-20">
            <p className="font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase">
              How it runs
            </p>

            <ol className="mt-4 grid w-full gap-3 sm:grid-cols-3 md:gap-4">
              {STEPS.map(({ n, title, body }) => (
                <li
                  key={n}
                  className="rounded-2xl border border-foreground/15 bg-background/60 p-5"
                >
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
              <Link
                href="/contact"
                className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80"
              >
                Start with a conversation
              </Link>
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
