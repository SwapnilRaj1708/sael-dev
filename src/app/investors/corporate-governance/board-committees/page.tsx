import type { Metadata } from 'next';
import {
  committeeColumns,
  governanceNav,
  governancePages,
} from '@/app/_content/corporate-governance';
import { governanceEmpty, jumpLinksLabel } from '@/app/_content/investors';
import { loadBoardCommittees } from '@/app/investors/_lib/governance';
import { SubPage } from '@/components/sections/sub-page';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { JumpLinks } from '@/components/ui/jump-links';
import { buildMetadata } from '@/lib/seo/metadata';

const page = governancePages.boardCommittees;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  // `trailingSlash: true`, and this is the legacy URL exactly. /CLAUDE.md §2 rule 6.
  path: page.path,
});

/**
 * Board Committees — six tables, one per committee: each member's name,
 * category and role on the committee. **Not gated**, as on the legacy page.
 *
 * From the repository (`getBoardCommittees`) for the reason the board is: a
 * committee's membership changes by resolution, not by design review. Every
 * cell is this page's own wording — including where it spells a director
 * differently from the Board of Directors page ("Bjornar", "Kewal Kundanlal
 * Handa"); neither page corrects the other.
 *
 * Each committee is a `<DataTable>` under its own `<h2>`, with the investor
 * pages' row of jump links above — the same group pattern as the document
 * pages. Three short columns wrap at 360px without scrolling sideways.
 *
 * A Server Component; the ripple band is the one client leaf.
 */
export default async function BoardCommitteesPage() {
  const committees = await loadBoardCommittees();

  return (
    <SubPage masthead="ripple" title={page.name} nav={governanceNav(page)}>
      {committees.length === 0 ? (
        <EmptyState
          ground="dark"
          title={governanceEmpty.title}
          description={governanceEmpty.description}
        />
      ) : (
        <div className="flex flex-col gap-flow">
          <JumpLinks
            label={jumpLinksLabel}
            links={committees.map((committee) => ({
              label: committee.name,
              href: `#${committee.id}`,
            }))}
          />

          <div className="flex flex-col gap-section-y-tight">
            {committees.map((committee) => (
              <DataTable
                key={committee.id}
                id={committee.id}
                heading={committee.name}
                columns={committeeColumns}
                rows={committee.members.map((member) => [
                  member.name,
                  member.category,
                  member.position,
                ])}
              />
            ))}
          </div>
        </div>
      )}
    </SubPage>
  );
}
