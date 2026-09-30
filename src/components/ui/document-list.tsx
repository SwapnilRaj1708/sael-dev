import type { ReactNode } from 'react';
import type { ConsentCopy } from '@/components/ui/consent-actions';
import { DocumentLink } from '@/components/ui/document-link';
import { EmptyState } from '@/components/ui/empty-state';
import { GatedDocumentLink } from '@/components/ui/gated-document-link';

/** A document whose URL may be in the page. */
export interface DocumentListLink {
  id: string;
  title: string;
  /** Absolute. Composed from a blob path by the repository. */
  href: string;
  fileType?: string;
  /** Bytes. Omit to show no size — which is the caller's call, per page. */
  fileSize?: number;
}

/** A document behind a consent notice: no URL until the reader confirms. */
export interface DocumentListGatedItem {
  id: string;
  title: string;
  fileType?: string;
}

/** What every row in a gated list shares. */
export interface DocumentListGate {
  copy: ConsentCopy;
  /** Server-rendered notice text. */
  notice: ReactNode;
  /** A Server Action: the URL for a document id, or `null`. */
  reveal: (id: string) => Promise<string | null>;
}

interface DocumentListBaseProps {
  /**
   * The list's heading, verbatim. Omitted for a list that sits under a
   * heading of its own already — the documents of a group that also has
   * subgroups.
   */
  heading?: string;
  /**
   * The section's anchor, and the root of its heading's id. Stable across
   * builds because a legacy deep link may point at it — `#fy2025`.
   */
  id: string;
  /**
   * `h2` under the page title; `h3` for a list inside another section — a
   * year inside General Meeting's "Extra-Ordinary General Meeting" — which
   * also steps the heading's size down, so the outline reads by eye too.
   */
  headingLevel?: 'h2' | 'h3';
  /**
   * Shown in place of the list when there is nothing in it. Omit it and an
   * empty list renders its heading alone — for a heading the source page
   * carries with nothing under it, where a failure message would be untrue.
   */
  emptyTitle?: string;
  emptyDescription?: string;
}

export type DocumentListProps = DocumentListBaseProps &
  (
    | { items: readonly DocumentListLink[]; gate?: undefined }
    | { items: readonly DocumentListGatedItem[]; gate: DocumentListGate }
  );

/** One `<li>` per document — a plain link, or a gated row. */
function rows(props: DocumentListProps): ReactNode {
  if (props.gate === undefined) {
    return props.items.map((item) => (
      <li key={item.id}>
        <DocumentLink
          ground="dark"
          href={item.href}
          title={item.title}
          fileType={item.fileType}
          fileSize={item.fileSize}
          // The investor pages' PDF mark — `<DocumentRowBody>`.
          typeMark
        />
      </li>
    ));
  }

  const { gate } = props;
  return props.items.map((item) => (
    <li key={item.id}>
      <GatedDocumentLink
        ground="dark"
        id={item.id}
        title={item.title}
        fileType={item.fileType}
        copy={gate.copy}
        notice={gate.notice}
        reveal={gate.reveal}
      />
    </li>
  ));
}

/**
 * A heading over a list of documents — the body of every investor page that
 * lists files.
 *
 * **Two kinds of list, one look.** Given plain items it renders
 * `<DocumentLink>`s, whose URLs are in the HTML like any link. Given a
 * `gate`, the items carry no URL at all — the type will not accept one — and
 * each row is a `<GatedDocumentLink>` that asks for consent and fetches its
 * URL only then. Whether a list is gated is the page's decision, taken from
 * its content file; this component cannot be persuaded to put a gated URL on
 * the page, because it is never given one.
 *
 * The heading is always rendered, even where it repeats the page title — the
 * legacy pages set the listing's own heading above every list, and this
 * reproduces them. It takes `--text-h2`, under the page's `--text-hero` and
 * over the rows' `--text-h3`.
 *
 * Empty — a failed fetch, or a listing with nothing in it — renders
 * `<EmptyState>` under the heading, so the page still says what should be
 * here. /CLAUDE.md §6.
 *
 * Dark ground only: every investor page is dark (docs/design-guidelines.md §1).
 * A Server Component; only the gated rows are client.
 */
export function DocumentList(props: DocumentListProps) {
  const { heading, id, headingLevel: Heading = 'h2', emptyTitle, emptyDescription } = props;
  const headingId = `${id}-heading`;
  const empty = props.items.length === 0;

  return (
    <section
      id={id}
      aria-labelledby={heading === undefined ? undefined : headingId}
      className="flex flex-col gap-stack"
    >
      {heading !== undefined && (
        <Heading
          id={headingId}
          className={Heading === 'h2' ? 'text-h2 text-white' : 'text-h3 text-on-dark-soft'}
        >
          {heading}
        </Heading>
      )}

      {empty ? (
        emptyTitle !== undefined && (
          <EmptyState ground="dark" title={emptyTitle} description={emptyDescription} />
        )
      ) : (
        <ul className="flex flex-col">{rows(props)}</ul>
      )}
    </section>
  );
}
