import {
  Building2,
  FileChartColumn,
  FileCheckCorner,
  FilePenLine,
  FilePlusCorner,
  FileVideoCamera,
  HandCoins,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import { LinkGrid } from '@/components/sections/link-grid';
import { SubPage } from '@/components/sections/sub-page';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  OFFER_DOCUMENTS_PATH,
  offerDocumentsIndex,
  offerDocumentsPageList,
  type OfferDocumentsSlug,
} from '@/app/_content/offer-documents';

export const metadata: Metadata = buildMetadata({
  title: offerDocumentsIndex.meta.title,
  description: offerDocumentsIndex.meta.description,
  // `trailingSlash: true`, and the legacy URL is `/investors/offer-documents/`.
  // /CLAUDE.md §2 rule 6.
  path: OFFER_DOCUMENTS_PATH,
});

/**
 * The tiles' marks, one per page. The legacy index draws a line icon on each
 * tile — stock Flaticon artwork of unknown licence, which is not carried
 * over. These are lucide's, which the project already ships under ISC, chosen
 * to say what the legacy ones said: a checked document for the DRHP, a
 * correction, an addition, a chart, a video (the same one for both
 * languages, as on the legacy page), money in hand, a building. Decorative —
 * the title is the tile's name — and joined here because a mark is a node and
 * the content file is data.
 */
const MARKS: Record<OfferDocumentsSlug, LucideIcon> = {
  drhp: FileCheckCorner,
  'corrigendum-to-drhp': FilePenLine,
  'addendum-to-drhp': FilePlusCorner,
  'industry-report': FileChartColumn,
  'drhp-audio-visuals-english': FileVideoCamera,
  'drhp-audio-visuals-hindi': FileVideoCamera,
  'outstanding-dues-to-material-creditors': HandCoins,
  'information-with-respect-to-group-companies': Building2,
};

/**
 * Offer Documents — the area's index: a tile for each of its eight pages, in
 * the legacy order, each linking to the page and not to a file. Nothing is
 * gated here; the notices live on the pages they guard.
 *
 * On `<SubPage>` without its side panel, since this page *is* that list, and
 * with the ripple masthead: the title centred over `<BackgroundRipple>` in a
 * band across the top half of the screen, in place of the legacy banner —
 * the client's ask of 2026-09-29. Every sub-page opens the same way, with
 * its own name in the band.
 *
 * A Server Component; the ripple grid and the tiles' border glow are the
 * client leaves.
 */
export default function InvestorsOfferDocumentsPage() {
  return (
    <SubPage masthead="ripple" title={offerDocumentsIndex.title}>
      <LinkGrid
        label={offerDocumentsIndex.title}
        items={offerDocumentsPageList.map((page) => {
          const Mark = MARKS[page.slug];
          return {
            name: page.name,
            href: page.path,
            mark: <Mark className="size-icon-mark" aria-hidden="true" focusable="false" />,
          };
        })}
      />
    </SubPage>
  );
}
