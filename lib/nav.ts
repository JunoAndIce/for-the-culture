/**
 * Single source for the site's navigation. The header and the footer both read
 * this, so a link added in one place cannot go missing from the other.
 */
export const NAV_ITEMS = [
  "Overview",
  "Affiliations",
  "Projects",
  "Resources",
  "Family",
  "Contact Us",
] as const;
