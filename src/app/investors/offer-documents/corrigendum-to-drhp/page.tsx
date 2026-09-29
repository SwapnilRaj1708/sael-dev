import type { Metadata } from 'next';
import {
  documentsEmpty,
  listingHeadings,
  offerDocumentsNav,
  offerDocumentsPages,
} from '@/app/_content/offer-documents';
import { loadInvestorDocuments, toDocumentLinks } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentList } from '@/components/ui/document-list';
import { buildMetadata } from '@/lib/seo/metadata';

const page = offerDocumentsPages.corrigendum;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  path: page.path,
});

/**
 * Corrigendum to DRHP — **not gated**. The legacy page links its PDF
 * directly, with no notice, and so does this: the link is an ordinary
 * `<DocumentLink>`, its URL in the page like any other link's.
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function CorrigendumToDrhpPage() {
  const documents = await loadInvestorDocuments(page.listing);

  return (
    <SubPage
      // The ripple band, with this page's own name as the title — the
      // client's ask of 2026-09-29, the same opening as the index.
      masthead="ripple"
      title={page.name}
      nav={offerDocumentsNav(page)}
    >
      <DocumentList
        id={page.slug}
        heading={listingHeadings.corrigendum}
        items={toDocumentLinks(documents)}
        emptyTitle={documentsEmpty.title}
        emptyDescription={documentsEmpty.description}
      />
    </SubPage>
  );
}
