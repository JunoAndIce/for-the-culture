import Link from "next/link";

// Why someone would come, not what they would do. Roles change; these do not.
const PRINCIPLES = [
  {
    n: "01",
    title: "We hire from here",
    body: "The first call goes out on our own block before it goes anywhere else. The people we build for and the people we build with come from the same places.",
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
      {/* Left column: the sphere leaves to the right on this pose
          (SPHERE_PATH desktop index 5), so the text keeps the open side. */}
      <div className="flex min-w-0 flex-col justify-center">
        <div className="flex w-full max-w-4xl flex-col items-start text-left">
          <p className="font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
            Join us
          </p>

          <h2 className="mt-3 text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.08] font-bold tracking-tight text-balance">
            <span>We are always short one good person.</span>{" "}
            <span className="text-foreground/50">
              See if you&apos;re a fit.
            </span>
          </h2>

          <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
            For the Culture is community ran, which means we&apos;re always looking to grow our family, and welcome new members who share our values.
          </p>

          <ol className="mt-8 grid w-full gap-6 border-t border-foreground/15 pt-7 sm:grid-cols-3 sm:gap-8">
            {PRINCIPLES.map(({ n, title, body }) => (
              <li key={n}>
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-red-700 dark:text-red-500">
                  {n}
                </span>
                <p className="mt-1 text-[0.7rem] tracking-widest text-foreground uppercase md:text-xs">
                  {title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed font-light text-foreground/60">
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
              Send us your work
            </a>
            <Link
              href="/overview"
              className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
            >
              See what we do
            </Link>
          </div>

          <ul className="mt-6 flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-t border-foreground/15 pt-4 font-mono text-[0.65rem] tracking-[0.15em] text-foreground/50 uppercase">
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
