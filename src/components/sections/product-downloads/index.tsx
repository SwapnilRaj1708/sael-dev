import { DisplayHeading } from '@/components/ui/display-heading';
import { DocumentLink } from '@/components/ui/document-link';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';

export interface ProductDownload {
  /** The sheet's title, as the link reads — "SAEL Solar TOPCon Bifacial G12R 615 635 Wp". */
  title: string;
  /** The file's absolute URL. Never a path into this repo — /CLAUDE.md §8. */
  href: string;
  /** Size in bytes, when known. */
  fileSize?: number;
}

export interface ProductDownloadsProps {
  eyebrow?: string;
  title: string;
  items: readonly ProductDownload[];
  /** `tight` for a block between two taller sections. */
  spacing?: 'default' | 'tight';
}

/**
 * A heading over a short list of product sheets — the business pages'
 * "Product Downloads".
 *
 * Built 2026-09-21 for Module Manufacturing, whose live page lists three
 * module datasheets between the projects map and the prowess cards. It had
 * been left out (see `_content/module-manufacturing.ts`) because the PDFs live
 * under the legacy site's `/documents/`; the client asked for the block back,
 * linking to those files where they are for now.
 *
 * It is the investor pages' `<DocumentLink>` on the dark ground, and nothing
 * more: a list of files is a list of files whichever page it is on, and a
 * second list idiom for three links would be exactly the duplication the
 * primitives exist to prevent. The list is a `<ul>` because it is one — a
 * screen reader announcing "list, three items" is the right summary of it.
 *
 * **Two columns from `lg`.** A three-row list capped at the body measure and
 * pinned to the left gutter left the right half of a 1920px section empty —
 * the client's note of 2026-09-21. So above `lg` the heading takes the first
 * third and the list the other two, on the same column gap the capability
 * rows use; the row reads across the width the way the map section above it
 * does. Below `lg` it stacks, heading over list, and the list is uncapped
 * because its column is the cap.
 *
 * Like `<ValueGrid>`, the list arrives as one `<Reveal>` after the heading:
 * three rows cascading separately would still be landing when the reader
 * reached them.
 *
 * A Server Component. The rows are plain links.
 */
export function ProductDownloads({
  eyebrow,
  title,
  items,
  spacing = 'default',
}: ProductDownloadsProps) {
  return (
    <Section background="black-dots" spacing={spacing}>
      <div
        className={cn(
          'flex w-full flex-col gap-flow',
          'lg:grid lg:grid-cols-[1fr_2fr] lg:items-start lg:gap-x-ledger-col-gap',
        )}
      >
        <div className="flex flex-col gap-stack">
          {eyebrow !== undefined && (
            <Reveal order={0}>
              <Eyebrow tone="bright">{eyebrow}</Eyebrow>
            </Reveal>
          )}

          <Reveal order={eyebrow === undefined ? 0 : 1}>
            <DisplayHeading ground="dark">{title}</DisplayHeading>
          </Reveal>
        </div>

        <Reveal order={2}>
          <ul className="flex w-full flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <DocumentLink
                  ground="dark"
                  href={item.href}
                  title={item.title}
                  fileSize={item.fileSize}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
