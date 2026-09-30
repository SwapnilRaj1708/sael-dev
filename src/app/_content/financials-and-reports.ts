import type { SubPageNavProps } from '@/components/sections/sub-page';
import { TODO_CONTENT } from '@/lib/config/site';
import { areaNav, investorPage, listingOf, type InvestorPage, type PageMeta } from './investors';

/**
 * The Financials & Reports area's static content: its index and five pages.
 *
 * **Transcribed from the legacy https://www.sael.co/investors/financials-and-reports/
 * and its five sub-pages**, read from their raw HTML on 2026-09-30 with only
 * the source's whitespace collapsed — every name and `<title>` verbatim,
 * "&" and all. /CLAUDE.md §2 rule 3.
 *
 * The documents — titles, years, files — are dynamic and come from the
 * repository, one category per page (docs/api-contracts.md §3). None of the
 * five pages carries a consent notice on the legacy site, and none does here.
 */

export const FINANCIALS_PATH = '/investors/financials-and-reports/';

export const financialsIndex: { meta: PageMeta; title: string } = {
  meta: { title: 'Financials & Reports - SAEL', description: TODO_CONTENT },
  title: 'Financials & Reports',
};

/** The five, keyed for the pages that import them. */
export const financialsPages = {
  annualReturn: investorPage(
    FINANCIALS_PATH,
    'annual-return',
    'Annual Return',
    'Annual Return - SAEL',
    listingOf('annual-return'),
  ),
  consolidated: investorPage(
    FINANCIALS_PATH,
    'consolidated-financials-of-the-company',
    'Consolidated Financials of the Company',
    'Consolidated Financials of the Company - SAEL',
    listingOf('consolidated-financials'),
  ),
  standalone: investorPage(
    FINANCIALS_PATH,
    'standalone-financials-of-the-company',
    'Standalone Financials of the Company',
    'Standalone Financials of the Company - SAEL',
    listingOf('standalone-financials'),
  ),
  subsidiaries: investorPage(
    FINANCIALS_PATH,
    'standalone-financials-of-material-subsidiary-companies',
    'Standalone Financials of Material Subsidiary Companies',
    'Standalone Financials of Material Subsidiary Companies - SAEL',
    listingOf('subsidiary-financials'),
  ),
  investorDownloads: investorPage(
    FINANCIALS_PATH,
    'investor-downloads',
    'Investor Downloads',
    'Investor Downloads - SAEL',
    listingOf('investor-downloads'),
  ),
} as const satisfies Record<string, InvestorPage>;

/** In the legacy order — the index's tiles and the side list, which agree. */
export const financialsPageList: readonly InvestorPage[] = [
  financialsPages.annualReturn,
  financialsPages.consolidated,
  financialsPages.standalone,
  financialsPages.subsidiaries,
  financialsPages.investorDownloads,
];

/** The side list — the legacy `<h3>` "Financials & Reports" over the five. */
export function financialsNav(current: InvestorPage): SubPageNavProps {
  return areaNav('Financials & Reports', financialsPageList, current);
}
