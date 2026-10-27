import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Us — For the Culture",
  description:
    "Tell For the Culture what you're building. Based in Houston, Texas, working with brands worldwide.",
};

const LABEL =
  "font-mono text-[0.65rem] tracking-[0.35em] text-red-700 uppercase md:text-xs dark:text-red-500";
const SMALL_LABEL = "font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase";

const CHANNELS = [
  { label: "Studio", value: "Houston, Texas", note: "Serving worldwide" },
  { label: "Replies", value: "Within two working days", note: "Every message, every time" },
] as const;

export default function ContactPage() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-background/85" />
      <Navbar />

      <main className="relative z-10 px-5 pt-28 pb-20 md:px-16 md:pt-36 md:pb-28 xl:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <div className="flex flex-col">
              <p className={LABEL}>Contact us</p>
              <h1 className="mt-3 text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] font-bold tracking-tight text-balance">
                Let&apos;s build something{" "}
                <span className="font-script text-[1.35em] font-normal leading-none text-red-700 dark:text-red-500">
                  worth
                </span>{" "}
                talking about.
              </h1>
              <p className="mt-6 max-w-md font-mono text-xs leading-relaxed text-foreground/65 md:text-sm">
                Tell us what you&apos;re making and where it stands. The right
                people from our family will take it from there.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group mt-10 block border-t border-foreground/15 pt-5"
              >
                <span className={SMALL_LABEL}>Write to us</span>
                <span className="mt-2 block text-xl font-medium tracking-tight break-all transition-colors group-hover:text-red-700 md:text-2xl dark:group-hover:text-red-500">
                  {CONTACT_EMAIL}
                </span>
              </a>

              <dl className="mt-6 grid grid-cols-2 gap-6 border-t border-foreground/15 pt-5">
                {CHANNELS.map(({ label, value, note }) => (
                  <div key={label}>
                    <dt className={SMALL_LABEL}>{label}</dt>
                    <dd className="mt-2 text-sm font-medium">{value}</dd>
                    <dd className="mt-0.5 text-xs text-foreground/50">{note}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 border-t border-foreground/15 pt-5 text-xs text-foreground/60">
                Looking to join us instead?{" "}
                <Link
                  href="/family#join"
                  className="text-foreground underline decoration-red-700 underline-offset-4 dark:decoration-red-500"
                >
                  Meet the family
                </Link>
              </p>
            </div>

            <ContactForm />
          </div>

          <section
            aria-labelledby="faq-heading"
            className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-[1fr_2fr] lg:gap-16"
          >
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className={LABEL}>FAQ</p>
              <h2
                id="faq-heading"
                className="mt-3 text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.08] font-bold tracking-tight text-balance"
              >
                <span>Before you ask.</span>{" "}
                <span className="text-foreground/50">The questions we hear most.</span>
              </h2>
            </div>
            <Faq />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
