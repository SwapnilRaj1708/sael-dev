import type { DocumentGroupData } from '@/components/ui/document-groups';
import type { DocumentListGatedItem, DocumentListLink } from '@/components/ui/document-list';
import { getContentRepository, type InvestorDocument, type InvestorListing } from '@/lib/content';

/**
 * What the investor pages share between fetching a listing and handing it to
 * `<DocumentList>`. Page code, so it lives beside the pages — a section never
 * fetches (docs/architecture.md §3) — and in a `_lib` folder so the router
 * does not treat it as a route.
 */

/**
 * One listing, or `[]` if the repository failed. Logged, not swallowed:
 * nothing else would record that the backend is down, and the page renders
 * its empty state either way. The same bargain Our Team makes. /CLAUDE.md §6.
 *
 * Takes `null` — a page with no listing — and returns `[]` for it, so a page
 * can pass its content file's `listing` straight through.
 */
export async function loadInvestorDocuments(
  listing: InvestorListing | null,
): Promise<InvestorDocument[]> {
  if (listing === null) return [];

  try {
    return await getContentRepository().getInvestorDocuments(listing);
  } catch (error) {
    const where = [listing.category, listing.section].filter(Boolean).join('/');
    console.error(
      `[investors] getInvestorDocuments(${where}) failed; rendering the empty state.`,
      error,
    );
    return [];
  }
}

/**
 * The label a row shows for its file type — "PDF". From the MIME type where
 * it is one we name, from the file's extension otherwise, never guessed.
 */
function fileTypeLabel(document: InvestorDocument): string | undefined {
  if (document.file.mimeType === 'application/pdf') return 'PDF';
  const extension = /\.([a-z0-9]+)$/i.exec(document.file.fileName)?.[1];
  return extension?.toUpperCase();
}

/**
 * Rows whose URLs may be in the page.
 *
 * **No size**, although the repository has one. The legacy Offer Documents
 * pages show none, and those pages are reproduced without additions — so a
 * page that does want sizes (the Financials pages, per the contract) opts in
 * by mapping its own rows rather than inheriting them here.
 */
export function toDocumentLinks(documents: readonly InvestorDocument[]): DocumentListLink[] {
  return documents.map((document) => ({
    id: document.id,
    title: document.title,
    href: document.file.url,
    fileType: fileTypeLabel(document),
  }));
}

/**
 * Rows for a gated list: **the URL is dropped here**, on the server, so it
 * never reaches the props of a client component and so never reaches the
 * page. `revealGatedDocument` fetches it again after consent.
 */
export function toGatedItems(documents: readonly InvestorDocument[]): DocumentListGatedItem[] {
  return documents.map((document) => ({
    id: document.id,
    title: document.title,
    fileType: fileTypeLabel(document),
  }));
}

/**
 * A heading's anchor: the label lowercased, with everything but letters and
 * digits removed — "FY 2025" → "fy2025". That is exactly how the legacy
 * site's tab ids are formed, so its deep links (`…/annual-return/#fy2024`)
 * still land. A subgroup's anchor is prefixed with its group's.
 */
export function anchorOf(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export interface GroupingOptions {
  /**
   * Group headings the page shows whatever the data holds, in this order,
   * ahead of any group the data adds. For a heading the legacy page carries
   * with nothing under it — General Meeting's "Postal Ballot" — and which is
   * content in its own right. Empty ones render as a heading alone.
   */
  declared?: readonly string[];
}

/**
 * A listing, grouped for `<DocumentGroups>`: headings in the order of their
 * first document (the repository sorts by `order`, and so the business
 * orders the headings too), subgroups likewise within a group. Never
 * re-sorted here.
 *
 * Documents with no `group` are kept, as an unheaded group at the top,
 * rather than dropped: a document the business uploads without a heading
 * should still be on the page. None exist today.
 */
export function toDocumentGroups(
  documents: readonly InvestorDocument[],
  { declared = [] }: GroupingOptions = {},
): DocumentGroupData[] {
  interface Bucket {
    items: InvestorDocument[];
    subgroups: Map<string, InvestorDocument[]>;
  }

  const buckets = new Map<string | null, Bucket>();
  const bucket = (label: string | null): Bucket => {
    let found = buckets.get(label);
    if (found === undefined) {
      found = { items: [], subgroups: new Map() };
      buckets.set(label, found);
    }
    return found;
  };

  if (documents.some((document) => document.group === null)) bucket(null);
  for (const label of declared) bucket(label);

  for (const document of documents) {
    const target = bucket(document.group);
    if (document.subgroup === null) {
      target.items.push(document);
    } else {
      const members = target.subgroups.get(document.subgroup) ?? [];
      members.push(document);
      target.subgroups.set(document.subgroup, members);
    }
  }

  return [...buckets].map(([label, { items, subgroups }]) => {
    const anchor = label === null ? 'documents' : anchorOf(label);
    return {
      label,
      anchor,
      items: toDocumentLinks(items),
      subgroups: [...subgroups].map(([sublabel, members]) => ({
        label: sublabel,
        anchor: `${anchor}-${anchorOf(sublabel)}`,
        items: toDocumentLinks(members),
      })),
    };
  });
}
