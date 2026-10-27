/**
 * Single source for the work and the voices. The Projects and Testimonials
 * panels show the short form; /affiliations shows the work and BACKED.
 */

// Placeholder work. Order here is the carousel order. /affiliations shows only
// Kyro & Bros. from here, the one brand FTC launched itself.
export const PROJECTS = [
  {
    slug: "kyro-bros",
    name: "Kyro & Bros.",
    discipline: "Brand system, rental storefront, ops handover",
    summary:
      "Three founders renting tents, tables and chairs out of what started as their own family's backyard setup. We built the brand, the storefront and the playbook that turned a favour into a Houston business.",
    detail:
      "Quay, Meagan and Chance had been running other people's parties long before there was a company, and the whole operation still moved over text message. We named the three rental packages and put the day rates in public, so the first question stopped being what does this cost and became which weekend. The brand came straight off their own line, built on family and driven by community, and the cards, the tent banners and the site all say what the family already said.",
    badges: ["Branding", "Business Cards", "Rental Storefront", "Ops Playbook"],
    year: "2026",
    build: "4 wks",
    outcome: "4x More Bookings",
    motif: "orbit",
  },
  {
    slug: "hwy6-studios",
    name: "HWY6 Studios",
    discipline: "Backed by FTC",
    summary:
      "A Houston creative collective working across film, fashion, athletics and community. It was already making work when we met, and we fund it.",
    detail:
      "With that backing HWY6 has launched two brands of its own, SHERUNSHOUSTON and 6athletics.",
    badges: ["Funding", "SHERUNSHOUSTON", "6athletics"],
    year: "2025",
    build: "Ongoing",
    outcome: "Two brands launched with our backing",
    motif: "stack",
  },
] as const;

export type Project = (typeof PROJECTS)[number];

/** A brand HWY6 launched while FTC was funding it. */
export type BackedBrand = {
  slug: string;
  name: string;
  tagline?: string;
  launched: string;
  summary: string;
  /** What the media slot should hold, until the real file is in. */
  media: string;
  link?: { label: string; href: string };
};

// HWY6 was running before FTC. FTC funds it, and these two launched with that backing.
export const BACKED = {
  slug: "hwy6-studios",
  name: "HWY6 Studios",
  site: { label: "Visit hwy6studios.com", href: "https://www.hwy6studios.com" },
  summary:
    "A Houston creative collective working across film, fashion, athletics and community. It was already making work when we met. We fund it, and with that backing it has started two brands of its own.",
  brands: [
    {
      slug: "sherunshouston",
      name: "SHERUNSHOUSTON",
      tagline: "For the women who run this city.",
      launched: "Launched November 2025",
      summary:
        "A brand for the women who run Houston, opened with a campaign film starring seven of them.",
      media: "SHERUNSHOUSTON launch film, 16:10 loop",
      link: {
        label: "Watch the launch film",
        href: "https://www.instagram.com/p/DQ-taF0Dcs_/",
      },
    },
    {
      slug: "6athletics",
      name: "6athletics",
      launched: "Launched with our backing",
      summary:
        "HWY6's athletics brand: the sport side of the collective, built for Houston's athletes and the people who train with them.",
      media: "6athletics, 16:10 photo or loop",
    },
  ] satisfies BackedBrand[],
  /** Already part of HWY6 before FTC came in. */
  earlier: ["hwy6archives", "hwy6casting", "hwy6tribe"],
};

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
