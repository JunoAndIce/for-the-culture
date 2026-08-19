import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote:
      "They took a name on a napkin and handed back a company. Brand, site, and filings done before our first customer call.",
    name: "Marcus Reed",
    role: "Founder, Reed & Co.",
  },
  {
    quote:
      "The only agency we've worked with that asked about our margins before our logo. It showed in everything after.",
    name: "Alina Vasquez",
    role: "COO, Northbound",
  },
  {
    quote:
      "We launched in six weeks. The positioning work is still what our sales team leads with two years on.",
    name: "Devon Blake",
    role: "CEO, Halcyon Labs",
  },
] as const;

/** Placeholder slots — swap the label for a logo <Image> as partners are signed. */
const AFFILIATIONS = [
  "Kyro & Bros.",
  "HWY6 Studios",
  "Halcyon Labs",
  "Studio Meridian",
  "Copperline",
  "Vantage Group",
] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export default function Testimonials() {
  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      <div className="flex min-w-0 flex-col items-center justify-center text-center">
        <h2 className="flex items-center justify-center gap-4 text-2xl font-extralight tracking-widest uppercase md:gap-6 md:text-5xl">
          <span
            aria-hidden="true"
            className="shrink-0 text-sm text-foreground/40 select-none"
          >
            &bull;
          </span>
          <span>In good company</span>
          <span
            aria-hidden="true"
            className="shrink-0 text-sm text-foreground/40 select-none"
          >
            &bull;
          </span>
        </h2>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed font-bold text-foreground/70 md:mt-8 md:text-lg">
          We measure ourselves by what our partners build after we hand the keys
          back. These are the founders and operators who trusted us early, and
          the organisations we keep good company with.
        </p>

        <ul className="mt-8 grid w-full max-w-5xl gap-4 text-left md:mt-10 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.name}>
              <Card className="h-full border-foreground/15 bg-foreground/5">
                <CardContent className="flex h-full flex-col gap-4">
                  <p className="text-sm leading-relaxed font-light text-foreground/80">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-foreground/10 text-[0.65rem] tracking-widest text-foreground/70 uppercase">
                        {initials(t.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs tracking-widest text-foreground uppercase">
                        {t.name}
                      </p>
                      <p className="text-xs font-light text-foreground/50">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        {/*
         * Logo ticker. The list is rendered twice and the track slides exactly
         * -50%, so the second copy lands where the first began — a seamless loop
         * with no JS. The mask fades both ends instead of hard-cutting.
         */}
        <div
          className="mt-8 w-full min-w-0 max-w-5xl overflow-hidden md:mt-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          aria-label="Affiliations"
        >
          <ul className="flex w-max animate-[ticker_38s_linear_infinite] items-center gap-12 motion-reduce:animate-none md:gap-20">
            {[...AFFILIATIONS, ...AFFILIATIONS].map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= AFFILIATIONS.length ? "true" : undefined}
                className="shrink-0 text-xs tracking-widest whitespace-nowrap text-foreground/40 uppercase transition-colors hover:text-foreground/70 md:text-sm"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
