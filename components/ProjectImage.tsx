import type { Project } from "@/lib/work";

// One line-art figure per project, so switching visibly changes the frame
// rather than swapping one grey box for an identical one.
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
export default function ProjectImage({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  // Pattern ids are document-global, so they carry the slug.
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
