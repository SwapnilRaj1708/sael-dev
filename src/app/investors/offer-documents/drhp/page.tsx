import type { Metadata } from 'next';
import {
  consentCopy,
  documentsEmpty,
  drhpNotice,
  listingHeadings,
  offerDocumentsNav,
  offerDocumentsPages,
} from '@/app/_content/offer-documents';
import { revealGatedDocument } from '@/app/investors/actions';
import { loadInvestorDocuments, toGatedItems } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentList } from '@/components/ui/document-list';
import { NoticeText } from '@/components/ui/notice-text';
import { buildMetadata } from '@/lib/seo/metadata';

const page = offerDocumentsPages.drhp;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  path: page.path,
});

/**
 * Draft Red Herring Prospectus (DRHP) — **gated per document**.
 *
 * The legacy page's behaviour, exactly: the page and the document's title are
 * public; activating the title opens the disclaimer; "I Confirm" opens the
 * PDF in a new tab; "I Do Not Confirm" and × close the disclaimer and nothing
 * else happens; the next click asks again.
 *
 * **The PDF's URL is not in this page.** The repository returns it, and
 * `toGatedItems` drops it before anything reaches a client component, so it
 * is in neither the HTML nor the RSC payload. `revealGatedDocument` fetches
 * it on "I Confirm". The notice itself is ordinary server-rendered text: it
 * is in the HTML, inside the closed dialog, where a crawler can read it.
 *
 * A Server Component; the ripple band, and the row with its dialog, are
 * the client leaves.
 */
export default async function DrhpPage() {
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
        heading={listingHeadings.drhp}
        items={toGatedItems(documents)}
        gate={{
          copy: consentCopy,
          notice: <NoticeText paragraphs={drhpNotice} />,
          reveal: revealGatedDocument,
        }}
        emptyTitle={documentsEmpty.title}
        emptyDescription={documentsEmpty.description}
      />
    </SubPage>
  );
}
