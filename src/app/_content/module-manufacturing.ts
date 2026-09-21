import type { StaticImageData } from 'next/image';
import dottedMap from '@/assets/images/dotted-map.svg';
import type { PageHeroProps } from '@/components/sections/page-hero';
import type { PresenceSite } from '@/components/sections/presence-map';
import type { ProductDownloadsProps } from '@/components/sections/product-downloads';
import type { ProjectsMapProps } from '@/components/sections/projects-map';
import type { ProseSplitProps } from '@/components/sections/prose-split';
import type { ValueGridItem, ValueGridProps } from '@/components/sections/value-grid';
import { cdnImage } from '@/lib/assets/cdn';
import { PRODUCTION_URL, TODO_CONTENT } from '@/lib/config/site';
import { tryBlobUrl } from '@/lib/utils/blob-url';
import { SIZES_BUSINESS_OVERVIEW_MEDIA } from '@/lib/utils/image-sizes';

/**
 * The Module Manufacturing page's static content.
 *
 * **Every string here is transcribed verbatim from the live
 * https://www.sael.co/module-manufacturing/**, read from its HTML on
 * 2026-09-19 with only its source whitespace collapsed. The client's
 * reference screenshot fixed the layout, not the copy. Follows
 * `solar-energy.ts`.
 *
 * ## The page with a section fewer
 *
 * There is no "How do we work?" list here, on the live page or in the
 * screenshot. The page goes hero → overview → projects → the three product
 * sheets → the three "Manufacturing Prowess" cards.
 *
 * ## Where the screenshot and the live page disagree
 *
 * - **The portfolio figure.** The screenshot draws only the caption "Module
 *   Manufacturing Portfolio"; the live page draws two counters over it,
 *   landing on **3625 MW + 5000 MW (proposed)**. The live page wins on content,
 *   so the figure is carried. It is the same value the homepage ledger sets
 *   as `3625 MW + 5 GW` — the live page writes the second in MW.
 * - **"Product Downloads."** The live page lists three product-sheet PDFs
 *   between the map and the prowess cards; the screenshot has no such block.
 *   Left out at first, because the PDFs live under the legacy site's
 *   `/documents/`, which the new site does not serve; **built on the
 *   client's ask of 2026-09-21**, linking to the legacy files where they are.
 *   See `moduleDownloads` for what that means at cutover.
 * - **"More Details" on the Punjab pin** links to `/firozpur-project-details/`,
 *   a page the new site does not have. Only the "Visit Location" link is
 *   carried.
 * - **The prowess cards have no headings**, on the live page or in the
 *   screenshot: a mark and a sentence. The live page also numbers them 01–03;
 *   the client asked for the numerals dropped on 2026-09-21, so `<ValueGrid>`
 *   renders them with neither `ordinal` nor `name`.
 *
 * ## The artwork
 *
 * The hero video and the one photograph live in Azure Blob Storage under
 * `<container>/web-assets/media/module-manufacturing/`, supplied 2026-09-21.
 * Only container-relative paths are committed; the host comes from
 * `AZURE_BLOB_BASE_URL` (/CLAUDE.md §7). The hero poster is still `null`.
 * There is no second photograph, and correctly so — this is the page without
 * a capability section. The map is the homepage's `dotted-map.svg`.
 *
 * **The photograph was briefly a pre-shaped asset and is not one now.** The
 * first export, `mask1Image.webp`, arrived 700 x 613 with the cut already in
 * its alpha channel, so it was drawn unmasked at its own ratio — the one
 * business-page photograph that did not take `--mask-solar-overview`. The
 * client replaced it on 2026-09-21 with an opaque 501 x 501 JPEG, which is
 * what the other five assets are, so this page now takes the shared mask
 * like every other and the bespoke `--aspect-module-overview` token is gone.
 * The `.webp` is superseded and can be deleted from the container.
 */

export type ProwessCopy = Omit<ValueGridItem, 'mark'>;

const PENDING: StaticImageData | null = null;

/** Describe one asset in the Module Manufacturing folder of the blob container. */
const moduleAsset = (file: string, width: number, height: number): StaticImageData | null =>
  cdnImage(`web-assets/media/module-manufacturing/${file}`, width, height);

export const moduleMeta = {
  /**
   * The live page's own `<title>`, verbatim — a hyphen where the other three
   * business pages carry a pipe. Transcribed, not normalised; FE-22 settles
   * the separator against the legacy titles (see `our-team.ts`).
   */
  title: 'Module Manufacturing - SAEL',
  /** The live page ships an empty description. Nothing invented. */
  description: TODO_CONTENT,
} as const;

export const moduleHero: PageHeroProps = {
  title: 'Module Manufacturing',
  intro:
    "Modules: Building Blocks of Innovation, Engineered for Excellence, Shaping Tomorrow's Technology Landscape",
  align: 'center',
  // Supplied 2026-09-21, as on Solar Energy and Waste To Energy: a video
  // rather than a photograph. `null` when the container is unconfigured, and
  // the hero then shows its poster.
  video: tryBlobUrl('web-assets/media/module-manufacturing/module-manufacturing.mp4'),
  // The poster under the video and the still for reduced motion. Not yet
  // supplied.
  image: PENDING,
  pending: 'module-manufacturing/hero-poster',
  /** The live page's own alt, verbatim. */
  imageAlt: 'Module Manufacturing',
};

export const moduleOverview: ProseSplitProps = {
  eyebrow: 'Overview',
  title: 'About Module Manufacturing',
  body: [
    "SAEL stands at the forefront of sustainable innovation as a leading solar module manufacturing company. With a steadfast commitment to excellence, we harness cutting-edge technology to produce high-quality solar modules, featuring operational solar module assembly lines with a combined capacity of 3.625 GW per year in Rajasthan and Punjab, India. We are manufacturing the latest Bi-facial N-Type TOPCon modules, with the industry's leading efficiency.",
    "Our dedication to sustainability extends beyond products; it's ingrained in every aspect of our operations.",
  ],
  media: {
    image: moduleAsset('mask1Image.jpg', 501, 501),
    // The live page's slot carries no alt. Written from the photograph
    // itself.
    alt: 'A robotic arm lifting a solar module by vacuum cups on an assembly line inside a factory',
    orientation: 'landscape',
    frame: 'aspect-(--aspect-solar-overview) max-w-(--business-overview-media-w)',
    mask: 'mask-(--mask-solar-overview)',
    sizes: SIZES_BUSINESS_OVERVIEW_MEDIA,
  },
};

/**
 * The three sites the live page's map carries, in its order. The live page
 * pins states rather than towns here, so the coordinates are the homepage's
 * own state pins for Punjab, Rajasthan and Uttar Pradesh.
 */
export const moduleSites: readonly PresenceSite[] = [
  {
    id: 'punjab',
    name: 'Punjab',
    x: 83.4,
    y: 60.4,
    figures: [{ metric: 'module-assembly', value: '300 MW' }],
    // href: 'https://maps.app.goo.gl/k7XpdviL8peJT1NT6',
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    x: 45.4,
    y: 124.4,
    figures: [{ metric: 'module-assembly', value: '3.2 GW' }],
    // href: 'https://maps.app.goo.gl/UW8wXkYiQQG7WzHdA',
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh (proposed)',
    x: 121.4,
    y: 116.4,
    figures: [{ metric: 'module-assembly', value: '5 GW' }],
  },
];

export const moduleProjects: Omit<ProjectsMapProps, 'sites'> = {
  eyebrow: 'Projects',
  title: 'Module Manufacturing',
  body: [
    "SAEL distinguishes itself as one of the select Indian renewable energy firms equipped with in-house solar manufacturing and assembly infrastructure. Currently, we are developing a robust ecosystem for Solar PV manufacturing, featuring operational solar module assembly lines with a combined capacity of 3.625 GW per year in Rajasthan and Punjab and an upcoming 5 GW facility in Uttar Pradesh, India. We are manufacturing the latest Bi-facial N-Type TOPCon modules, with the industry's leading efficiency.",
  ],
  // The live page's two counters and their static tail, as they land.
  figure: { value: '3625 MW + 5000 MW (proposed)', label: 'Module Manufacturing Portfolio' },
  map: { image: dottedMap },
  mapLabel: 'Map of SAEL module manufacturing sites across India',
  business: 'module-assembly',
};

export const moduleProwess: {
  title: ValueGridProps['title'];
  items: readonly ProwessCopy[];
} = {
  // No label on the live page or in the screenshot — the one section on the
  // four business pages that opens straight on its heading.
  title: 'Manufacturing Prowess',
  items: [
    {
      body: 'ISO 9001, ISO 45001 and ISO 27001 certifications for Module Manufacturing Assembly',
    },
    {
      body: 'MES integration for real-time and data-driven quality assurance',
    },
    {
      body: 'Integrated with intelligent inspection and control systems',
    },
  ],
};

/**
 * "Product Downloads" — the three module datasheets, titles verbatim from the
 * live page.
 *
 * **The hrefs point at the legacy site's files, on purpose and for now.** The
 * PDFs are served by the current sael.co under `/documents/product-downloads/`
 * and nowhere else; they are not committed here (/CLAUDE.md §8) and have not
 * been uploaded to the blob container. The client's instruction of 2026-09-21
 * was to link to where they are today. Composed on `PRODUCTION_URL` rather
 * than a bare path so the links work from a staging host — and so that it is
 * plain that **the day the new site takes over www.sael.co, these become
 * 404s** unless the three files have been moved to blob storage and the hrefs
 * rebuilt with `tryBlobUrl()`. That is a cutover task.
 *
 * No sizes: the legacy page shows none and the files were not fetched to
 * measure them.
 */
export const moduleDownloads = {
  title: 'Product Downloads',
  items: [
    {
      title: 'SAEL Solar TOPCon Bifacial G12R 615 635 Wp',
      href: `${PRODUCTION_URL}/documents/product-downloads/sael-solar-topcon-bifacial-g12r-615-635-wp.pdf`,
    },
    {
      title: 'SAEL Solar TOPCon Bifacial M10R 580 600 Wp',
      href: `${PRODUCTION_URL}/documents/product-downloads/sael-solar-topcon-bifacial-m10r-580-600-wp.pdf`,
    },
    {
      title: 'SAEL Solar Mono PERC Bifacial M10R 540 560 Wp',
      href: `${PRODUCTION_URL}/documents/product-downloads/sael-solar-mono-perc-bifacial-m10r-540-560-wp.pdf`,
    },
  ],
} satisfies Pick<ProductDownloadsProps, 'title' | 'items'>;
