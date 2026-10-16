import {
  ChartLine,
  MonitorPlay,
  Palette,
  Radio,
  Search,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source for the five services. The Services panel shows `body`; the
 * /overview route shows the rest, anchored by `slug`.
 */
export type Service = {
  slug: string;
  icon: LucideIcon;
  name: string;
  body: string;
  detail: string;
  includes: readonly string[];
  outcome: string;
};

export const SERVICES: readonly Service[] = [
  {
    slug: "traditional-media",
    icon: Radio,
    name: "Traditional Media",
    body: "Radio, print, and out-of-home. The buys that still own a neighbourhood.",
    detail:
      "A billboard on the right corner still beats a banner ad nobody scrolls past. We buy the spots that people actually pass on the way to work — drive-time radio, community print, transit, and the wall of the building everybody meets in front of. Rates are negotiated in your name and shown to you as we get them.",
    includes: [
      "Radio and podcast spots, written and produced",
      "Print, transit, and out-of-home placement",
      "Local sponsorship and event presence",
      "Rate negotiation with the numbers open to you",
    ],
    outcome:
      "Best when the neighbourhood needs to know your name before the internet does.",
  },
  {
    slug: "digital-media",
    icon: MonitorPlay,
    name: "Digital Media",
    body: "Paid social, video, and display, put in front of the people most likely to buy.",
    detail:
      "Every dollar goes somewhere you can see. We build the creative, run the buy, and cut what is not working while the campaign is still live instead of explaining it afterwards. Video is shot and edited in-house, so a spot can be reworked in a day rather than a quarter.",
    includes: [
      "Paid social across Meta, TikTok, and YouTube",
      "Short-form video, shot and cut in-house",
      "Display and retargeting that stops when it should",
      "Weekly reporting in plain English",
    ],
    outcome:
      "Best when you know who your customer is and need more of them this month.",
  },
  {
    slug: "search-seo",
    icon: Search,
    name: "Search & SEO",
    body: "Turn up first when somebody nearby searches for what you already sell.",
    detail:
      "Most of your customers are already looking for you. We make sure the search ends on your page: the listing, the map pin, the reviews, and a site fast enough that nobody backs out before it loads. Slow work, compounding returns, and it keeps paying after the spend stops.",
    includes: [
      "Local listing and map presence, claimed and cleaned",
      "On-page and technical fixes, speed included",
      "Content built around what people actually type",
      "Paid search where the organic climb is too slow",
    ],
    outcome: "Best when demand already exists and someone else is catching it.",
  },
  {
    slug: "branding-design",
    icon: Palette,
    name: "Branding & Design",
    body: "Name, mark, packaging, and a look that survives contact with the real world.",
    detail:
      "A logo is the smallest part of it. We build the whole kit — the mark, the type, the colours, the packaging, and the rules that keep it holding together once a dozen people are using it without us. It has to read on a phone, a shirt, and a shop window, so that is where we test it.",
    includes: [
      "Naming, mark, and full identity system",
      "Packaging, signage, and print collateral",
      "Web and social templates your team can run",
      "A brand guide short enough to be used",
    ],
    outcome: "Best at the start, or the moment the old look starts costing you.",
  },
  {
    slug: "strategy-research",
    icon: ChartLine,
    name: "Strategy & Research",
    body: "Who your customer is, what moves them, and what the last dollar brought back.",
    detail:
      "Before anything gets built we find out what is already true: who buys, who nearly buys, and who your competition is quietly losing. The output is a plan with a first move, a cost, and a number to judge it by — not a deck to admire.",
    includes: [
      "Customer and market research",
      "Competitive review of the people you actually lose to",
      "A prioritised plan with costs against it",
      "Measurement set up before the spend starts",
    ],
    outcome: "Best when the budget is real and the direction is not settled yet.",
  },
] as const;

// The way in. Numbered because it is a real sequence, and step one costs nothing.
export const STEPS = [
  {
    n: "01",
    title: "Tell us where you are",
    body: "One call. One meeting, Work begins.",
  },
  {
    n: "02",
    title: "Get the right people",
    body: "Who's important, what it costs, what we should bring back.",
  },
  {
    n: "03",
    title: "We run it",
    body: "Built and managed in-house, with the numbers open to you throughout.",
  },
] as const;

// Proof on one line. The stat grid this replaces cost a third of the panel.
export const PROOF = [
  "Low budget, big impact",
  "9-week median build",
  "100% Owned by You.",
] as const;
