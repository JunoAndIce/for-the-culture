import { Clock, Globe, Layers, Users } from "lucide-react";
import ScriptReveal from "@/components/ScriptReveal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Figures worth leading with, rather than a claim the reader has to take on
 * trust. The three continents are the ones the globe panel already names —
 * Lagos, Lisbon, Little Rock — so the two screens agree.
 */
const STATS = [
  { icon: Layers, value: "40+", label: "Brands launched" },
  { icon: Clock, value: "9 WKS", label: "Median build" },
  { icon: Globe, value: "3", label: "Continents served" },
  { icon: Users, value: "100%", label: "Founder owned" },
] as const;

const FEATURES = [
  {
    title: "Brand Identity",
    body: "Naming, logo systems, and a visual language built to scale with you.",
    detail:
      "We start with positioning and naming, then build the mark, type scale, and colour system around it. You leave with a usage guide so the brand holds together whoever touches it next.",
    tags: ["Naming", "Identity", "Guidelines"],
  },
  {
    title: "Web & Product",
    body: "Sites and platforms designed, built, and shipped end to end.",
    detail:
      "Design and engineering under one roof — no handoff gap. Marketing sites, booking flows, and customer portals, built on a stack you can maintain or hand to an in-house team later.",
    tags: ["Design", "Build", "Handover"],
  },
  {
    title: "Go-To-Market",
    body: "Positioning, messaging, and launch campaigns that actually bear fruit.",
    detail:
      "We pin down who you are for and why they should care, then turn that into launch assets, paid and organic channels, and a measurement plan so you can tell what worked.",
    tags: ["Strategy", "Launch", "Analytics"],
  },
  {
    title: "Operations Setup",
    body: "Entity formation, tooling, and process so you can run lean from day one.",
    detail:
      "Entity filing, banking, contracts, and the software stack that keeps admin small. We document the process so the business does not live only in your head.",
    tags: ["Formation", "Tooling", "Process"],
  },
  {
    title: "Creative Direction",
    body: "Art direction and content that keeps the brand coherent as it grows.",
    detail:
      "Ongoing art direction across campaigns, photo and video, and social. The point is consistency: every piece should look like it came from the same company.",
    tags: ["Art Direction", "Content", "Social"],
  },
  {
    title: "Ongoing Advisory",
    body: "A partner on retainer well past the first milestone.",
    detail:
      "Standing time each month for the decisions that do not fit a project scope — hiring, pricing, the next raise, or the next market. You keep the context you already paid for.",
    tags: ["Retainer", "Advisory", "Growth"],
  },
] as const;

export default function Services() {
  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      {/*
       * The block stays on the right because the sphere sits left on this
       * panel (SPHERE_PATH desktop index 1). Only the text alignment inside it
       * changed to left, which is what makes the headline and the stat row
       * read as one column rather than a centred stack.
       */}
      <div className="flex flex-col justify-center md:items-end">
        <div className="flex w-full flex-col items-start text-left md:mr-12 md:max-w-3xl">
          {/*
           * Red to yellow to green, taken from the backdrop artwork so the
           * script matches the borders behind it. Two sets of stops: the
           * artwork's own yellow is 1.7:1 on a white page and would vanish in
           * the light theme, so that one darkens while the reds and greens
           * lighten for the dark theme. All six clear AA.
           *
           * The vertical padding is load-bearing. bg-clip-text only paints
           * glyph pixels that fall inside the element's background box, and a
           * script face throws descenders and swashes well past a tight line
           * box — without the padding their tails come out unpainted.
           */}
          <ScriptReveal className="bg-linear-to-r from-[#AF2F34] via-[#A57100] to-[#1F7C44] bg-clip-text pt-[0.06em] pb-[0.22em] font-cochocib text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] text-transparent dark:from-[#D75555] dark:via-[#F4BC48] dark:to-[#4AA167]">
            For the Culture
          </ScriptReveal>

          {/* Red is the site's existing accent. 500 on the dark theme and 700
              on the light one are the two steps that clear AA at this size. */}
          <p className="mt-6 font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500">
            What we do
          </p>

          {/* Facts in full strength, the claim they support in half. */}
          <h2 className="mt-3 text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.05] font-bold tracking-tight text-balance">
            <span>40 brands. 3 continents. One community.</span>{" "}
            <span className="text-foreground/50">
              Built with the culture, never about it.
            </span>
          </h2>

          <p className="mt-5 max-w-xl font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
            For the Culture of Texas. Brand, web, and go-to-market under one
            roof, built to outlive the launch.
          </p>

          <dl className="mt-8 grid w-full grid-cols-2 gap-x-6 gap-y-6 border-t border-foreground/15 pt-6 sm:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              // order-last puts the label under the figure while leaving dt
              // ahead of its dd in the markup, which is the order HTML wants.
              <div key={label} className="flex flex-col">
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="mb-3 size-4 text-red-700 dark:text-red-500"
                />
                <dt className="order-last mt-1 font-mono text-[0.65rem] tracking-[0.2em] text-foreground/60 uppercase">
                  {label}
                </dt>
                <dd className="text-2xl font-bold tracking-tight md:text-3xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <Tabs
            defaultValue={FEATURES[0].title}
            className="mt-10 w-full text-left"
          >
            {/* Grid rather than flex-wrap: fixed columns give even rows instead
                of a ragged 4+2, and the row gap leaves room for the line
                variant's underline, which sits outside the trigger box. */}
            <TabsList
              variant="line"
              className="grid w-full grid-cols-2 gap-x-2 gap-y-3 group-data-horizontal/tabs:h-auto md:grid-cols-3 md:gap-y-4"
            >
              {FEATURES.map((feature) => (
                <TabsTrigger
                  key={feature.title}
                  value={feature.title}
                  className="w-full text-[0.7rem] tracking-widest whitespace-normal uppercase md:text-xs after:origin-center after:scale-x-0 after:opacity-100 after:transition-transform after:duration-300 data-active:after:scale-x-100 motion-reduce:after:transition-none"
                >
                  {feature.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {FEATURES.map((feature) => (
              <TabsContent
                key={feature.title}
                value={feature.title}
                // min-h keeps the panel from jumping as you switch tabs.
                className="mt-5 min-h-40 rounded-lg border border-foreground/15 bg-foreground/5 p-5"
              >
                <p className="text-sm tracking-widest text-foreground uppercase">
                  {feature.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed font-light text-foreground/70 md:text-sm">
                  {feature.body}
                </p>
                <p className="mt-3 text-xs leading-relaxed font-light text-foreground/60">
                  {feature.detail}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-foreground/25 tracking-widest text-foreground/70 uppercase"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <a
            href="#"
            className="mt-8 rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
