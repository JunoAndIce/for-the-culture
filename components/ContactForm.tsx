"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { CONTACT_EMAIL } from "@/lib/contact";
import { SERVICES } from "@/lib/services";

const TOPICS = [
  ...SERVICES.map(({ slug, name }) => ({ slug, name })),
  { slug: "careers", name: "Careers" },
  { slug: "other", name: "Something else" },
];

const FIELD_LABEL = "font-mono text-[0.6rem] tracking-[0.28em] text-foreground/50 uppercase";
const FIELD =
  "mt-2 w-full border-b border-foreground/25 bg-transparent pb-2 text-base text-foreground transition-colors outline-none placeholder:text-foreground/30 focus:border-red-700 dark:focus:border-red-500";

/** No backend yet: the form drafts an email in the visitor's own mail app. */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  // `/contact?topic=<slug>` arrives with that topic picked.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("topic");
    const i = TOPICS.findIndex((topic) => topic.slug === slug);
    const radios = form.current?.querySelectorAll<HTMLInputElement>('input[name="topic"]');
    if (i >= 0 && radios?.[i]) radios[i].checked = true;
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const subject = `${get("topic")} — ${get("name")}`;
    const body = [
      get("message"),
      "",
      `${get("name")}${get("company") ? `, ${get("company")}` : ""}`,
      get("email"),
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form
      ref={form}
      onSubmit={onSubmit}
      className="rounded-2xl border border-foreground/15 bg-background/60 p-6 backdrop-blur-sm md:p-10"
    >
      <fieldset>
        <legend className={FIELD_LABEL}>What&apos;s it about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map(({ slug, name }, i) => (
            <label
              key={slug}
              className="cursor-pointer rounded-full border border-foreground/25 px-3.5 py-1.5 text-[0.7rem] tracking-[0.12em] text-foreground/70 uppercase transition-colors select-none hover:border-foreground/60 has-checked:border-foreground has-checked:bg-foreground has-checked:text-background has-focus-visible:ring-2 has-focus-visible:ring-red-700 dark:has-focus-visible:ring-red-500"
            >
              <input
                type="radio"
                name="topic"
                value={name}
                defaultChecked={i === 0}
                className="sr-only"
              />
              {name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-9 grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className={FIELD_LABEL}>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={FIELD} />
        </label>
        <label className="block">
          <span className={FIELD_LABEL}>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={FIELD}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={FIELD_LABEL}>
            Company <span className="text-foreground/30 normal-case tracking-normal">(optional)</span>
          </span>
          <input name="company" autoComplete="organization" placeholder="Who you're with" className={FIELD} />
        </label>
        <label className="block sm:col-span-2">
          <span className={FIELD_LABEL}>Tell us about it</span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="What you're making, where it stands, and when you'd like it out in the world."
            className={`${FIELD} resize-none leading-relaxed`}
          />
        </label>
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="font-mono text-[0.65rem] tracking-[0.12em] text-foreground/50">
          {sent ? "Your mail app should open with this drafted. Hit send there." : "Every message gets a reply."}
        </p>
        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition-colors hover:bg-foreground/80"
        >
          Send it
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </form>
  );
}
