import { DocumentList, type DocumentListLink } from '@/components/ui/document-list';
import { EmptyState } from '@/components/ui/empty-state';
import { JumpLinks } from '@/components/ui/jump-links';

export interface DocumentSubgroupData {
  /** Verbatim — "FY 2026". */
  label: string;
  anchor: string;
  items: readonly DocumentListLink[];
}

export interface DocumentGroupData {
  /** Verbatim — "FY 2025", "FY2026", "Statutory Policies". `null`: no heading. */
  label: string | null;
  /** The section's id — the legacy tab id for a year, `#fy2025`. */
  anchor: string;
  /** Documents directly under the heading. */
  items: readonly DocumentListLink[];
  /** A second tier of headings under this one, each with its own documents. */
  subgroups: readonly DocumentSubgroupData[];
}

export interface DocumentGroupsProps {
  groups: readonly DocumentGroupData[];
  /** The jump row's accessible name — functional copy, "On this page". */
  jumpLabel: string;
  /** Shown when there are no groups at all — a failed or empty listing. */
  emptyTitle: string;
  emptyDescription?: string;
}

/**
 * A listing under its headings — **the one year-group pattern every investor
 * page uses**, for financial years and for named groups alike.
 *
 * Every group is a section with an `<h2>`, stacked, newest first where the
 * business orders it so; a group with subgroups carries an `<h3>` per
 * subgroup (General Meeting's "Extra-Ordinary General Meeting", by year).
 * When there are two or more headings, a row of `<JumpLinks>` above them
 * takes the reader straight to one — the legacy tab row, which hid every
 * year but one, turned into links to years that are all on the page.
 *
 * **Why headings and not tabs or a disclosure.** Most of these pages hold
 * one to four documents a year, and there, hiding years behind controls is
 * clicks for nothing. Stacked headings put every document in the HTML with
 * no script — crawlable, found by find-in-page, readable by any screen
 * reader's heading navigation — and the jump row gives back the one thing the
 * tabs were good for, reaching a year directly, while keeping the legacy tab
 * ids as anchors so old deep links land. The one long page, Material
 * Subsidiaries, adds a company filter over the same markup rather than a
 * second pattern (`<DocumentFilter>`).
 *
 * A group the page declares with nothing in it renders its heading alone, as
 * the legacy page does ("Postal Ballot"). A listing with nothing at all
 * renders `<EmptyState>`.
 *
 * Holds no state and no hooks, so it renders on the server and inside the
 * filter, which is client, alike.
 */
export function DocumentGroups({
  groups,
  jumpLabel,
  emptyTitle,
  emptyDescription,
}: DocumentGroupsProps) {
  if (groups.length === 0) {
    return <EmptyState ground="dark" title={emptyTitle} description={emptyDescription} />;
  }

  const headed = groups.filter(
    (group): group is DocumentGroupData & { label: string } => group.label !== null,
  );

  return (
    <div className="flex flex-col gap-flow">
      {headed.length >= 2 && (
        <JumpLinks
          label={jumpLabel}
          links={headed.map((group) => ({ label: group.label, href: `#${group.anchor}` }))}
        />
      )}

      <div className="flex flex-col gap-section-y-tight">
        {groups.map((group) =>
          group.subgroups.length === 0 ? (
            <DocumentList
              key={group.anchor}
              id={group.anchor}
              heading={group.label ?? undefined}
              items={group.items}
            />
          ) : (
            <section
              key={group.anchor}
              id={group.anchor}
              aria-labelledby={group.label === null ? undefined : `${group.anchor}-heading`}
              className="flex flex-col gap-flow"
            >
              {group.label !== null && (
                <h2 id={`${group.anchor}-heading`} className="text-h2 text-white">
                  {group.label}
                </h2>
              )}

              {group.items.length > 0 && (
                <DocumentList id={`${group.anchor}-documents`} items={group.items} />
              )}

              {group.subgroups.map((subgroup) => (
                <DocumentList
                  key={subgroup.anchor}
                  id={subgroup.anchor}
                  heading={subgroup.label}
                  headingLevel="h3"
                  items={subgroup.items}
                />
              ))}
            </section>
          ),
        )}
      </div>
    </div>
  );
}
