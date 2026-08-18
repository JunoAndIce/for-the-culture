const FEATURES = [
  {
    title: "Brand Identity",
    body: "Naming, logo systems, and a visual language built to scale with you.",
  },
  {
    title: "Web & Product",
    body: "Sites and platforms designed, built, and shipped end to end.",
  },
  {
    title: "Go-To-Market",
    body: "Positioning, messaging, and launch campaigns that actually bear fruit.",
  },
  {
    title: "Operations Setup",
    body: "Entity formation, tooling, and process so you can run lean from day one.",
  },
  {
    title: "Creative Direction",
    body: "Art direction and content that keeps the brand coherent as it grows.",
  },
  {
    title: "Ongoing Advisory",
    body: "A partner on retainer well past the first milestone.",
  },
] as const;

export default function Services() {
  return (
    <section data-panel className="grid min-h-screen p-8 md:p-16 xl:p-24">
      <div className="flex flex-col justify-center md:items-end">
        <div className="flex flex-col items-center text-center md:mr-12 md:max-w-3xl xl:mr-24">
          <h2 className="flex items-center justify-center gap-4 font-inter text-2xl font-light tracking-widest uppercase md:gap-6 md:text-6xl">
            <span
              aria-hidden="true"
              className="shrink-0 text-sm text-white/40 select-none"
            >
              &bull;
            </span>
            <span>Start your dream with us</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-sm text-white/40 select-none"
            >
              &bull;
            </span>
          </h2>

          <p className="mt-5 max-w-2xl font-inter text-sm leading-relaxed font-light text-white/70 md:mt-8 md:text-lg">
            For the Culture is committed to helping you achieve your goals.
            Whether you&apos;re building a new website, creating a brand
            identity, or launching a marketing campaign, we have the expertise
            to help you succeed.
          </p>

          <ul className="mt-8 grid gap-x-12 gap-y-5 text-left sm:grid-cols-2 md:mt-16 md:gap-y-12">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50"
                />
                <div>
                  <h3 className="font-inter text-xs tracking-widest text-white uppercase md:text-sm">
                    {feature.title}
                  </h3>
                  <p className="mt-1 font-inter text-xs leading-relaxed font-light text-white/60 md:text-sm">
                    {feature.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="mt-8 rounded-lg border border-white/40 px-6 py-3 font-inter text-xs tracking-widest text-white uppercase transition-colors hover:border-white hover:bg-white/10 md:mt-10"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
