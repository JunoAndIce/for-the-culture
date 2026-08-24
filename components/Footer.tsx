import { NAV_ITEMS } from "@/lib/nav";

/**
 * Closes the page out. Deliberately NOT a [data-panel] section: the sphere
 * choreography counts panels and maps them to SPHERE_PATH by index, so marking
 * this one would shift every state by a step. It also carries a solid
 * background, which is what ends the fixed canvas rather than letting the globe
 * run under the small print.
 */
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-foreground/10 bg-background px-8 py-14 md:px-16 md:py-16 xl:px-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-script text-5xl leading-none">For the Culture</p>
          <address className="mt-4 text-xs leading-relaxed text-foreground/60 not-italic">
            Based in Texas
            <br />
            Serving Worldwide
          </address>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-xs tracking-widest uppercase sm:grid-cols-3">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="whitespace-nowrap text-foreground/70 transition-colors hover:text-foreground"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-foreground/10 pt-6 text-xs text-foreground/50 md:flex-row md:items-center md:justify-between">
        <p>&copy; 2026 For the Culture. All rights reserved.</p>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>
            Designed and Built by For the Culture&apos;s In-House Team
          </span>
          <span aria-hidden="true" className="text-foreground/25 select-none">
            &bull;
          </span>
          <span>
            Engineered by{" "}
            <span className="text-foreground/80">Juno &amp; Ice</span>
          </span>
        </p>
      </div>
    </footer>
  );
}
