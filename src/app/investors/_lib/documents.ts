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

export interface DocumentGroup {
  /** The group's label, verbatim from the data — "FY 2025". */
  label: string;
  /**
   * Its anchor: the label lowercased with everything but letters and digits
   * removed — "fy2025". That is the legacy page's own tab id, so a deep link
   * to `…/information-with-respect-to-group-companies/#fy2025` still lands.
   */
  anchor: string;
  documents: InvestorDocument[];
}

/**
 * Split a listing by `group`, in the order the repository returned them —
 * which the contract makes group descending, so the newest year comes first.
 * Never re-sorted here. Documents with no group are left out: a grouped page
 * has nowhere to put them, and none exist.
 */
export function groupDocuments(documents: readonly InvestorDocument[]): DocumentGroup[] {
  const groups = new Map<string, InvestorDocument[]>();

  for (const document of documents) {
    if (document.group === null) continue;
    const bucket = groups.get(document.group) ?? [];
    bucket.push(document);
    groups.set(document.group, bucket);
  }

  return [...groups].map(([label, members]) => ({
    label,
    anchor: label.toLowerCase().replace(/[^a-z0-9]/g, ''),
    documents: members,
  }));
}
