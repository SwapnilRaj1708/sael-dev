import type { Metadata } from 'next';
import { governanceNav, governancePages } from '@/app/_content/corporate-governance';
import { investorDocumentsEmpty, jumpLinksLabel } from '@/app/_content/investors';
import { loadInvestorDocuments, toDocumentGroups } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentGroups } from '@/components/ui/document-groups';
import { buildMetadata } from '@/lib/seo/metadata';

const page = governancePages.otherDocuments;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  // `trailingSlash: true`, and this is the legacy URL exactly. /CLAUDE.md §2 rule 6.
  path: page.path,
});

/**
 * Other Documents — the company's constitution and the composite scheme of
 * arrangement with its advertisements, under the legacy page's two headings.
 *
 * **Not gated** — the legacy page carries no consent notice. Its headings
 * are `<DocumentGroups>`, the investor pages' one group pattern, in the order
 * the business sets through `order`.
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function OtherDocumentsPage() {
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
