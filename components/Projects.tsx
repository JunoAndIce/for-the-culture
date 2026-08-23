import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Placeholder work. The three clients are the ones already quoted in
 * Testimonials, so the two panels read as the same agency rather than two
 * unrelated lists of names.
 */
const PROJECTS = [
  {
    slug: "kyro-bros",
    name: "Kyro & Bros.",
    discipline: "Brand system, storefront, ops handover",
    summary:
      "A logistics startup with three trucks and no name. We built the brand, the booking flow, and the dispatch playbook their team still runs on.",
    badges: ["Branding", "Next.js", "Design System", "Copywriting"],
    facts: [
      { label: "Year", value: "2025" },
      { label: "Timeline", value: "11 weeks" },
      { label: "Scope", value: "End to end" },
      { label: "Outcome", value: "4x booking volume" },
    ],
    motif: "orbit",
  },
  {
    slug: "halcyon-labs",
    name: "Halcyon",
    discipline: "Positioning and launch site",
    summary:
      "Research tooling that needed to read as a product, not a paper. We found the story first, then built the site their sales team still leads with.",
    badges: ["Positioning", "Web Design", "Motion", "Analytics"],
    facts: [
      { label: "Year", value: "2024" },
      { label: "Timeline", value: "6 weeks" },
      { label: "Scope", value: "Strategy and build" },
      { label: "Outcome", value: "Launched on schedule" },
    ],
    motif: "contour",
  },
  {
    slug: "copperline",
    name: "Copperline",
    discipline: "Identity refresh and enablement",
    summary:
      "A twenty-year-old fabricator modernising without losing the shop-floor voice. We rebuilt the identity, then taught them to run it themselves.",
    badges: ["Identity", "Print", "Art Direction", "Enablement"],
    facts: [
      { label: "Year", value: "2024" },
      { label: "Timeline", value: "9 weeks" },
      { label: "Scope", value: "Identity and docs" },
      { label: "Outcome", value: "No retainer needed" },
    ],
    motif: "stack",
  },
] as const;

type Project = (typeof PROJECTS)[number];

/**
 * One line-art figure per project, so switching visibly changes the frame
 * rather than swapping one grey box for an identical one.
 */
const MOTIFS = {
  orbit: (
    <>
      <circle cx="160" cy="90" r="58" />
      <ellipse cx="160" cy="90" rx="58" ry="20" />
      <ellipse cx="160" cy="90" rx="22" ry="58" />
    </>
  ),
  contour: (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M-10 ${50 + i * 22} C 90 ${10 + i * 22} 230 ${94 + i * 22} 330 ${34 + i * 22}`}
        />
      ))}
    </>
  ),
  stack: (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={62 + i * 18} y={26 + i * 12} width="140" height="86" />
      ))}
    </>
  ),
} satisfies Record<Project["motif"], React.ReactNode>;

/**
 * Stands in for the project's hero shot. Drawn rather than dropped in as a
 * grey box so an unfinished panel still looks composed, and drawn in
 * currentColor so it inverts with the theme like everything else here.
 *
 * To use a real asset: replace the <svg> with next/image and keep the wrapper,
 * which is what supplies the frame and the aspect ratio.
 */
function ProjectImage({ project, index }: { project: Project; index: number }) {
  // Pattern ids are document-global. Radix only mounts the active panel today,
  // so nothing would collide, but that is a default rather than a guarantee —
  // forceMount would put all three in the document at once.
  const gridId = `${project.slug}-grid`;

  return (
    <div className="overflow-hidden rounded-lg border border-foreground/15 bg-foreground/5">
      <svg
        viewBox="0 0 320 180"
        className="block w-full text-foreground"
        role="img"
        aria-label={`Placeholder artwork for ${project.name}`}
      >
        <defs>
          <pattern
            id={gridId}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M16 0H0v16"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="320" height="180" fill={`url(#${gridId})`} />
        <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45">
          {MOTIFS[project.motif]}
        </g>
        <text
          x="14"
          y="166"
          fill="currentColor"
          fontSize="46"
          fontWeight="900"
          opacity="0.12"
        >
          {String(index + 1).padStart(2, "0")}
        </text>
      </svg>
    </div>
  );
}

export default function Projects() {
  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      <div className="flex min-w-0 flex-col justify-center items-center">
        <h2 className="flex items-center justify-center gap-4 text-2xl font-extralight tracking-widest uppercase md:gap-6 md:text-5xl">
          <span
            aria-hidden="true"
            className="shrink-0 text-sm text-foreground/40 select-none"
          >
            &bull;
          </span>
          <span>What We&apos;ve Built</span>
          <span
            aria-hidden="true"
            className="shrink-0 text-sm text-foreground/40 select-none"
          >
            &bull;
          </span>
        </h2>
        <p className="text-center mt-5 max-w-2xl text-xs leading-relaxed font-bold text-foreground/70 md:mt-8 md:text-lg">
          Brick by brick, we build for sustainable growth, not a one-off launch. These are the projects that
          have grown into long-term partnerships, and the work that has outlived us.
        </p>
        {/*
         * Three tracks, not two. The index occupies the first, the work the
         * second, and the third is empty and exactly as wide as the first —
         * that phantom column is what keeps the work centred under the heading
         * instead of being shoved right by the width of the index.
         *
         * Below lg the sidebar would leave the middle track too narrow to hold
         * a 16:9 frame, so the index stacks above the work instead.
         */}
        <Tabs
          orientation="vertical"
          defaultValue={PROJECTS[0].slug}
          className="mt-8 w-full min-w-0 max-lg:flex-col md:mt-12 lg:grid lg:grid-cols-[13rem_minmax(0,48rem)_13rem] lg:justify-center lg:gap-x-10"
        >
          <TabsList
            variant="line"
            className="w-full items-stretch gap-1 max-lg:flex-row! lg:col-start-1 lg:row-start-1 lg:gap-2"
          >
            {PROJECTS.map((project, i) => (
              <TabsTrigger
                key={project.slug}
                value={project.slug}
                /*
                 * A row below lg, the sidebar column above it. Radix takes
                 * orientation as one fixed value, so the axis is flipped in CSS
                 * rather than by prop — doing it by prop would mean a client
                 * boundary and a visible flip on first paint.
                 *
                 * The bangs are load-bearing: the component's own rules are
                 * scoped under the root's [data-orientation=vertical], which
                 * outranks a plain breakpoint utility. The active marker is
                 * hidden and redrawn as an underline on before:, which nothing
                 * in the component styles, rather than unpicking the three
                 * rules that park it against the right edge.
                 */
                className="w-full gap-3 py-2 text-xs tracking-widest uppercase max-lg:w-auto! max-lg:justify-center! max-lg:whitespace-normal! max-lg:after:hidden max-lg:before:absolute max-lg:before:inset-x-0 max-lg:before:bottom-[-5px] max-lg:before:h-0.5 max-lg:before:origin-center max-lg:before:scale-x-0 max-lg:before:bg-foreground max-lg:before:transition-transform max-lg:before:duration-300 max-lg:data-active:before:scale-x-100 motion-reduce:before:transition-none"
              >
                <span className="text-foreground/40 tabular-nums max-lg:hidden">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{project.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {PROJECTS.map((project, i) => (
            <TabsContent
              key={project.slug}
              value={project.slug}
              // min-h keeps the page from reflowing as you switch projects.
              className="mx-auto w-full max-w-3xl min-w-0 md:min-h-80 lg:col-start-2 lg:row-start-1"
            >
              {/*
               * Image leads, details read underneath it. The column is capped
               * on TabsContent rather than filling the panel: a 16:9 frame
               * spanning a wide viewport would be taller than the screen it
               * sits in, and would push the facts below the fold.
               */}
              <div className="grid min-w-0 gap-6">
                <ProjectImage project={project} index={i} />

                <div className="flex min-w-0 flex-col">
                  <h3 className="text-lg tracking-widest uppercase md:text-2xl">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-xs tracking-widest text-foreground/50 uppercase">
                    {project.discipline}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed font-light text-foreground/80">
                    {project.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="outline"
                        className="border-foreground/25 tracking-widest text-foreground/70 uppercase"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-foreground/15 pt-4 sm:grid-cols-4">
                    {project.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="text-[0.65rem] tracking-widest text-foreground/45 uppercase">
                          {fact.label}
                        </dt>
                        <dd className="mt-0.5 text-xs text-foreground/80 md:text-sm">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
