import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AFFILIATIONS, TESTIMONIALS } from "@/lib/work";


const [FEATURED, ...REST] = TESTIMONIALS;

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
        <div className="flex w-full max-w-6xl flex-col items-start text-left lg:max-w-7xl">
          {/* red-700 light, red-500 dark: the two steps that clear AA here. */}
          <p
            data-unfold
            className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs lg:text-sm dark:text-red-500"
          >
            In good company
          </p>

          <h2
            data-unfold
            className="mt-3 text-[clamp(1.6rem,3.6vw,3.5rem)] leading-[1.08] font-bold tracking-tight text-balance"
          >
            <span>Ask the people who were here before you.</span>{" "}
          </h2>

          <p
            data-unfold
            className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm lg:max-w-2xl lg:text-base"
          >
            We measure ourselves by what our partners build after we hand the
            keys back. Every name below will take your call — we make the
            introduction ourselves.
          </p>

          {/* The quote's rule is its own element so it can draw in. */}
          <div
            aria-hidden="true"
            data-unfold="draw"
            className="mt-8 h-px w-full max-w-4xl bg-foreground/15 lg:mt-10"
          />

          {/* Gelasio is the client's voice; the sans stays ours. */}
          <blockquote className="w-full max-w-4xl pt-7 lg:pt-9">
            <p
              data-unfold
              className="font-gelasio text-[clamp(1.15rem,2.6vw,2.5rem)] leading-[1.36] tracking-tight italic text-pretty"
            >
              <span className="text-red-700 dark:text-red-500">&ldquo;</span>
              {FEATURED.quote}
              <span className="text-red-700 dark:text-red-500">&rdquo;</span>
            </p>

            <div data-unfold className="mt-5 flex items-center gap-3 lg:mt-7">
              <Avatar className="size-9 lg:size-11">
                <AvatarFallback className="bg-transparent font-mono text-[0.6rem] tracking-widest text-foreground/60 uppercase ring-1 ring-foreground/15">
                  {initials(FEATURED.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[0.7rem] tracking-widest text-foreground uppercase lg:text-xs">
                  {FEATURED.name}
                </p>
                <p className="text-xs font-light text-foreground/50 lg:text-sm">
                  {FEATURED.role}
                </p>
              </div>
            </div>

            {/* The label is the promise: this line is meant to be checkable. */}
            <p
              data-unfold
              className="mt-5 inline-flex flex-wrap items-baseline gap-x-3 border-t border-foreground/15 pt-3 font-mono text-[0.65rem] tracking-[0.1em] text-foreground/60 lg:mt-7 lg:text-xs"
            >
              <span className="tracking-[0.18em] text-red-700 uppercase dark:text-red-500">
                Since
              </span>
              {FEATURED.since}
            </p>
          </blockquote>

          {/* The buttons and the ticker build as one beat. */}
          <div data-unfold className="w-full min-w-0">
            <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-10">
              <a
                href="#"
                className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80 lg:px-8 lg:py-4 lg:text-sm"
              >
                Ask them yourself
              </a>
              <Link
                href="/affiliations#voices"
                className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10 lg:px-8 lg:py-4 lg:text-sm"
              >
                Read the full stories
              </Link>
              <p className="font-mono text-[0.65rem] tracking-[0.16em] text-foreground/45 uppercase lg:text-xs">
                {REST.length} more founders
              </p>
            </div>

            {/*
             * Logo ticker. The list is rendered twice and the track slides exactly
             * -50%, so the second copy lands where the first began — a seamless loop
             * with no JS. The mask fades both ends instead of hard-cutting.
             */}
            <div
              className="mt-8 w-full min-w-0 overflow-hidden border-t border-foreground/15 pt-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] lg:mt-10 lg:pt-7"
              aria-label="Affiliations"
            >
              <ul className="flex w-max animate-[ticker_38s_linear_infinite] items-center gap-12 motion-reduce:animate-none md:gap-20">
                {[...AFFILIATIONS, ...AFFILIATIONS].map((name, i) => (
                  <li
                    key={`${name}-${i}`}
                    aria-hidden={i >= AFFILIATIONS.length ? "true" : undefined}
                    className="shrink-0 font-mono text-[0.65rem] tracking-[0.18em] whitespace-nowrap text-foreground/40 uppercase transition-colors hover:text-foreground/70 lg:text-xs"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
