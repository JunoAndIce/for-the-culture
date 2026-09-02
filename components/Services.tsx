import {
  ArrowRight,
  ChartLine,
  MonitorPlay,
  Palette,
  Radio,
  Search,
} from "lucide-react";
import ScriptReveal from "@/components/ScriptReveal";

const SERVICES = [
  {
    icon: Radio,
    name: "Traditional Media",
    body: "Radio, print, and out-of-home. The buys that still own a neighbourhood.",
  },
  {
    icon: MonitorPlay,
    name: "Digital Media",
    body: "Paid social, video, and display, put in front of the people most likely to buy.",
  },
  {
    icon: Search,
    name: "Search & SEO",
    body: "Turn up first when somebody nearby searches for what you already sell.",
  },
  {
    icon: Palette,
    name: "Branding & Design",
    body: "Name, mark, packaging, and a look that survives contact with the real world.",
  },
  {
    icon: ChartLine,
    name: "Strategy & Research",
    body: "Who your customer is, what moves them, and what the last dollar brought back.",
  },
] as const;

// The way in. Numbered because it is a real sequence, and step one costs nothing.
const STEPS = [
  {
    n: "01",
    title: "Tell us where you are",
    body: "One call. No deck, no budget figure required.",
  },
  {
    n: "02",
    title: "We map it out",
    body: "What to do first, what it costs, what it should bring back.",
  },
  {
    n: "03",
    title: "We run it",
    body: "Built and managed in-house, with the numbers open to you throughout.",
  },
] as const;

// Proof on one line. The stat grid this replaces cost a third of the panel.
const PROOF = [
  "40+ brands launched",
  "9-week median build",
  "100% founder owned",
] as const;

export default function Services() {
  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      <div className="flex flex-col justify-center md:items-end">
        <div className="flex w-full flex-col items-start text-left md:mr-12 md:max-w-3xl">
          <ScriptReveal className="bg-linear-to-r from-[#AF2F34] via-[#A57100] to-[#1F7C44] bg-clip-text pt-[0.06em] pb-[0.22em] font-cochocib text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] text-transparent dark:from-[#D75555] dark:via-[#F4BC48] dark:to-[#4AA167]">
            For the Culture
          </ScriptReveal>

          <p className="mt-5 font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
            What we do, and who for
          </p>

          <h2 className="mt-3 text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.08] font-bold tracking-tight text-balance">
            <span>
              Agency work for the businesses the agencies never called.
            </span>{" "}
            <span className="text-foreground/50">
              You bring the business. We bring the studio, the airtime, and the
              plan behind both.
            </span>
          </h2>

          <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
            Five services, one team. No matter where you start from, we're here to help you get seen, and get found.
            It's time to stop worrying about the small stuff, and move onto the bigger picture: your business, your brand, and your legacy.
          </p>

          {/* A ruled list, not a card grid: five does not divide into columns,
              and the rows let the name and its plain-English line share a
              baseline that can be scanned in a breath. */}
          <ul className="mt-7 w-full border-t border-foreground/15">
            {SERVICES.map(({ icon: Icon, name, body }) => (
              <li key={name}>
                <a
                  href="#"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-foreground/15 py-3 transition-colors hover:border-foreground/40 md:grid-cols-[auto_13rem_1fr_auto] md:gap-x-6"
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.6}
                    className="size-4 shrink-0 text-red-700 dark:text-red-500"
                  />
                  <span className="text-[0.7rem] tracking-widest text-foreground uppercase md:text-xs">
                    {name}
                  </span>
                  <span className="col-span-2 col-start-2 mt-1 text-xs leading-relaxed font-light text-foreground/60 md:col-span-1 md:col-start-3 md:mt-0">
                    {body}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.6}
                    className="col-start-3 row-start-1 size-4 shrink-0 text-foreground/30 transition-transform group-hover:translate-x-1 motion-reduce:transition-none md:col-start-4"
                  />
                </a>
              </li>
            ))}
          </ul>

          <ol className="mt-7 grid w-full gap-4 sm:grid-cols-3">
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
            <a
              href="#"
              className="rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
            >
              See the work
            </a>
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
    </section>
  );
}
