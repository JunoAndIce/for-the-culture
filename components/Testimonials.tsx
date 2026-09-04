import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AFFILIATIONS, TESTIMONIALS } from "@/lib/work";

// One voice gets the room; three support it. The rest wait for the full
// stories page, which is what the second button goes to.
const [FEATURED, ...REST] = TESTIMONIALS;
const ROSTER = REST.slice(0, 3);

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export default function Testimonials() {
  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      {/* Left edge, full width: the sphere is pole-on and near-invisible on this
          panel (SPHERE_PATH desktop index 3), so nothing has to make room. */}
      <div className="flex min-w-0 flex-col justify-center">
        <div className="flex w-full max-w-6xl flex-col items-start text-left">
          {/* red-700 light, red-500 dark: the two steps that clear AA here. */}
          <p className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
            In good company
          </p>

          <h2 className="mt-3 text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.08] font-bold tracking-tight text-balance">
            <span>Ask the people who were here before you.</span>{" "}
            <span className="text-foreground/50">
              Five founders who took the call, and what came of it.
            </span>
          </h2>

          <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
            We measure ourselves by what our partners build after we hand the
            keys back. Every name below will take your call — we make the
            introduction ourselves.
          </p>

          <div className="mt-8 grid w-full gap-8 border-t border-foreground/15 pt-7 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
            {/* Gelasio is the client's voice; the sans stays ours. */}
            <blockquote>
              <p className="font-gelasio text-[clamp(1.05rem,2vw,1.6rem)] leading-[1.36] tracking-tight italic text-pretty">
                <span className="text-red-700 dark:text-red-500">&ldquo;</span>
                {FEATURED.quote}
                <span className="text-red-700 dark:text-red-500">&rdquo;</span>
              </p>

              <div className="mt-4 flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-transparent font-mono text-[0.6rem] tracking-widest text-foreground/60 uppercase ring-1 ring-foreground/15">
                    {initials(FEATURED.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[0.7rem] tracking-widest text-foreground uppercase">
                    {FEATURED.name}
                  </p>
                  <p className="text-xs font-light text-foreground/50">
                    {FEATURED.role}
                  </p>
                </div>
              </div>

              {/* The label is the promise: this line is meant to be checkable. */}
              <p className="mt-4 inline-flex flex-wrap items-baseline gap-x-3 border-t border-foreground/15 pt-3 font-mono text-[0.65rem] tracking-[0.1em] text-foreground/60">
                <span className="tracking-[0.18em] text-red-700 uppercase dark:text-red-500">
                  Since
                </span>
                {FEATURED.since}
              </p>
            </blockquote>

            {/* Below md the roster gives way to the featured voice alone; three
                more quotes there push the panel well past one screen. */}
            <ul className="hidden flex-col md:flex">
              {ROSTER.map(({ quote, name, role }) => (
                <li
                  key={name}
                  className="border-b border-foreground/15 py-3 first:pt-0 last:border-b-0"
                >
                  <q className="block font-gelasio text-sm leading-relaxed text-foreground/70">
                    {quote}
                  </q>
                  <p className="mt-1.5 font-mono text-[0.6rem] tracking-[0.16em] text-foreground/45 uppercase">
                    {name} &middot; {role}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80"
            >
              Ask them yourself
            </a>
            <Link
              href="/affiliations#voices"
              className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
            >
              Read the full stories
            </Link>
            <p className="font-mono text-[0.65rem] tracking-[0.16em] text-foreground/45 uppercase md:hidden">
              {REST.length} more founders
            </p>
          </div>

          {/*
           * Logo ticker. The list is rendered twice and the track slides exactly
           * -50%, so the second copy lands where the first began — a seamless loop
           * with no JS. The mask fades both ends instead of hard-cutting.
           */}
          <div
            className="mt-8 w-full min-w-0 overflow-hidden border-t border-foreground/15 pt-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            aria-label="Affiliations"
          >
            <ul className="flex w-max animate-[ticker_38s_linear_infinite] items-center gap-12 motion-reduce:animate-none md:gap-20">
              {[...AFFILIATIONS, ...AFFILIATIONS].map((name, i) => (
                <li
                  key={`${name}-${i}`}
                  aria-hidden={i >= AFFILIATIONS.length ? "true" : undefined}
                  className="shrink-0 font-mono text-[0.65rem] tracking-[0.18em] whitespace-nowrap text-foreground/40 uppercase transition-colors hover:text-foreground/70"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
