import type { Metadata } from 'next';
import {
  documentsEmpty,
  offerDocumentsNav,
  offerDocumentsPages,
} from '@/app/_content/offer-documents';
import {
  groupDocuments,
  loadInvestorDocuments,
  toDocumentLinks,
} from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentList } from '@/components/ui/document-list';
import { EmptyState } from '@/components/ui/empty-state';
import { buildMetadata } from '@/lib/seo/metadata';

const page = offerDocumentsPages.groupCompanies;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  path: page.path,
});

/**
 * Information with respect to Group Companies — **not gated**. Three group
 * companies' documents for each of three financial years, linked directly as
 * the legacy page links them.
 *
 * **The years are stacked, not tabbed.** The legacy page puts FY 2025, 2024
 * and 2023 behind three tabs. Here each year is its own titled list, newest
 * first, all on the page at once: nine rows is not so many that anything
 * needs hiding, find-in-page and a crawler both see every document, and there
 * is no client code. Every legacy heading is still there, verbatim — the
 * year headings the legacy page sets inside each tab panel become the lists'
 * own headings.
 *
 * **The legacy deep links still land.** The legacy tabs answer to `#fy2025`,
 * `#fy2024` and `#fy2023`; each list here carries that id, so a link to
 * `…/information-with-respect-to-group-companies/#fy2024` scrolls to FY 2024
 * instead of opening its tab.
 *
 * The years come from the documents' `group`, not from this file — a fourth
 * year uploaded by the business appears without a deploy.
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function InformationWithRespectToGroupCompaniesPage() {
  const groups = groupDocuments(await loadInvestorDocuments(page.listing));

  return (
    <SubPage
      // The ripple band, with this page's own name as the title — the
      // client's ask of 2026-09-29, the same opening as the index.
      masthead="ripple"
      title={page.name}
      nav={offerDocumentsNav(page)}
    >
      {groups.length === 0 ? (
        <EmptyState
          ground="dark"
          title={documentsEmpty.title}
          description={documentsEmpty.description}
        />
      ) : (
        <div className="flex flex-col gap-section-y-tight">
          {groups.map((group) => (
            <DocumentList
              key={group.anchor}
              id={group.anchor}
              heading={group.label}
              items={toDocumentLinks(group.documents)}
              emptyTitle={documentsEmpty.title}
              emptyDescription={documentsEmpty.description}
            />
          ))}
        </div>
      )}
    </SubPage>
  );
}
