/**
 * Single source for the site's navigation. The header and the footer both read
 * this, so a link added in one place cannot go missing from the other.
 *
 * `#` marks a destination that has no route yet.
 */
export const NAV_ITEMS = [
  { label: "Overview", href: "/overview" },
  { label: "Affiliations", href: "/affiliations" },
  { label: "Resources", href: "#" },
  { label: "Family", href: "#" },
  { label: "Contact Us", href: "#" },
] as const;
