import type { StaticImageData } from 'next/image';
import type { Belief } from '@/components/sections/belief-stack';
import type { PageHeroProps } from '@/components/sections/page-hero';
import type { CollageImage } from '@/components/sections/page-hero/collage-backdrop';
import { legacyOrCdnImage } from '@/lib/assets/cdn';
import { TODO_CONTENT } from '@/lib/config/site';
import { legacyOrBlobUrl } from '@/lib/utils/blob-url';
import { formatFileSize } from '@/lib/utils/format-file-size';

/**
 * Our Core Beliefs' static content (FE-14).
 *
 * ## The copy
 *
 * The design's, `Our Core Beliefs.dc.html` (Claude Design project
 * `6afc516d-…`, 2026-10-06), which its handoff records as the live page's
 * word for word, line breaks collapsed. The live page's own spellings stand —
 * "Protected Area Management- Go/No Go Framework", "Optimisation", "Active
 * member of IBBI". Nothing is added: the belief sections carry no eyebrows,
 * figures or quotes, as the live page carries none.
 *
 * ## The artwork
 *
 * The live page's own files, not yet in the blob container: read from the
 * legacy site while `LEGACY_ASSET_BASE_URL` is set, and from
 * `web-assets/media/our-core-beliefs/` once it is unset, which is where they
 * should be uploaded with their names unchanged. Dimensions are the legacy
 * files'. See `legacyOrCdnImage()`.
 *
 * **The three hero photographs are 600px wide**, and the collage draws each
 * at about 480 × 740 at 1440, so they are upscaled. Higher-resolution files
 * (1200px wide or more) are on SAEL's list.
 *
 * The four belief images are cut-outs on transparent grounds, fitted rather
 * than cropped. Alt text is written from the images themselves; the
 * design's handoff had to infer two of them from file names.
 *
 * The icons are joined to their beliefs by the page, not here: an icon is a
 * React node, and this file is data.
 */

/** Describe one of the page's images. See the note above. */
const beliefsImage = (file: string, width: number, height: number): StaticImageData | null =>
  legacyOrCdnImage(`web-assets/media/our-core-beliefs/${file}`, `/img/site/${file}`, width, height);

export const coreBeliefsMeta = {
  /** The live page's own `<title>`, verbatim. */
  title: 'Our Core Beliefs - SAEL',
  /**
   * The live page ships `<meta name="description" content="">`. Nothing to
   * transcribe; `buildMetadata()` drops the marker rather than emitting it.
   */
  description: TODO_CONTENT,
} as const;

/** The hero's copy. Its backdrop is the collage below, joined by the page. */
export const coreBeliefsHero: Omit<PageHeroProps, 'backdrop' | 'snap'> = {
  eyebrow: 'Sustainability',
  title: 'Our Core Beliefs',
  intro:
    'Our core beliefs are rooted in Sustainability, Driven by Integrity, and Empowered by Innovation.',
  // No trail, as on every inner page since 2026-09-17, and the design
  // draws none. The page jump links the live hero carries were removed at
  // the client's request.
  align: 'center',
  // The collage stands in for the photograph; see `<PageHero backdrop>`.
  image: null,
  imageAlt: '',
};

/** The hero collage, left to right. */
export const coreBeliefsCollage: readonly CollageImage[] = [
  {
    image: beliefsImage('new-our-core-beliefs-1.webp', 600, 545),
    alt: 'Two pairs of hands holding a seedling in soil above a meadow of wildflowers',
    pending: 'our-core-beliefs/hero-1',
  },
  {
    image: beliefsImage('new-our-core-beliefs-2.webp', 600, 513),
    alt: 'A group of people sitting in a circle, holding hands',
    pending: 'our-core-beliefs/hero-2',
  },
  {
    image: beliefsImage('new-birds-our-core-beliefs-3.webp', 600, 1040),
    alt: 'Two green bee-eaters perched on a thorny branch',
    pending: 'our-core-beliefs/hero-3',
  },
];

/** A belief's copy and artwork. The page supplies its icon. */
export type BeliefCopy = Omit<Belief, 'icon'>;

/**
 * In page order. The cut-out alternates sides from `lg` — end, start, end,
 * start — and each belief takes the next stop of the bright ramp as its
 * accent.
 */
export const beliefs: readonly BeliefCopy[] = [
  {
    id: 'environmental-stewardship',
    title: 'Environmental Stewardship',
    body: 'We are dedicated to minimizing our environmental impact and promoting sustainability in every aspect of our operations. This commitment guides our practices, from resource conservation and waste reduction to energy efficiency and eco-friendly innovations.',
    points: [
      'Transition towards Green Fleet',
      'Preserving Biodiversity & Natural Landscapes',
      'GHG Emissions & Avoidance Management',
      'Waste Management Standards',
      'Natural Resource Optimisation',
      'Climate Resilience & Policy Advocacy',
    ],
    cutout: {
      image: beliefsImage('obf-1.webp', 700, 719),
      alt: 'Cupped hands holding a seedling in a mound of soil',
      pending: 'our-core-beliefs/obf-1',
    },
    accent: 'violet',
    side: 'end',
  },
  {
    id: 'our-social-impact',
    title: 'Our Social Impact',
    body: 'We believe in the importance of social responsibility and are dedicated to addressing key social issues through a range of initiatives. Our commitment extends to fostering community development, supporting education, promoting well-being, and advocating for social equity.',
    points: [
      'Community Giving Strategy',
      'Employee Welfare & Diversity',
      'Health & Safety Standards',
      'Social Impact Assessment Initiatives',
    ],
    cutout: {
      image: beliefsImage('farmers-group.webp', 664, 538),
      alt: 'A group of smiling farmers in white turbans and kurtas',
      pending: 'our-core-beliefs/farmers-group',
    },
    accent: 'rose',
    side: 'start',
  },
  {
    id: 'sustainability-governance',
    title: 'Sustainability Governance',
    body: 'It involves creating structures, processes, and policies to integrate sustainability into our governance framework. This includes dedicated committees, environmental management systems, and clear guidelines to ensure accountability and continual improvement.',
    points: [
      'Corporate Governance Structure',
      'Sustainability Policies & Frameworks',
      'Risk Management',
      'Supply Chain Management',
    ],
    cutout: {
      image: beliefsImage('sustainability-governance-banner.webp', 700, 757),
      alt: 'A light bulb with a tree growing inside it',
      pending: 'our-core-beliefs/sustainability-governance-banner',
    },
    accent: 'coral',
    side: 'end',
  },
  {
    id: 'our-biodiversity-commitment',
    title: 'Our Biodiversity Commitment',
    body: 'We are championing biodiversity and are fully committed to a thriving and sustainable future. Our efforts focus on protecting and enhancing natural ecosystems, preserving diverse species, and promoting environmental stewardship.',
    points: [
      'Biodiversity Impact Assessment',
      'Protected Area Management- Go/No Go Framework',
      'Active member of IBBI',
    ],
    cutout: {
      image: beliefsImage('our-biodiversity-commitment-bird.webp', 952, 758),
      alt: 'A black-winged kite perched on a budding branch',
      pending: 'our-core-beliefs/our-biodiversity-commitment-bird',
    },
    accent: 'indigo',
    side: 'start',
  },
];

/** The report's size on the legacy site and in the inventory, in bytes. */
const ESG_REPORT_BYTES = 8_143_097;

/**
 * The ESG Report link after the last belief — a button, not the floating tab
 * the live page uses, on the design's reasoning: a tab would be a new fixed
 * element, and over the content on a phone.
 *
 * **Not the design's URL.** The design links `/report/sael-esg-report-cy-2023.pdf`,
 * which is the live page's own link and **answers 404 on the legacy site**
 * (checked 2026-10-06). The same file — 8,143,097 bytes — is live at the
 * investor documents path, and that is where the content repository's
 * fixture and docs/asset-inventory.md §8 place it in the container, so it
 * is linked from there: the legacy copy while `LEGACY_ASSET_BASE_URL` is set,
 * the blob otherwise. `null` if neither can be composed, and the page then
 * draws no link.
 *
 * It is the CY 2023 report because that is what the live page offers. The
 * Corporate Governance page also lists a later one (CY 2024); which this
 * should be is SAEL's call.
 */
export const esgReport = {
  label: 'ESG Report',
  href: legacyOrBlobUrl(
    'web-assets/documents/investors/corporate-governance/sustainability-reports/sael-esg-report-cy-2023.pdf',
    '/documents/investors/corporate-governance/sustainability-reports/sael-esg-report-cy-2023.pdf',
  ),
  /** Read with the label, so the link says what it opens before it is followed. */
  description: `PDF, ${formatFileSize(ESG_REPORT_BYTES)}, opens in a new tab`,
} as const;
