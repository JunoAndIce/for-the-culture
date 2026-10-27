export type Member = {
  slug: string;
  name: string;
  title: string;
  /** The branch this person leads. */
  branch: string;
  bio: string;
};

export const CEO: Member = {
  slug: "ceo",
  name: "Founder Name",
  title: "Founder & CEO",
  branch: "Executive",
  bio: "Started For the Culture to give creators a place to build with people who take their work seriously. Sets the direction, holds the standard and signs off on everything we put our name on.",
};

/** The board. Each member leads one branch of the company. */
export const BOARD: readonly Member[] = [
  {
    slug: "technology",
    name: "Board Member",
    title: "Head of Technology & Software",
    branch: "Technology & Software",
    bio: "Leads the engineers and designers behind our 3D sites, apps and tools, and the standards they ship to.",
  },
  {
    slug: "marketing",
    name: "Board Member",
    title: "Head of Marketing",
    branch: "Marketing",
    bio: "Shapes how our brands and clients are seen: campaigns, search, social and the story behind each launch.",
  },
  {
    slug: "public-relations",
    name: "Board Member",
    title: "Head of Public Relations",
    branch: "Public Relations",
    bio: "Builds the relationships with press, partners and community that carry the culture past our own channels.",
  },
  {
    slug: "finance",
    name: "Board Member",
    title: "Head of Finance & Treasurer",
    branch: "Finance",
    bio: "Keeps the books honest and the funding steady, so every branch and every brand we back can plan past next quarter.",
  },
];

export const LEGACY = [
  {
    n: "01",
    title: "Careers",
    body: "Every branch hires. We take portfolios over CVs, pay our interns and answer every application.",
  },
  {
    n: "02",
    title: "Joining",
    body: "Come in as a designer, builder, writer or organiser. You start with a real project and a board member in your corner.",
  },
  {
    n: "03",
    title: "Legacy",
    body: "We are building something meant to outlast us: skills handed on, brands that keep running, and a seat saved for whoever is next.",
  },
] as const;
