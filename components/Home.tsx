export default function Home() {
  return (
    <section
      data-panel
      className="grid min-h-screen grid-rows-[1fr_auto] p-8 md:p-16 xl:p-24"
    >
      <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
        <p className="font-script text-[clamp(3.5rem,11vw,16rem)] leading-none">
          For the Culture
        </p>
        <p className="font-inter text-xs md:text-2xl font-black uppercase">
          FTC Enterprises
        </p>
        <p className="font-inter text-lg md:text-4xl font-light uppercase">
          Let us build your vision together.
        </p>
        <p className="font-inter text-xs md:text-sm font-light uppercase md:w-[75ch] mt-4 md:mt-8">
          For The Culture is a full-service creative agency specializing in web
          design, branding, and digital marketing. We help businesses and
          individuals bring their ideas to life through innovative design and
          strategic marketing solutions.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4 md:mt-8 md:justify-start">
          <a
            href="#"
            className="rounded-lg border border-white/40 px-6 py-3 font-inter text-xs tracking-widest text-white uppercase transition-colors hover:border-white hover:bg-white/10"
          >
            Learn More
          </a>
          <a
            href="#"
            className="rounded-lg bg-white px-6 py-3 font-inter text-xs tracking-widest text-black uppercase transition-colors hover:bg-white/80"
          >
            Join Us
          </a>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <address className="font-inter text-xs leading-relaxed text-white/60 not-italic">
          Based in Texas
          <br />
          Serving Worldwide
          <br />
          &copy; FTC 2026
        </address>
      </div>
    </section>
  );
}
