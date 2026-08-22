/**
 * The globe panel — the one screen where the sphere stops being a backdrop and
 * becomes something to handle.
 *
 * The sphere itself lives in the fixed canvas behind every panel, so this
 * section contributes only the grab surface: a transparent circle sitting where
 * SPHERE_PATH parks the globe, marked `data-globe-stage` for useGlobeDrag to
 * find. Because that element exists on this panel and nowhere else, the drag
 * listeners are scoped to this screen by construction.
 */
export default function Globe() {
  return (
    <section
      data-panel
      className="relative grid min-h-screen grid-rows-[auto_1fr_auto] p-8 md:p-16 xl:p-24"
    >
      {/*
       * Centred on the section rather than placed in the grid, because it has
       * to line up with the globe, which is centred on the viewport. 80vmin
       * tracks the sphere's own size: its scale is set against the camera's
       * vertical field of view, so it grows and shrinks with the short edge too.
       *
       * touch-none takes both axes for the drag, so a vertical swipe tips the
       * globe instead of scrolling the page. It is the tilt limit in
       * useGlobeDrag that keeps this from being a trap: the drag runs out
       * rather than running on, so a swipe that meant to scroll ends in an
       * obviously stuck globe rather than a silently dead gesture. Touch still
       * scrolls in the bands above and below the circle.
       */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          data-globe-stage
          aria-hidden="true"
          className="pointer-events-auto h-[80vmin] w-[80vmin] cursor-grab touch-none rounded-full select-none data-[grabbing]:cursor-grabbing"
        />
      </div>

      <h2 className="relative flex items-center justify-center gap-4 text-2xl font-extralight tracking-widest uppercase md:gap-6 md:text-5xl md:mt-8 mt-12 text-center">
        <span
          aria-hidden="true"
          className="shrink-0 text-sm text-foreground/40 select-none"
        >
          &bull;
        </span>
        <span>Built in Texas,<br />felt everywhere</span>
        <span
          aria-hidden="true"
          className="shrink-0 text-sm text-foreground/40 select-none"
        >
          &bull;
        </span>
      </h2>

      <div className="relative row-start-3 flex flex-col items-center gap-4 text-center">
        <p className="max-w-2xl text-xs leading-relaxed font-bold text-foreground/70 md:text-lg">
          Our partners run out of Lagos, Lisbon, and Little Rock. The work
          travels further than we do, and it is meant to.
        </p>
        <p className="text-[0.65rem] tracking-[0.3em] text-foreground/50 uppercase md:text-xs">
          Drag to spin the globe
        </p>
      </div>
    </section>
  );
}
