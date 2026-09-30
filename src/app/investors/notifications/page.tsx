import type { Metadata } from 'next';
import { investorDocumentsEmpty, jumpLinksLabel } from '@/app/_content/investors';
import { notificationsPage as page } from '@/app/_content/notifications';
import { loadInvestorDocuments, toDocumentGroups } from '@/app/investors/_lib/documents';
import { SubPage } from '@/components/sections/sub-page';
import { DocumentGroups } from '@/components/ui/document-groups';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  // `trailingSlash: true`, and this is the legacy URL exactly. /CLAUDE.md §2 rule 6.
  path: page.path,
});

/**
 * Notifications — the company's notices to investors, by financial year.
 *
 * On the investor template with the ripple band, but **no side list**: the
 * legacy page is a page on its own, not part of an area. **Not gated**, as
 * on the legacy page.
 *
 * The years are `<DocumentGroups>`, the one year-group pattern, and the
 * legacy tab ids (`#fy2026`, `#fy2025`) are their anchors.
 *
 * Read through `getInvestorDocuments` with `category: 'notifications'`: two
 * notices do not need the paginated endpoint the contract proposes for when
 * the list is long (docs/api-contracts.md §3).
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function NotificationsPage() {
  const groups = toDocumentGroups(await loadInvestorDocuments(page.listing));

  return (
    <SubPage masthead="ripple" title={page.name}>
      <DocumentGroups
        groups={groups}
        jumpLabel={jumpLinksLabel}
        emptyTitle={investorDocumentsEmpty.title}
        emptyDescription={investorDocumentsEmpty.description}
      />
    </SubPage>
  );
}
