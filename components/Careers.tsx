import Link from "next/link";

// Why someone would come, not what they would do. Roles change; these do not.
const PRINCIPLES = [
  {
    n: "01",
    title: "Growing Culture",
    body: "For the Culture is a community, not a company. We are always looking for people who want to grow it with us.",
  },
  {
    n: "02",
    title: "Teach it forward",
    body: "Whatever we learn gets handed on — to the next hire, to the client, to whoever asks. Nobody here gets to sit on a skill.",
  },
  {
    n: "03",
    title: "The room stays open",
    body: "Open studio nights, portfolio reviews, and a desk for anyone building something real. You do not have to work here to be let in.",
  },
] as const;

const TERMS = [
  "Portfolios over CVs",
  "Paid internships",
  "Every application answered",
] as const;

export default function Careers() {
  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      <div className="flex min-w-0 flex-col justify-center">
        <div className="flex w-full max-w-4xl flex-col items-start text-left lg:max-w-5xl">
          <p
            data-unfold
            className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs lg:text-sm dark:text-red-500"
          >
            Join us
          </p>

          <h2
            data-unfold
            className="mt-3 text-[clamp(1.6rem,3.6vw,3.5rem)] leading-[1.08] font-bold tracking-tight text-balance"
          >
            <span>We are always short one visionary.</span>{" "}
            <span className="text-foreground/50">
              See if you&apos;re a fit.
            </span>
          </h2>

          <ol className="mt-8 grid w-full gap-6 border-t border-foreground/15 pt-7 sm:grid-cols-3 sm:gap-8 lg:mt-10 lg:gap-10 lg:pt-9">
            {PRINCIPLES.map(({ n, title, body }) => (
              <li key={n} data-unfold>
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-red-700 lg:text-xs dark:text-red-500">
                  {n}
                </span>
                <p className="mt-1 text-[0.7rem] tracking-widest text-foreground uppercase md:text-xs lg:text-sm">
                  {title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed font-light text-foreground/60 lg:text-sm">
                  {body}
                </p>
              </li>
            ))}
          </ol>

          <div
            data-unfold
            className="mt-8 flex flex-wrap items-center gap-4 lg:mt-10"
          >
            <a
              href="#"
              className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80 lg:px-8 lg:py-4 lg:text-sm"
            >
              Send us your work
            </a>
            <Link
              href="/overview"
              className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10 lg:px-8 lg:py-4 lg:text-sm"
            >
              See what we do
            </Link>
          </div>

          <ul
            data-unfold
            className="mt-6 flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-t border-foreground/15 pt-4 font-mono text-[0.65rem] tracking-[0.15em] text-foreground/50 uppercase lg:text-xs"
          >
            {TERMS.map((term, i) => (
              <li key={term} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-foreground/25">
                    &bull;
                  </span>
                )}
                {term}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
