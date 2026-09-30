import type { Metadata } from 'next';
import { financialsNav, financialsPages } from '@/app/_content/financials-and-reports';
import {
  companyFilterCopy,
  investorDocumentsEmpty,
  jumpLinksLabel,
} from '@/app/_content/investors';
import { loadInvestorDocuments, toDocumentGroups } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentFilter } from '@/components/ui/document-filter';
import { buildMetadata } from '@/lib/seo/metadata';

const page = financialsPages.subsidiaries;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  path: page.path,
});

/**
 * Standalone Financials of Material Subsidiary Companies — sixty-four
 * filings, twenty-four to sixteen companies a year across three years: the
 * densest listing on the site. **Not gated**, as on the legacy page.
 *
 * **Designed to find one company's one year.** It is the investor pages' one
 * year-group pattern — every year under its own `<h2>`, a row of links to
 * each — with `<DocumentFilter>` over it: type part of a company's name and
 * each year keeps just that company's filing, under its year. Every title
 * is shown as that year's link reads it; the page does not merge a
 * company's years into one row, because several companies are named
 * differently from year to year ("Kaithal…" / "SAEL Kaithal…", "SAEL Solar
 * MGF" / "SAEL Solar MFG Energy"), and deciding that two filings are the
 * same company is not the website's call. The filter finds a company by the
 * part of the name its filings share.
 *
 * Each year keeps the legacy page's order, which the business owns through
 * `order`; the FY 2024 list is not alphabetical there and is not here.
 *
 * **At 360px** every filing is one full-width row, wrapping its title, with
 * no second column to squeeze — nothing scrolls sideways — and the filter
 * is what saves a reader from scrolling sixty-four rows.
 *
 * The whole list is server-rendered HTML; the filter narrows it once script
 * runs and does nothing without it.
 *
 * A Server Component; the ripple band and the filter are the client leaves.
 */
export default async function MaterialSubsidiaryFinancialsPage() {
  const groups = toDocumentGroups(await loadInvestorDocuments(page.listing));

  return (
    <SubPage masthead="ripple" title={page.name} nav={financialsNav(page)}>
      <DocumentFilter
        groups={groups}
        copy={companyFilterCopy}
        jumpLabel={jumpLinksLabel}
        emptyTitle={investorDocumentsEmpty.title}
        emptyDescription={investorDocumentsEmpty.description}
      />
    </SubPage>
  );
}
