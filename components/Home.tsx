import ScrambleWord from "@/components/ScrambleWord";

const VISION_WORDS = ["vision", "dream", "story", "brand", "legacy"] as const;

export default function Home() {
  return (
    <section
      data-panel
      className="grid min-h-screen grid-rows-[1fr_auto] p-8 md:p-16 xl:p-24"
    >
      <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
        <p className="font-script text-[clamp(3.5rem,11vw,16rem)] leading-none">
          For the Culture
        </p>
        <p className="text-xs md:text-2xl font-black uppercase mt-4 md:mt-0">
          FTC Enterprises
        </p>
        <p className="text-lg md:text-4xl font-light uppercase mt-0 md:mt-4">
          Let us build your{" "}
          <ScrambleWord words={VISION_WORDS} className="text-red-700" />{" "}
          together.
        </p>
        <p className="text-xs md:text-sm font-light uppercase md:w-[75ch] mt-4 md:mt-8">
          For The Culture is a full-service creative agency specializing in web
          design, branding, and digital marketing. We help businesses and
          individuals bring their ideas to life through innovative design and
          strategic marketing solutions.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4 md:mt-8 md:justify-start">
          <a
            href="#"
            className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
          >
            Learn More
          </a>
          <a
            href="#"
            className="rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80"
          >
            Join Us
          </a>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <address className="text-xs leading-relaxed text-foreground/60 not-italic">
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
