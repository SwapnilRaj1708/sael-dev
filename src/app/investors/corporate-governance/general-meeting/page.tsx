import type { Metadata } from 'next';
import {
  governanceNav,
  governancePages,
  generalMeetingHeadings,
} from '@/app/_content/corporate-governance';
import { investorDocumentsEmpty, jumpLinksLabel } from '@/app/_content/investors';
import { loadInvestorDocuments, toDocumentGroups } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentGroups } from '@/components/ui/document-groups';
import { buildMetadata } from '@/lib/seo/metadata';

const page = governancePages.generalMeeting;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  // `trailingSlash: true`, and this is the legacy URL exactly. /CLAUDE.md §2 rule 6.
  path: page.path,
});

/**
 * General Meeting — the notices of the company's general meetings, under the
 * legacy page's three headings. The one listing with two tiers:
 * "Extra-Ordinary General Meeting" is divided by financial year, each year an
 * `<h3>` under it (the documents' `subgroup`).
 *
 * The headings are declared (`generalMeetingHeadings`) because the third,
 * "Postal Ballot", has nothing under it on the legacy page — it is a heading
 * the company publishes, and it renders alone rather than with a failure
 * message that would be untrue.
 *
 * Several EGM titles end in ".pdf" on the legacy page; they are transcribed
 * as written.
 *
 * **Not gated** — the legacy page carries no consent notice. Its headings
 * are `<DocumentGroups>`, the investor pages' one group pattern, in the order
 * the business sets through `order`.
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function GeneralMeetingPage() {
  const groups = toDocumentGroups(await loadInvestorDocuments(page.listing), {
    declared: generalMeetingHeadings,
  });

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
