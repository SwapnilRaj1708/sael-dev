import type { Metadata } from 'next';
import { boardTable, governanceNav, governancePages } from '@/app/_content/corporate-governance';
import { governanceEmpty } from '@/app/_content/investors';
import { loadBoardMembers } from '@/app/investors/_lib/governance';
import { SubPage } from '@/components/sections/sub-page';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { buildMetadata } from '@/lib/seo/metadata';
import { sanitizeBio } from '@/lib/utils/sanitize-bio';

const page = governancePages.boardOfDirectors;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  // `trailingSlash: true`, and this is the legacy URL exactly. /CLAUDE.md §2 rule 6.
  path: page.path,
});

/**
 * Board of Directors — the ten directors, each with a designation and an
 * "About" biography. **Not gated**, as on the legacy page.
 *
 * **From the repository, not from Our Team.** `getBoardMembers()` returns the
 * governance record, transcribed from this page's legacy HTML; some of these
 * people are on /our-team/ too, worded differently, and neither record is
 * copied from the other.
 *
 * **On a phone.** The table is Name, Designation and a column of "+"
 * toggles, which holds at 360px with every cell wrapping and nothing
 * scrolling sideways. The biographies — up to 2,600 characters — do not go in
 * a column, where they would be a word wide: each opens in a full-width row
 * under its director, the legacy page's own "+" arrangement
 * (`<DataTable detail>`). Every biography is in the HTML from the start,
 * hidden until opened.
 *
 * Biographies are HTML — the legacy page's `<p>` and `<strong>` — and are
 * sanitised here before they render, as Our Team's are.
 *
 * A Server Component; the ripple band and the row toggles are the client
 * leaves.
 */
export default async function BoardOfDirectorsPage() {
  const members = await loadBoardMembers();

  return (
    <SubPage masthead="ripple" title={page.name} nav={governanceNav(page)}>
      {members.length === 0 ? (
        <EmptyState
          ground="dark"
          title={governanceEmpty.title}
          description={governanceEmpty.description}
        />
      ) : (
        <DataTable
          id="board-of-directors"
          heading={boardTable.heading}
          columns={boardTable.columns}
          rows={members.map((member) => [member.name, member.designation])}
          detail={{
            column: boardTable.detailColumn,
            content: members.map((member) => {
              const bio = sanitizeBio(member.bio);
              return bio === null ? null : (
                <div
                  className="rich-text max-w-(--measure) text-body-sm text-pretty text-body-on-dark"
                  // Sanitised on the line above — `lib/utils/sanitize-bio.ts`
                  // allows only p, br, strong, em, ul, ol, li and a.
                  dangerouslySetInnerHTML={{ __html: bio }}
                />
              );
            }),
          }}
        />
      )}
    </SubPage>
  );
}
