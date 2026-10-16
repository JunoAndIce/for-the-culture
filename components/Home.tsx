import ScrambleWord from "@/components/ScrambleWord";

const VISION_WORDS = ["vision", "dream", "story", "brand", "legacy"] as const;

export default function Home() {
  return (
    <section
      data-panel
      className="grid min-h-screen grid-rows-[1fr_auto] p-8 md:p-16 xl:p-24"
    >
      <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
        {/* Above the mark, not under it: underneath it read as a caption for
            the script rather than as the company's name. */}
        <p
          data-intro="eyebrow"
          className="font-mono text-[0.6rem] tracking-[0.34em] text-foreground/60 uppercase md:text-xs"
        >
          FTC Enterprises &middot; Houston, TX
        </p>

        <p
          data-intro="wordmark"
          className="mt-2 font-script text-[clamp(3.5rem,11vw,16rem)] leading-none"
        >
          For the Culture
        </p>

        {/* The plain answer to "what do you do," stated once, before the
            flourish below gets a turn. */}
        <p
          data-intro="tagline"
          className="mt-3 max-w-xl text-base leading-snug font-medium text-foreground md:mt-4 md:text-xl"
        >
          A full-service creative &amp; marketing agency for small
          businesses — everything under one roof.
        </p>

        <p
          data-intro="scramble"
          className="mt-3 font-mono text-[0.65rem] tracking-[0.2em] text-foreground/60 uppercase md:text-xs"
        >
          Let us build your{" "}
          <ScrambleWord
            words={VISION_WORDS}
            className="text-red-700 dark:text-red-500"
          />{" "}
          &mdash; together.
        </p>

        <div
          data-intro="actions"
          className="mt-6 flex flex-wrap justify-center gap-4 md:mt-8 md:justify-start"
        >
          <a
            href="#"
            className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80"
          >
            Join us
          </a>
          <a
            href="#"
            className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
          >
            See what we do
          </a>
        </div>
      </div>

      {/* Right side stays empty: the scroll chevron is fixed in that corner. */}
      <div className="flex items-end justify-between gap-4">
        <address
          data-intro="actions"
          className="text-xs leading-relaxed text-foreground/60 not-italic"
        >
          Based in Texas
          <br />
          Serving Worldwide
          <br />
          &copy; FTC 2026
        </address>
      </div>
    </section>
  );
}
