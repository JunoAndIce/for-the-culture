/**
 * Single source for the work and the voices. The Projects and Testimonials
 * panels show the short form; /affiliations shows the rest.
 */

// Placeholder work. Order here is the carousel order, and /affiliations makes
// the first entry its hero, so the strongest build goes first.
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
    slug: "powerwash",
    name: "Hydro Cleaning",
    discipline: "Physical Media and Website Launch",
    summary:
      "A Baton Rouge powerwashing company with two owners, a trailer, and no way for a neighbor to find them. We set them on For The Culture's path.",
    detail:
      "Christopher and Jered had the trailer, the insurance and the work ethic before they had a name anyone could repeat. We built the mark, the flyers and the door hangers first, because that is what a neighborhood actually sees, then the site to catch everyone the paper reached. The rate card went out front instead of behind a form, which is why the calls that come in now already know what a roof runs.",
    badges: ["Brand Identity", "Physical Media", "Web Design", "Analytics"],
    year: "2026",
    build: "4 wks",
    outcome: "2000+ site visits monthly",
    motif: "contour",
  },
  {
    slug: "hwy6-studios",
    name: "HWY6 Studios",
    discipline: "Collective identity, brand architecture, drop platform",
    summary:
      "A Houston creative collective working across film, fashion, athletics and community, running five brands nobody could tell were one. We built the system that holds them together.",
    detail:
      "hwy6studios, hwy6archives, hwy6casting, 6athletics and hwy6tribe had each grown their own audience and their own look, and the collective underneath them was invisible from the outside. We built one identity loose enough that each arm keeps its voice and still reads as 6, then a single site where the pop-ups, the archive and the drops sit on the same shelf. Someone who came for the Bottega project can now find the casting page without being told it exists.",
    badges: ["Identity", "Brand Architecture", "Drop Platform", "Art Direction"],
    year: "2025",
    build: "6 wks",
    outcome: "Five brands, one front door",
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
