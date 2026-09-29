import type { Metadata } from 'next';
import {
  materialCreditors,
  offerDocumentsNav,
  offerDocumentsPages,
} from '@/app/_content/offer-documents';
import { SubPage } from '@/components/sections/sub-page';
import { DataTable } from '@/components/ui/data-table';
import { buildMetadata } from '@/lib/seo/metadata';

const page = offerDocumentsPages.outstandingDues;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  path: page.path,
});

/**
 * Outstanding Dues to Material Creditors — **not gated**, and the one page
 * in the area with no document: the legacy page is a table, headed
 * "Material Creditor", of two creditors and the amounts owed to them.
 *
 * Transcribed, not fetched: the figures are in `_content/offer-documents.ts`
 * as the strings the legacy page prints, so "4.32" stays "4.32".
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default function OutstandingDuesToMaterialCreditorsPage() {
  return (
    <SubPage
      // The ripple band, with this page's own name as the title — the
      // client's ask of 2026-09-29, the same opening as the index.
      masthead="ripple"
      title={page.name}
      nav={offerDocumentsNav(page)}
    >
      <DataTable id="material-creditors" {...materialCreditors} />
    </SubPage>
  );
}
