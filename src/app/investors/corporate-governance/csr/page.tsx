import type { Metadata } from 'next';
import { governanceNav, governancePages } from '@/app/_content/corporate-governance';
import { investorDocumentsEmpty, jumpLinksLabel } from '@/app/_content/investors';
import { loadInvestorDocuments, toDocumentGroups } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentGroups } from '@/components/ui/document-groups';
import { buildMetadata } from '@/lib/seo/metadata';

const page = governancePages.csr;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  // `trailingSlash: true`, and this is the legacy URL exactly. /CLAUDE.md §2 rule 6.
  path: page.path,
});

/**
 * CSR — the annual CSR action plans, by financial year, headed as the
 * legacy page heads them ("FY2026", no space) and in its order, oldest year
 * first — the one investor page that runs that way. The order is the
 * business's to change through `order`; it is not re-sorted here.
 *
 * **Not gated** — the legacy page carries no consent notice. Its headings
 * are `<DocumentGroups>`, the investor pages' one group pattern, in the order
 * the business sets through `order`.
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function CsrPage() {
  const groups = toDocumentGroups(await loadInvestorDocuments(page.listing));

  return (
    <SubPage masthead="ripple" title={page.name} nav={governanceNav(page)}>
      <DocumentGroups
        groups={groups}
        jumpLabel={jumpLinksLabel}
        emptyTitle={investorDocumentsEmpty.title}
        emptyDescription={investorDocumentsEmpty.description}
      />
    </SubPage>
  );
}
