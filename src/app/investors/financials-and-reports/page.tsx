import {
  CalendarCheck,
  ChartColumn,
  FolderDown,
  Layers,
  Network,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import {
  FINANCIALS_PATH,
  financialsIndex,
  financialsPageList,
} from '@/app/_content/financials-and-reports';
import { LinkGrid } from '@/components/sections/link-grid';
import { SubPage } from '@/components/sections/sub-page';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: financialsIndex.meta.title,
  description: financialsIndex.meta.description,
  path: FINANCIALS_PATH,
});

/**
 * The tiles' marks, by slug. The legacy index draws a stock Flaticon icon on
 * each tile, of unknown licence and not carried over; these are lucide's,
 * which the project ships under ISC, chosen to say what those said: a dated
 * return, layered (consolidated) accounts, one company's accounts, a group
 * of companies, and downloads. Decorative — the title is the tile's name.
 */
const MARKS: Record<string, LucideIcon> = {
  'annual-return': CalendarCheck,
  'consolidated-financials-of-the-company': Layers,
  'standalone-financials-of-the-company': ChartColumn,
  'standalone-financials-of-material-subsidiary-companies': Network,
  'investor-downloads': FolderDown,
};

/**
 * Financials & Reports — the area's index: a tile for each of its five
 * pages, in the legacy order, on the Offer Documents template.
 *
 * `balance` on the tiles: five do not divide into the four-column grid, so
 * they fall 3 + 2 on a desktop and 2 + 2 + 1 on a tablet, the short row
 * centred, rather than four over a lone fifth.
 *
 * A Server Component; the ripple grid and the tiles' border glow are the
 * client leaves.
 */
export default function FinancialsAndReportsPage() {
  return (
    <SubPage masthead="ripple" title={financialsIndex.title}>
      <LinkGrid
        label={financialsIndex.title}
        balance
        items={financialsPageList.map((page) => {
          const Mark = MARKS[page.slug] ?? Layers;
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
