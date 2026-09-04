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
import GlobeKey from "@/components/GlobeKey";

export default function Globe() {
  return (
    <section
      data-panel
      className="relative grid min-h-screen grid-rows-[auto_1fr_auto] p-8 md:p-16 xl:p-24"
    >

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

      {/* The key, the pins, and the caption that steps aside for them. */}
      <GlobeKey />
    </section>
  );
}
