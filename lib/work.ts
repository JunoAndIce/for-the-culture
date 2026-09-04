/**
 * Single source for the work and the voices. The Projects and Testimonials
 * panels show the short form; /affiliations shows the rest.
 */

// Placeholder work. The three clients are the ones already quoted below, so
// the panels and the page read as the same agency.
export const PROJECTS = [
  {
    slug: "kyro-bros",
    name: "Kyro & Bros.",
    discipline: "Brand system, storefront, ops handover",
    summary:
      "A logistics startup with three trucks and no name. We built the brand, the booking flow, and the dispatch playbook their team still runs on.",
    detail:
      "They came in with three trucks, a spreadsheet, and customers who only knew the drivers' first names. We started with the operation rather than the logo: how a job gets booked, who touches it, and where it falls apart on a bad week. The brand came out of that, and so did the booking flow. Six months after handover they hired their own operations lead and stopped calling us, which is the outcome we were aiming at.",
    badges: ["Branding", "Next.js", "Design System", "Copywriting"],
    year: "2025",
    build: "11 wks",
    outcome: "4x booking volume",
    motif: "orbit",
  },
  {
    slug: "halcyon-labs",
    name: "Halcyon",
    discipline: "Positioning and launch site",
    summary:
      "Research tooling that needed to read as a product, not a paper. We found the story first, then built the site their sales team still leads with.",
    detail:
      "The tooling was good and nobody could tell you what it was for. We spent the first three weeks in calls with their customers, not their founders, and came back with the sentence the company now opens with. The site was the easy part after that. Two years on, the positioning has outlived two rounds of funding and a full rebrand of the category around them.",
    badges: ["Positioning", "Web Design", "Motion", "Analytics"],
    year: "2024",
    build: "6 wks",
    outcome: "Launched on schedule",
    motif: "contour",
  },
  {
    slug: "copperline",
    name: "Copperline",
    discipline: "Identity refresh and enablement",
    summary:
      "A twenty-year-old fabricator modernising without losing the shop-floor voice. We rebuilt the identity, then taught them to run it themselves.",
    detail:
      "Twenty years of goodwill sat in a logo nobody could print at size. The risk was obvious: modernise it and lose the thing that made customers trust them. So we kept the marks the shop floor recognised, rebuilt everything around them, and then spent the last three weeks teaching their team to run it. They have not needed us since, and they tell people that.",
    badges: ["Identity", "Print", "Art Direction", "Enablement"],
    year: "2024",
    build: "9 wks",
    outcome: "No retainer needed",
    motif: "stack",
  },
] as const;

export type Project = (typeof PROJECTS)[number];

// `since` is a checkable outcome, not a claim: a real number the client would
// confirm on a call, or the line comes out. Never soften it.
export const TESTIMONIALS = [
  {
    quote:
      "They took a name on a napkin and handed back a company. Brand, site, and filings done before our first customer call.",
    name: "Marcus Reed",
    role: "Founder, Reed & Co.",
    since: "Second location open, 14 months from launch.",
  },
  {
    quote:
      "The only agency we've worked with that asked about our margins before our logo. It showed in everything after.",
    name: "Alina Vasquez",
    role: "COO, Northbound",
    since: "Cost per lead halved in a quarter.",
  },
  {
    quote:
      "We launched in six weeks. The positioning work is still what our sales team leads with two years on.",
    name: "Devon Blake",
    role: "CEO, Halcyon Labs",
    since: "Live in six weeks, same positioning two years on.",
  },
  {
    quote:
      "They built the thing, then taught us to run it. No lock-in, no retainer we didn't ask for.",
    name: "Priya Raman",
    role: "Director, Copperline",
    since: "Running their own campaigns since month four.",
  },
  {
    quote:
      "Our first hire read the brand guide and knew what we stood for. That saved us a month of onboarding.",
    name: "Theo Okafor",
    role: "Partner, Vantage Group",
    since: "Onboarding down from three weeks to four days.",
  },
] as const;

/** Placeholder slots — swap the label for a logo <Image> as partners are signed. */
export const AFFILIATIONS = [
  "Kyro & Bros.",
  "HWY6 Studios",
  "Halcyon Labs",
  "Studio Meridian",
  "Copperline",
  "Vantage Group",
] as const;
