import type { SubPageNavProps } from '@/components/sections/sub-page';
import type { DocumentFilterCopy } from '@/components/ui/document-filter';
import { TODO_CONTENT } from '@/lib/config/site';
import type { InvestorDocumentCategory, InvestorListing } from '@/lib/content';

/**
 * What every investor area's content file shares: the page record, the side
 * list, and the functional copy the investor templates need.
 *
 * Offer Documents set the shape (`offer-documents.ts`); Corporate
 * Governance, Financials & Reports, Notifications and Investor Contact
 * follow it through these helpers rather than each restating them.
 */

/**
 * A page's `<title>` and description. Every `<title>` is the legacy page's
 * own, verbatim — "… - SAEL". Every legacy investor page ships
 * `<meta name="description" content="">`, so there is nothing to transcribe
 * and nothing is invented: `buildMetadata()` drops the marker rather than
 * emitting it.
 */
export interface PageMeta {
  title: string;
  description: string;
}

export interface InvestorPage {
  /** The last segment of the legacy URL. */
  slug: string;
  /** Root-relative, trailing slash — the legacy URL exactly. */
  path: string;
  /**
   * The page's name, verbatim. On the legacy site one string is the index
   * tile, the side-list entry and the `<h1>`, on every page.
   */
  name: string;
  meta: PageMeta;
  /** Where its documents live in the repository; `null` if it has none. */
  listing: InvestorListing | null;
}

/**
 * One investor page. `title` is written out at each call rather than
 * composed from `name`, so a reviewer can check it against the legacy
 * `<title>` without doing arithmetic.
 */
export function investorPage(
  areaPath: string,
  slug: string,
  name: string,
  title: string,
  listing: InvestorListing | null,
): InvestorPage {
  return {
    slug,
    path: `${areaPath}${slug}/`,
    name,
    meta: { title, description: TODO_CONTENT },
    listing,
  };
}

/** A listing addressed by its category alone — a category that is one page. */
export function listingOf(
  category: InvestorDocumentCategory,
  section: string | null = null,
): InvestorListing {
  return { category, section };
}

/** An area's side list: its heading over its pages, this one marked current. */
export function areaNav(
  label: string,
  pages: readonly InvestorPage[],
  current: InvestorPage,
): SubPageNavProps {
  return {
    label,
    items: pages.map(({ name, path }) => ({ name, href: path })),
    currentHref: current.path,
  };
}

/* ---------------------------------------------------------------------------
 * Functional copy — words the legacy site has no equivalent for, because
 * they name controls and states it did not have. Kept here so every investor
 * page says them the same way, and marked so they are not mistaken for
 * transcription.
 * ------------------------------------------------------------------------- */

/** The accessible name of the row of links to a page's headings. */
export const jumpLinksLabel = 'On this page';

/** A listing that failed to load or holds nothing. Our Team's wording. */
export const investorDocumentsEmpty = {
  title: 'Documents are unavailable',
  description: 'We could not load these documents just now. Please try again shortly.',
} as const;

/** A board or committee table that failed to load. Our Team's wording. */
export const governanceEmpty = {
  title: 'This information is unavailable',
  description: 'We could not load it just now. Please try again shortly.',
} as const;

/** The company filter on Standalone Financials of Material Subsidiary Companies. */
export const companyFilterCopy: DocumentFilterCopy = {
  label: 'Find a company',
  results: '{shown} of {total} documents',
  noMatches: 'No company matches that name.',
};
