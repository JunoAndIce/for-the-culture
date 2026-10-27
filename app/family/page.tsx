import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Navbar from "@/components/Navbar";
import { BOARD, CEO, LEGACY } from "@/lib/family";

export const metadata: Metadata = {
  title: "Family — For the Culture",
  description:
    "The founder and the board behind For the Culture, each leading a branch of the company, and how to join us in building something that lasts.",
};

const LABEL =
  "font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500";
const SMALL_LABEL = "font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase";
const PRIMARY =
  "rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80";
const SECONDARY =
  "rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10";

/** The people: the CEO first and largest, then the board, one branch each. */
export default function FamilyPage() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-background/85" />
      <Navbar />

      <main className="relative z-10 px-5 pt-28 pb-20 md:px-16 md:pt-36 md:pb-28 xl:px-24">
        <div className="mx-auto max-w-6xl">
          <header>
            <p className={LABEL}>The family</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.06] font-bold tracking-tight text-balance">
              <span>The people behind the culture.</span>{" "}
              <span className="text-foreground/50">
                One founder, a board that leads each branch, and a crew building
                everything you see here.
              </span>
            </h1>
          </header>

          <section
            aria-labelledby="ceo-name"
            className="mt-14 grid gap-8 border-t border-foreground/15 pt-6 md:mt-20 md:grid-cols-[minmax(0,1fr)_1.3fr] md:gap-14"
          >
            <ImagePlaceholder label={`Portrait: ${CEO.name}`} ratio="aspect-[4/5]" />
            <div className="flex flex-col justify-center">
              <p className={LABEL}>{CEO.branch}</p>
              <h2 id="ceo-name" className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
                {CEO.name}
              </h2>
              <p className="mt-2 font-mono text-[0.65rem] tracking-[0.16em] text-foreground/55 uppercase md:text-xs">
                {CEO.title}
              </p>
              <p className="mt-6 text-[clamp(1.1rem,2vw,1.5rem)] leading-[1.35] font-medium text-balance">
                {CEO.bio}
              </p>
            </div>
          </section>

          <div aria-hidden="true" className="mx-auto h-12 w-px bg-foreground/30 md:h-16" />

          <section aria-labelledby="board-heading">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
              <div>
                <p className={LABEL}>The board</p>
                <h2 id="board-heading" className="mt-2 text-2xl font-bold tracking-tight md:text-4xl">
                  Each one leads a branch.
                </h2>
              </div>
              <p className="max-w-md font-mono text-xs leading-relaxed text-foreground/65">
                Every branch has one head who answers for its work, its people
                and its standard.
              </p>
            </div>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BOARD.map((member) => (
                <li
                  key={member.slug}
                  className="flex flex-col rounded-lg border border-foreground/15 p-4 transition-colors hover:border-foreground/40"
                >
                  <ImagePlaceholder label={`Portrait: ${member.branch}`} ratio="aspect-[4/5]" compact />
                  <p className={`mt-4 ${SMALL_LABEL}`}>{member.branch}</p>
                  <h3 className="mt-1 text-lg font-bold tracking-tight">{member.name}</h3>
                  <p className="mt-1 font-mono text-[0.65rem] tracking-[0.12em] text-red-700 uppercase dark:text-red-500">
                    {member.title}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed font-light text-foreground/65">
                    {member.bio}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section
            id="join"
            aria-labelledby="join-heading"
            className="mt-20 scroll-mt-28 border-t border-foreground/15 pt-6 md:mt-28"
          >
            <p className={LABEL}>Join us</p>
            <h2
              id="join-heading"
              className="mt-3 max-w-4xl text-[clamp(1.6rem,3.6vw,3.25rem)] leading-[1.08] font-bold tracking-tight text-balance"
            >
              <span>Build something that outlasts us.</span>{" "}
              <span className="text-foreground/50">There is a seat at the table.</span>
            </h2>

            <ol className="mt-8 grid gap-6 border-t border-foreground/15 pt-7 sm:grid-cols-3 sm:gap-8 md:gap-10">
              {LEGACY.map(({ n, title, body }) => (
                <li key={n}>
                  <span className="font-mono text-[0.65rem] tracking-[0.2em] text-red-700 dark:text-red-500">
                    {n}
                  </span>
                  <p className="mt-1 text-xs tracking-widest text-foreground uppercase md:text-sm">
                    {title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed font-light text-foreground/60 md:text-sm">
                    {body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/contact?topic=careers" className={PRIMARY}>
                Send us your work
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
