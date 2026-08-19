/**
 * Single fixed scroll cue, mounted once at the page level like the navbar
 * rather than once per panel. Sits over the wireframe sphere, so it needs the
 * heavy stroke and dark drop shadow to stay legible against the mesh.
 *
 * Padding matches the panels' own padding so it lines up with their content edge.
 */
export default function ScrollChevron() {
  return (
    <div className="pointer-events-none fixed right-0 bottom-0 z-20 p-8 md:p-16 xl:p-24">
      <span
        aria-hidden="true"
        className="block animate-bounce text-foreground drop-shadow-[0_0_8px_var(--background)] motion-reduce:animate-none"
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  );
}
