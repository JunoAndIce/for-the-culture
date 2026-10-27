"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { BREAKPOINT_MD, SERVICE_DECK } from "@/lib/choreography";
import { SERVICES } from "@/lib/services";
import { resetSphereTurn, turnSphereTo } from "@/lib/sphereTurn";

const pad = (i: number) => String(i + 1).padStart(2, "0");
const last = SERVICES.length - 1;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The deck runs sideways from md up and down its own box below it; CSS decides.
const across = (track: HTMLElement | null) =>
  !!track && getComputedStyle(track).flexDirection === "row";
const cardsOf = (track: HTMLElement | null) =>
  Array.from(track?.children ?? []) as HTMLElement[];

function scrollToCard(track: HTMLElement | null, i: number, instant = false) {
  const card = cardsOf(track)[Math.max(0, Math.min(last, i))];
  if (!track || !card) return;
  const row = across(track);
  const to = row ? card.offsetLeft : card.offsetTop;

  // Killed first, so a superseded glide hands snapping back before this one takes it.
  gsap.killTweensOf(track);
  if (instant || reduced()) {
    if (row) track.scrollLeft = to;
    else track.scrollTop = to;
    return;
  }

  // Snapping would grab every frame of the tween, so it sits the glide out.
  const snapBack = () => {
    track.style.scrollSnapType = "";
  };
  track.style.scrollSnapType = "none";
  const crossed = Math.abs(to - (row ? track.scrollLeft : track.scrollTop)) / (row ? card.offsetWidth : track.clientHeight);
  const { glide, glidePerCard, glideMax } = SERVICE_DECK;
  gsap.to(track, {
    scrollTo: { [row ? "x" : "y"]: to, autoKill: true, onAutoKill: snapBack },
    duration: Math.min(glideMax, glide + glidePerCard * crossed),
    ease: "power3.inOut",
    onComplete: snapBack,
    onInterrupt: snapBack,
  });
}

/** Across, the cards beside the active one fade back and shrink a touch. */
function focusCards(track: HTMLElement | null, active: number, animate: boolean) {
  const list = cardsOf(track);
  if (!across(track)) {
    gsap.set(list, { clearProps: "opacity,transform" });
    return;
  }
  list.forEach((card, i) => {
    const to = { opacity: i === active ? 1 : 0.4, scale: i === active ? 1 : 0.97 };
    if (animate && !reduced()) gsap.to(card, { ...to, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    else gsap.set(card, to);
  });
}

/** The active dot stretches; the rest shrink back to dots. */
function stretchDots(dots: HTMLElement | null, active: number, animate: boolean) {
  Array.from(dots?.children ?? []).forEach((dot, i) =>
    gsap.to(dot, {
      width: i === active ? 20 : 6,
      duration: animate && !reduced() ? 0.45 : 0,
      ease: "back.out(2.5)",
      overwrite: true,
    }),
  );
}

/** An arrow's icon leans the way it points while hovered. */
function nudge(e: React.PointerEvent<HTMLElement>, x: number) {
  if (reduced()) return;
  gsap.to(e.currentTarget.firstElementChild, { x, duration: 0.3, ease: x ? "power2.out" : "back.out(3)", overwrite: true });
}

/** The card under the focus line, or the last once the end is reached. */
function cardInFocus(track: HTMLElement) {
  const row = across(track);
  const pos = row ? track.scrollLeft : track.scrollTop;
  const size = row ? track.clientWidth : track.clientHeight;
  const max = (row ? track.scrollWidth : track.scrollHeight) - size;
  if (pos >= max - 2) return last;
  let i = 0;
  cardsOf(track).forEach((card, k) => {
    if ((row ? card.offsetLeft : card.offsetTop) <= pos + size * SERVICE_DECK.focus) i = k;
  });
  return i;
}

/** The icon pops; across, the copy rises and the list ticks in after it. */
function buildCard(track: HTMLElement | null, i: number) {
  const card = cardsOf(track)[i];
  if (!card || reduced()) return;
  const q = gsap.utils.selector(card);
  const tl = gsap.timeline();
  tl.fromTo(q("[data-pop]"), { scale: 0.4, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(3)" });
  // The phone's box is read while it scrolls, so only the icon moves there.
  if (!across(track)) return;
  tl.fromTo(q("[data-rise]"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out", stagger: 0.07 }, 0.05)
    .fromTo(q("li"), { x: -10, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out", stagger: 0.07 }, 0.25);
}

/** The red pill glides to the active tab, and the row keeps that tab in view. */
function placePill(pill: HTMLElement | null, tab: HTMLElement | null | undefined, row: HTMLElement | null, animate: boolean) {
  if (!pill || !tab || !row) return;
  const to = { x: tab.offsetLeft, y: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight };
  if (animate && !reduced()) gsap.to(pill, { ...to, duration: 0.5, ease: "back.out(1.7)", overwrite: true });
  else gsap.set(pill, to);

  const out = tab.offsetLeft < row.scrollLeft || tab.offsetLeft + tab.offsetWidth > row.scrollLeft + row.clientWidth;
  if (out) {
    const x = Math.max(0, tab.offsetLeft - 16);
    gsap.to(row, { scrollTo: { x }, duration: animate && !reduced() ? 0.5 : 0, ease: "power2.out", overwrite: true });
  }
}

/**
 * The five services as one deck: a row with side arrows from md up, a box that
 * scrolls on its own below it. Same DOM both ways.
 */
export default function ServiceDeck() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tabRow = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const settle = useRef<number | null>(null);
  const built = useRef(-1);
  const placed = useRef(false);
  // Where the deck is headed, so a second click mid-glide goes one further.
  const aim = useRef(0);
  const [active, setActive] = useState(0);

  const go = (i: number) => {
    aim.current = Math.max(0, Math.min(last, i));
    scrollToCard(track.current, aim.current);
  };

  // A card builds once it has landed, not while it is still sliding past.
  const land = (i: number) => {
    aim.current = i;
    if (built.current === i) return;
    built.current = i;
    buildCard(track.current, i);
  };

  const onScroll = () => {
    if (!track.current) return;
    const i = cardInFocus(track.current);
    setActive(i);
    if (settle.current) window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => land(i), SERVICE_DECK.settle * 1000);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!across(track.current)) return;
    if (e.key === "ArrowRight") go(aim.current + 1);
    else if (e.key === "ArrowLeft") go(aim.current - 1);
    else return;
    e.preventDefault();
  };

  // Arriving on /overview#slug opens that card and brings the deck into view.
  useEffect(() => {
    const i = SERVICES.findIndex(({ slug }) => `#${slug}` === window.location.hash);
    const frame = requestAnimationFrame(() => {
      if (i > 0) {
        aim.current = i;
        scrollToCard(track.current, i, true);
      }
      if (i >= 0) root.current?.scrollIntoView({ block: "start" });
      if (i <= 0 && built.current !== 0) {
        built.current = 0;
        buildCard(track.current, 0);
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      if (settle.current) window.clearTimeout(settle.current);
      resetSphereTurn();
    };
  }, []);

  useEffect(() => {
    turnSphereTo(active);
    placePill(pill.current, tabs.current[active], tabRow.current, placed.current);
    focusCards(track.current, active, placed.current);
    stretchDots(dots.current, active, placed.current);
    placed.current = true;
  }, [active]);

  // Crossing md turns the deck's axis; the cards' focus applies across only.
  useEffect(() => {
    const md = window.matchMedia(`(min-width: ${BREAKPOINT_MD}px)`);
    const onChange = () => track.current && focusCards(track.current, cardInFocus(track.current), false);
    md.addEventListener("change", onChange);
    return () => md.removeEventListener("change", onChange);
  }, []);

  // Late fonts and resizes change the tabs' widths under the pill.
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!track.current) return;
      placePill(pill.current, tabs.current[cardInFocus(track.current)], tabRow.current, false);
    });
    tabs.current.forEach((tab) => tab && observer.observe(tab));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={root}
      id="services"
      data-sphere-turn
      aria-label="Services"
      className="mt-12 scroll-mt-28 md:mt-16 md:scroll-mt-32"
    >
      <nav aria-label="Jump to a service">
        <div
          ref={tabRow}
          className="relative -m-1.5 flex gap-2 overflow-x-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span
            ref={pill}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 rounded-full border border-red-500 bg-red-500/10"
          />
          {SERVICES.map(({ slug, name }, i) => (
            <button
              key={slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              onClick={() => go(i)}
              aria-current={i === active}
              className="relative shrink-0 rounded-full border border-foreground/15 px-4 py-2 font-mono text-[0.6rem] tracking-[0.18em] whitespace-nowrap text-foreground/60 uppercase transition-colors hover:text-foreground aria-current:border-transparent aria-current:text-foreground md:text-[0.65rem]"
            >
              <span className="mr-2 text-red-700 dark:text-red-500">{pad(i)}</span>
              {name}
            </button>
          ))}
        </div>
      </nav>

      <div className="mt-6 md:flex md:items-center md:gap-4 lg:gap-6">
        <button
          type="button"
          onClick={() => go(aim.current - 1)}
          onPointerEnter={(e) => nudge(e, -3)}
          onPointerLeave={(e) => nudge(e, 0)}
          disabled={active === 0}
          aria-label="Previous service"
          className="hidden size-11 shrink-0 place-items-center rounded-full border border-foreground/30 bg-background/80 text-foreground transition-colors hover:border-foreground disabled:pointer-events-none disabled:opacity-25 md:grid"
        >
          <ArrowLeft className="size-4" strokeWidth={1.6} />
        </button>

        <div
          ref={track}
          tabIndex={0}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          role="region"
          aria-roledescription="carousel"
          aria-label="Services, one card each"
          className="relative flex h-[68svh] min-w-0 flex-col gap-3 overflow-y-auto pb-16 [mask-image:linear-gradient(to_bottom,black_85%,transparent)] snap-y snap-proximity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 md:h-auto md:flex-1 md:flex-row md:gap-6 md:overflow-x-auto md:overflow-y-hidden md:pb-0 md:[mask-image:none] md:snap-x md:snap-mandatory md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map(({ slug, icon: Icon, name, body, detail, includes, outcome }, i) => (
            <article
              key={slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${pad(i)} of ${pad(last)}: ${name}`}
              onClick={() => i !== active && across(track.current) && go(i)}
              // The rest pose by index is for first paint; focusCards owns opacity and scale after.
              className={`shrink-0 snap-start rounded-2xl border border-foreground/15 bg-background/80 p-5 backdrop-blur-sm md:w-[74%] md:p-8 lg:p-10 ${
                i === active ? "md:border-foreground/30" : "md:cursor-pointer"
              } ${i > 0 ? "md:opacity-40 md:[transform:scale(0.97)]" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-red-700 dark:text-red-500">
                  {pad(i)}
                </span>
                <span
                  data-pop
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-red-500/40 bg-red-500/10"
                >
                  <Icon aria-hidden="true" strokeWidth={1.6} className="size-4 text-red-700 dark:text-red-500" />
                </span>
                <h2 className="text-[0.7rem] tracking-widest text-foreground uppercase md:text-xs">{name}</h2>
                <span className="ml-auto font-mono text-[0.6rem] tracking-[0.2em] text-foreground/40">
                  {pad(i)} / {pad(last)}
                </span>
              </div>

              <p
                data-rise
                className="mt-5 max-w-2xl text-[clamp(1.15rem,2.2vw,1.75rem)] leading-[1.15] font-bold tracking-tight text-balance"
              >
                {body}
              </p>
              <p data-rise className="mt-3 max-w-2xl font-mono text-xs leading-relaxed text-foreground/70 md:text-[0.8rem]">
                {detail}
              </p>

              <p data-rise className="mt-6 font-mono text-[0.6rem] tracking-[0.28em] text-foreground/40 uppercase">
                What you get
              </p>
              <ul className="mt-2 grid border-t border-foreground/15 sm:grid-cols-2 sm:gap-x-8">
                {includes.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2 border-b border-foreground/15 py-2.5 text-xs leading-relaxed font-light text-foreground/70"
                  >
                    <span aria-hidden="true" className="text-red-700 dark:text-red-500">
                      +
                    </span>
                    {line}
                  </li>
                ))}
              </ul>

              <p data-rise className="mt-4 text-[0.7rem] leading-relaxed tracking-wide text-foreground/55">
                {outcome}
              </p>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(aim.current + 1)}
          onPointerEnter={(e) => nudge(e, 3)}
          onPointerLeave={(e) => nudge(e, 0)}
          disabled={active === last}
          aria-label="Next service"
          className="hidden size-11 shrink-0 place-items-center rounded-full border border-foreground/30 bg-background/80 text-foreground transition-colors hover:border-foreground disabled:pointer-events-none disabled:opacity-25 md:grid"
        >
          <ArrowRight className="size-4" strokeWidth={1.6} />
        </button>
      </div>

      {/* Widths by index for first paint; stretchDots owns them after. */}
      <div ref={dots} className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
        {SERVICES.map(({ slug }, i) => (
          <span
            key={slug}
            className={`h-1.5 rounded-full ${i === 0 ? "w-5" : "w-1.5"} ${
              i === active ? "bg-red-700 dark:bg-red-500" : "bg-foreground/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
