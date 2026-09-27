import type { Project } from "@/lib/work";

type Variant = "standard" | "wide" | "card";

// Standard is the 16:9 frame the Projects carousel has always used. Wide
// (21:9) and card (4:3) are the gallery crops on /affiliations. `k` nudges the
// line-art up on the bigger frames so it does not read as lost in them.
const FRAME: Record<Variant, { w: number; h: number; k: number }> = {
  standard: { w: 320, h: 180, k: 1 },
  wide: { w: 420, h: 180, k: 1.07 },
  card: { w: 320, h: 240, k: 1.07 },
};

// One line-art figure per project, so switching visibly changes the frame
// rather than swapping one grey box for an identical one. Each is drawn from
// the frame's own centre, so at `standard` it is the original 320x180 figure.
const MOTIFS = {
  orbit: (w: number, h: number, k: number) => (
    <>
      <circle cx={w / 2} cy={h / 2} r={58 * k} />
      <ellipse cx={w / 2} cy={h / 2} rx={58 * k} ry={20 * k} />
      <ellipse cx={w / 2} cy={h / 2} rx={22 * k} ry={58 * k} />
    </>
  ),
  contour: (w: number, h: number, k: number) => {
    const gap = 22 * k * Math.sqrt(h / 180);
    return (
      <>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = h / 2 - 2 * gap + 4 + i * gap;
          return (
            <path
              key={i}
              d={`M-10 ${y} C ${w * 0.28125} ${y - 40} ${w * 0.71875} ${y + 44} ${w + 10} ${y - 16}`}
            />
          );
        })}
      </>
    );
  },
  stack: (w: number, h: number) => {
    const rectHeight = 86 + (h - 180) * 0.23;
    const x = Math.round(w / 2 - 98);
    const y = h / 2 - 21 - rectHeight / 2;
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={x + i * 18}
            y={y + i * 12}
            width="140"
            height={rectHeight}
          />
        ))}
      </>
    );
  },
} satisfies Record<
  Project["motif"],
  (w: number, h: number, k: number) => React.ReactNode
>;

/**
 * Stands in for the project's hero shot. Drawn rather than dropped in as a
 * grey box so an unfinished panel still looks composed, and drawn in
 * currentColor so it inverts with the theme like everything else here.
 *
 * To use a real asset: replace the <svg> with next/image and keep the wrapper,
 * which is what supplies the frame and the aspect ratio. The zoom on hover
 * needs a `group` ancestor around the frame.
 */
export default function ProjectImage({
  project,
  index,
  variant = "standard",
  className = "",
}: {
  project: Project;
  index: number;
  variant?: Variant;
  className?: string;
}) {
  const { w, h, k } = FRAME[variant];
  // Pattern ids are document-global, so they carry the slug and the variant.
  const gridId = `${project.slug}-grid-${variant}`;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-foreground/15 bg-foreground/5 ${className}`}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className={`absolute inset-0 block size-full text-foreground transition-transform duration-500 ease-out motion-reduce:transition-none ${
          variant === "standard" ? "group-hover:scale-110" : "group-hover:scale-106"
        }`}
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
        <rect width={w} height={h} fill={`url(#${gridId})`} />
        <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45">
          {MOTIFS[project.motif](w, h, k)}
        </g>
        <text
          x="14"
          y={h - 14}
          fill="currentColor"
          fontSize={46 * k}
          fontWeight="900"
          opacity="0.12"
        >
          {String(index + 1).padStart(2, "0")}
        </text>
      </svg>
    </div>
  );
}
