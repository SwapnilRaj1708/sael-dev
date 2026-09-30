import {
  Files,
  GraduationCap,
  HandHeart,
  Leaf,
  Presentation,
  ScrollText,
  UserRoundCog,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import {
  GOVERNANCE_PATH,
  governanceIndex,
  governancePageList,
} from '@/app/_content/corporate-governance';
import { LinkGrid } from '@/components/sections/link-grid';
import { SubPage } from '@/components/sections/sub-page';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: governanceIndex.meta.title,
  description: governanceIndex.meta.description,
  path: GOVERNANCE_PATH,
});

/**
 * The tiles' marks, by slug. The legacy index draws a stock Flaticon icon on
 * each tile, of unknown licence and not carried over; these are lucide's,
 * which the project ships under ISC: the board, a committee, a code, a leaf
 * for sustainability, a hand for CSR, a meeting, learning for the directors'
 * familiarization, and a stack of documents. Decorative — the title names
 * the tile.
 */
const MARKS: Record<string, LucideIcon> = {
  'board-of-directors': Users,
  'board-committees': UserRoundCog,
  'codes-and-policies': ScrollText,
  'sustainability-reports': Leaf,
  csr: HandHeart,
  'general-meeting': Presentation,
  'familiarization-programme': GraduationCap,
  'other-documents': Files,
};

/**
 * Corporate Governance — the area's index: a tile for each of its eight
 * pages, in the legacy order, on the Offer Documents template. Eight tiles
 * fall 4 × 2 on a desktop, as Offer Documents' do.
 *
 * A Server Component; the ripple grid and the tiles' border glow are the
 * client leaves.
 */
export default function CorporateGovernancePage() {
  return (
    <SubPage masthead="ripple" title={governanceIndex.title}>
      <LinkGrid
        label={governanceIndex.title}
        items={governancePageList.map((page) => {
          const Mark = MARKS[page.slug] ?? Files;
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
