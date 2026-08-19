import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="flex flex-col justify-center md:items-end">
        <div className="flex flex-col items-center text-center md:mr-12 md:max-w-3xl">
          <h2 className="flex items-center justify-center gap-4 text-2xl font-extralight tracking-widest uppercase md:gap-6 md:text-5xl">
            <span
              aria-hidden="true"
              className="shrink-0 text-3xl text-foreground/40 select-none"
            >
              &bull;
            </span>
            <span>Start your dream with us</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-3xl text-foreground/40 select-none"
            >
              &bull;
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed font-bold text-foreground/70 md:mt-8 md:text-lg">
            For the Culture is committed to helping you achieve your goals.
            Whether you&apos;re building a new website, creating a brand
            identity, or launching a marketing campaign, we have the expertise
            to help you succeed.
          </p>

          <Tabs
            defaultValue={FEATURES[0].title}
            className="mt-8 w-full text-left md:mt-10"
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
            className="mt-8 rounded-lg border border-foreground/40 px-6 py-3 text-xs tracking-widest text-foreground uppercase transition-colors hover:border-foreground hover:bg-foreground/10 md:mt-10"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
