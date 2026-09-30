import type { Metadata } from 'next';
import {
  documentsEmpty,
  offerDocumentsNav,
  offerDocumentsPages,
} from '@/app/_content/offer-documents';
import { jumpLinksLabel } from '@/app/_content/investors';
import { loadInvestorDocuments, toDocumentGroups } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentGroups } from '@/components/ui/document-groups';
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
 * **The years are stacked, not tabbed** — `<DocumentGroups>`, the one
 * year-group pattern every investor page shares (see there for why). The
 * legacy tab row survives as a row of links to the years, and the legacy
 * tab ids (`#fy2025`, `#fy2024`, `#fy2023`) are the years' anchors, so an
 * old deep link lands on the year it used to open.
 *
 * The years come from the documents' `group`, not from this file — a fourth
 * year uploaded by the business appears without a deploy.
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function InformationWithRespectToGroupCompaniesPage() {
  const groups = toDocumentGroups(await loadInvestorDocuments(page.listing));

  return (
    <SubPage
      // The ripple band, with this page's own name as the title — the
      // client's ask of 2026-09-29, the same opening as the index.
      masthead="ripple"
      title={page.name}
      nav={offerDocumentsNav(page)}
    >
      <DocumentGroups
        groups={groups}
        jumpLabel={jumpLinksLabel}
        emptyTitle={documentsEmpty.title}
        emptyDescription={documentsEmpty.description}
      />
    </SubPage>
  );
}
