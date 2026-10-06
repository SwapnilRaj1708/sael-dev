import {
  Building2,
  CalendarCheck,
  ChartColumn,
  FileChartColumn,
  FileCheckCorner,
  FilePenLine,
  FilePlusCorner,
  Files,
  FileText,
  FileVideoCamera,
  FolderDown,
  GraduationCap,
  HandCoins,
  HandHeart,
  Layers,
  Leaf,
  Network,
  Presentation,
  ScrollText,
  UserRoundCog,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { governanceIndex } from '@/app/_content/corporate-governance';
import { financialsIndex } from '@/app/_content/financials-and-reports';
import { offerDocumentsIndex } from '@/app/_content/offer-documents';
import { LinkGrid } from '@/components/sections/link-grid';
import { SubPage } from '@/components/sections/sub-page';
import type { InvestorSection } from '@/lib/content';

/**
 * An investor area's index — the tiles of Offer Documents, Corporate
 * Governance and Financials & Reports. Page code, beside the routes that
 * render it: **the live index and its Live Preview both**, so what a
 * reviewer approves is laid out by the markup that will publish it.
 */

type IndexedSection = Exclude<InvestorSection, 'notifications'>;

interface AreaIndexChrome {
  title: string;
  /**
   * The tiles' marks, by slug, and the one a tile a maker adds takes until a
   * mark is chosen for it here. The legacy indexes draw stock Flaticon icons
   * of unknown licence, which are not carried over; these are lucide's, which
   * the project ships under ISC, chosen to say what the legacy ones said.
   * Decorative — the title names the tile.
   */
  marks: Readonly<Record<string, LucideIcon>>;
  fallbackMark: LucideIcon;
  /**
   * Whether a short last row is centred rather than left under a full one —
   * Financials' five tiles, 3 + 2 on a desktop, rather than four over a lone
   * fifth. It balances any count the panel produces.
   */
  balance: boolean;
}

const CHROME: Record<IndexedSection, AreaIndexChrome> = {
  // A checked document for the DRHP, a correction, an addition, a chart, a
  // video (the same one for both languages, as on the legacy page), money in
  // hand, a building.
  'offer-documents': {
    title: offerDocumentsIndex.title,
    marks: {
      drhp: FileCheckCorner,
      'corrigendum-to-drhp': FilePenLine,
      'addendum-to-drhp': FilePlusCorner,
      'industry-report': FileChartColumn,
      'drhp-audio-visuals-english': FileVideoCamera,
      'drhp-audio-visuals-hindi': FileVideoCamera,
      'outstanding-dues-to-material-creditors': HandCoins,
      'information-with-respect-to-group-companies': Building2,
    },
    fallbackMark: FileText,
    balance: false,
  },
  // The board, a committee, a code, a leaf for sustainability, a hand for
  // CSR, a meeting, learning for the directors' familiarization, and a stack
  // of documents.
  'corporate-governance': {
    title: governanceIndex.title,
    marks: {
      'board-of-directors': Users,
      'board-committees': UserRoundCog,
      'codes-and-policies': ScrollText,
      'sustainability-reports': Leaf,
      csr: HandHeart,
      'general-meeting': Presentation,
      'familiarization-programme': GraduationCap,
      'other-documents': Files,
    },
    fallbackMark: Files,
    balance: false,
  },
  // A dated return, layered (consolidated) accounts, one company's accounts,
  // a group of companies, and downloads.
  'financials-and-reports': {
    title: financialsIndex.title,
    marks: {
      'annual-return': CalendarCheck,
      'consolidated-financials-of-the-company': Layers,
      'standalone-financials-of-the-company': ChartColumn,
      'standalone-financials-of-material-subsidiary-companies': Network,
      'investor-downloads': FolderDown,
    },
    fallbackMark: Layers,
    balance: true,
  },
};

export interface AreaIndexProps {
  section: IndexedSection;
  /** The area's pages, in order — `areaPages()`: static pages first, then the tiles. */
  pages: readonly { slug: string; name: string; path: string }[];
}

/**
 * The ripple band with the area's name, then a tile for each page, each
 * linking to its page and not to a file. On `<SubPage>` without its side
 * panel, since this page *is* that list. Nothing is gated here; the notices
 * live on the pages they guard.
 *
 * A Server Component; the ripple grid and the tiles' border glow are the
 * client leaves.
 */
export function AreaIndex({ section, pages }: AreaIndexProps) {
  const { title, marks, fallbackMark, balance } = CHROME[section];

  return (
    <SubPage masthead="ripple" title={title}>
      <LinkGrid
        label={title}
        balance={balance}
        items={pages.map((page) => {
          const Mark = marks[page.slug] ?? fallbackMark;
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
