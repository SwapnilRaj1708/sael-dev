import type { Metadata } from 'next';
import { financialsNav, financialsPages } from '@/app/_content/financials-and-reports';
import { investorDocumentsEmpty, jumpLinksLabel } from '@/app/_content/investors';
import { loadInvestorDocuments, toDocumentGroups } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentGroups } from '@/components/ui/document-groups';
import { buildMetadata } from '@/lib/seo/metadata';

const page = financialsPages.investorDownloads;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  // `trailingSlash: true`, and this is the legacy URL exactly. /CLAUDE.md §2 rule 6.
  path: page.path,
});

/**
 * Investor Downloads — the restricted-group financials, reports and
 * presentations, by financial year. Each document sits under the year the
 * legacy page shows it in, whatever folder its file is in (one FY 2026
 * report lives in the legacy `FY-2025/` folder).
 *
 * **Not gated** — the legacy page carries no consent notice, and the files
 * are plain links there and here.
 *
 * The years are `<DocumentGroups>`, the investor pages' one year-group
 * pattern: every year stacked under its own `<h2>`, newest first as the
 * business orders them, with a row of links to each above — the legacy tab
 * row, whose ids (`#fy2025`) are the years' anchors, so old deep links land.
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function InvestorDownloadsPage() {
  const groups = toDocumentGroups(await loadInvestorDocuments(page.listing));

  return (
    <SubPage masthead="ripple" title={page.name} nav={financialsNav(page)}>
      <DocumentGroups
        groups={groups}
        jumpLabel={jumpLinksLabel}
        emptyTitle={investorDocumentsEmpty.title}
        emptyDescription={investorDocumentsEmpty.description}
      />
    </SubPage>
  );
}
