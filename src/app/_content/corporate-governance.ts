import type { SubPageNavProps } from '@/components/sections/sub-page';
import type { DataTableColumn } from '@/components/ui/data-table';
import { TODO_CONTENT } from '@/lib/config/site';
import { areaNav, investorPage, listingOf, type InvestorPage, type PageMeta } from './investors';

/**
 * The Corporate Governance area's static content: its index, its eight
 * pages, and the frames of its two tables.
 *
 * **Transcribed from the legacy https://www.sael.co/investors/corporate-governance/
 * and its eight sub-pages**, read from their raw HTML on 2026-09-30 with only
 * the source's whitespace collapsed. /CLAUDE.md §2 rule 3.
 *
 * What is *not* here is dynamic and comes from the repository: the six
 * document listings (`category: 'corporate-governance'`, one `section` per
 * page), the board (`getBoardMembers`) and the committees
 * (`getBoardCommittees`). The board is a repository surface rather than copy
 * because it changes by resolution and must be current on the site within
 * days of a change — see `ContentRepository.getBoardMembers`.
 *
 * None of the eight legacy pages carries a consent notice, and none does
 * here.
 */

export const GOVERNANCE_PATH = '/investors/corporate-governance/';

export const governanceIndex: { meta: PageMeta; title: string } = {
  meta: { title: 'Corporate Governance - SAEL', description: TODO_CONTENT },
  title: 'Corporate Governance',
};

const listing = (section: string) => listingOf('corporate-governance', section);

/** The eight, keyed for the pages that import them. */
export const governancePages = {
  boardOfDirectors: investorPage(
    GOVERNANCE_PATH,
    'board-of-directors',
    'Board of Directors',
    'Board of Directors - SAEL',
    null,
  ),
  boardCommittees: investorPage(
    GOVERNANCE_PATH,
    'board-committees',
    'Board Committees',
    'Board Committees - SAEL',
    null,
  ),
  codesAndPolicies: investorPage(
    GOVERNANCE_PATH,
    'codes-and-policies',
    'Codes & Policies',
    'Codes & Policies - SAEL',
    listing('codes-and-policies'),
  ),
  sustainabilityReports: investorPage(
    GOVERNANCE_PATH,
    'sustainability-reports',
    'Sustainability Reports',
    'Sustainability Reports - SAEL',
    listing('sustainability-reports'),
  ),
  csr: investorPage(GOVERNANCE_PATH, 'csr', 'CSR', 'CSR - SAEL', listing('csr')),
  generalMeeting: investorPage(
    GOVERNANCE_PATH,
    'general-meeting',
    'General Meeting',
    'General Meeting - SAEL',
    listing('general-meeting'),
  ),
  familiarizationProgramme: investorPage(
    GOVERNANCE_PATH,
    'familiarization-programme',
    'Familiarization Programme',
    'Familiarization Programme - SAEL',
    listing('familiarization-programme'),
  ),
  otherDocuments: investorPage(
    GOVERNANCE_PATH,
    'other-documents',
    'Other Documents',
    'Other Documents - SAEL',
    listing('other-documents'),
  ),
} as const satisfies Record<string, InvestorPage>;

/** In the legacy order — the index's tiles and the side list, which agree. */
export const governancePageList: readonly InvestorPage[] = [
  governancePages.boardOfDirectors,
  governancePages.boardCommittees,
  governancePages.codesAndPolicies,
  governancePages.sustainabilityReports,
  governancePages.csr,
  governancePages.generalMeeting,
  governancePages.familiarizationProgramme,
  governancePages.otherDocuments,
];

/** The side list — the legacy `<h3>` "Corporate Governance" over the eight. */
export function governanceNav(current: InvestorPage): SubPageNavProps {
  return areaNav('Corporate Governance', governancePageList, current);
}

/**
 * The Board of Directors table's frame: its heading (the legacy `<h3>`,
 * which repeats the page title and is kept, as on Offer Documents) and its
 * headers. "About" heads the column of toggles, each opening a director's
 * biography in a full-width row — the legacy "+" arrangement.
 */
export const boardTable: {
  heading: string;
  columns: readonly DataTableColumn[];
  detailColumn: string;
} = {
  heading: 'Board of Directors',
  columns: [{ label: 'Name' }, { label: 'Designation' }],
  detailColumn: 'About',
};

/** Every committee table's headers, verbatim — the same on all six. */
export const committeeColumns: readonly DataTableColumn[] = [
  { label: 'Name of the Member(s)' },
  { label: 'Category' },
  { label: 'Designation' },
];

/**
 * General Meeting's headings, in the legacy order, declared because the last
 * of them — "Postal Ballot" — has nothing under it on the legacy page and so
 * could never come from the documents. It is a heading the company
 * publishes, and it renders as one, alone.
 */
export const generalMeetingHeadings: readonly string[] = [
  'Annual General',
  'Extra-Ordinary General Meeting',
  'Postal Ballot',
];
