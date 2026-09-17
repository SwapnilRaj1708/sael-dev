import type { StaticImageData } from 'next/image';
import type { CutoutSplitProps } from '@/components/sections/cutout-split';
import type { PageHeroProps } from '@/components/sections/page-hero';
import type { ProseSplitProps } from '@/components/sections/prose-split';
import type { ValueGridItem, ValueGridProps } from '@/components/sections/value-grid';
import { cdnImage } from '@/lib/assets/cdn';

/**
 * The About Us page's static content.
 *
 * Static rather than dynamic for the same reason the homepage's is: this is
 * corporate copy that changes with a review and a deploy, not with a database
 * row. docs/content-model.md §2.
 *
 * **Every string here is transcribed verbatim from `About Us.dc.html`**, the
 * client's Claude Design project, which in turn carries the copy from the live
 * https://www.sael.co/about-us/. /CLAUDE.md §2 rule 3: none of it is
 * paraphrased, and nothing that was missing has been invented.
 *
 * ## The artwork
 *
 * The fourteen assets live in Azure Blob Storage under
 * `<container>/web-assets/images/about-us/` and are described by
 * `cdnImage(path, width, height)` — see `src/lib/assets/cdn.ts` for why that
 * helper exists and what it returns.
 *
 * **They were committed to `src/assets/images/about-us/` until 2026-09-17**,
 * because a bundled import carries the intrinsic width and height
 * `next/image` needs and a bare URL does not. The client uploaded the folder
 * on that date, the local copies were deleted, and `cdnImage()` closes the gap
 * they left by carrying those dimensions itself. Nothing downstream changed:
 * every prop is still a `StaticImageData`.
 *
 * **The dimensions below were read from the blobs, not from the local copies.**
 * They are what the browser reserves before a byte arrives, so a wrong one is
 * a layout shift. Two were not what the deleted files said they were.
 *
 * **`about-us-hero.JPG` is the one uppercase name in the folder.** Azure Blob
 * names are case-sensitive and that is the only URL that resolves, so it is
 * spelled in upper case here. It still wants renaming on the CDN — it is the
 * odd one out and the tracker carries it — but nothing is blocked by it now
 * that Turbopack is no longer asked to bundle the file.
 *
 * The marks are joined to their cards by the page, not here: a `mark` is a
 * React node, and this file is data.
 */

/** A pillar's copy. The page supplies the animated mark, which is drawn, not a file. */
export type PillarCopy = Omit<ValueGridItem, 'mark'>;

/**
 * A principle's copy and its icon.
 *
 * `null` when `AZURE_BLOB_BASE_URL` is unset — `<ValueMark>` then holds the
 * same box as a plain placeholder. See `lib/assets/cdn.ts`.
 */
export interface PrincipleCopy extends Omit<ValueGridItem, 'mark'> {
  icon: StaticImageData | null;
}

/**
 * Describe one asset in the About Us folder of the blob container.
 *
 * The prefix is written once here rather than fourteen times below, and
 * nowhere is a hostname written at all — `cdnImage()` composes it from
 * `AZURE_BLOB_BASE_URL` at render time. docs/asset-inventory.md §8.
 */
const aboutAsset = (file: string, width: number, height: number): StaticImageData | null =>
  cdnImage(`web-assets/images/about-us/${file}`, width, height);

/** The eight guiding-principle icons are all 128 square. */
const principleIcon = (n: number): StaticImageData | null =>
  aboutAsset(`principle-icon-${String(n)}.webp`, 128, 128);

export const aboutMeta = {
  title: 'About Us | SAEL',
  /**
   * The design's own `<meta name="description">`, which is also the hero's
   * standfirst. Supplied, so unlike the homepage's this is not a TODO.
   */
  description:
    'An integrated and diversified renewable energy company improving access to sustainable and clean energy',
} as const;

export const aboutHero: Omit<PageHeroProps, 'snap'> = {
  title: 'About Us',
  intro:
    'An integrated and diversified renewable energy company improving access to sustainable and clean energy',
  // The trail was dropped and the copy centred on 2026-09-17, at the client's
  // request. Kept so it can be restored by uncommenting.
  // breadcrumb: [
  //   { name: 'Home', href: '/' },
  //   // No `href`: "Company" groups the pages under it and is not one itself.
  //   { name: 'Company' },
  //   { name: 'About Us', href: '/about-us/' },
  // ],
  align: 'center',
  image: aboutAsset('about-us-hero.JPG', 6192, 4128),
  // Written from the photograph rather than supplied with it — the design's
  // slot carried no alt at all. It describes what is visible and asserts
  // nothing about who the six people are.
  imageAlt:
    'Six people seated around a boardroom table beneath the SAEL logo and its strapline, Sustainable and Affordable Energy for Life',
};

export const ourEndeavours: Omit<ProseSplitProps, 'snap'> = {
  title: 'Our Endeavours',
  body: [
    'At SAEL, we are continuously endeavouring to facilitate India’s adoption of clean and affordable energy projects. As one of India’s leading renewable energy companies, we are dedicated to enhancing the energy landscape nationwide.',
    'We are committed to environmentally sustainable and economically viable energy solutions. We are involved in developing and implementing renewable energy technologies, energy efficiency solutions, and possibly energy access initiatives for underserved communities.',
    'We acknowledge the pivotal role of energy access in enhancing the well-being and satisfaction of both our customers and the communities we serve. Our unwavering commitment is to improve access to sustainable and clean energy.',
  ],
  media: {
    image: aboutAsset('solar-field.webp', 1024, 1024),
    alt: 'Rows of solar panels stretching across open green countryside at sunset',
    orientation: 'landscape',
  },
};

export const ourAmbition: CutoutSplitProps = {
  title: 'Our Ambition',
  body: [
    'Our aim to sustain energy for life directs our decisions. This purpose ignites an empathic and compassionate blended action towards preserving our planet, ecological nourishment, and society-centered sustainability interventions.',
  ],
  media: {
    image: aboutAsset('our-ambition-person-image.webp', 700, 826),
    // Describes only what is visible. The asset is named "person-image" and
    // the design labelled it "Portrait photograph", so neither the sitter's
    // name nor their role has actually been supplied — and naming the wrong
    // person is worse than leaving it general. Still flagged in the tracker.
    alt: 'A person in a business suit standing in an office',
    orientation: 'portrait',
  },
  // One paragraph, so the copy is capped short rather than running out into a
  // long thin line beside the portrait. The design's own call.
  measure: 'narrow',
  // The client's cut-out composition of 2026-09-17: a shaped paper panel and
  // the same sitter cut out against it, one panel from `md` and a taller one
  // below. Both panels are SVG, which `<CutoutSplit>` renders `unoptimized`.
  panel: aboutAsset('bg-for-cutout.svg', 700, 405),
  panelMobile: aboutAsset('bg-for-cutout-mobile.svg', 179, 322),
  cutout: aboutAsset('cutout.png', 1076, 1984),
  cutoutAlt: 'A person in a business suit standing with hands clasped',
};

export const strategicPillars: {
  title: ValueGridProps['title'];
  items: readonly PillarCopy[];
} = {
  title: 'Our Strategic Pillars',
  items: [
    {
      name: 'Growth',
      body: 'We strive for sustainable growth through strategic locations and the development of world-class energy infrastructure.',
    },
    {
      name: 'Operational Excellence',
      body: 'We believe in doing everything to the best of our capabilities. Our vision of operational excellence is focused on safety, security, and reliability.',
    },
    {
      name: 'Sustainability',
      body: 'Leading the transition to a low-carbon economy through the pursuit of decarbonisation initiatives, including partnership opportunities with like-minded corporate citizens and business chambers.',
    },
  ],
};

/**
 * The eight principles, in the design's own order, paired with
 * `principle-icon-1` … `-8` **positionally**.
 *
 * The filenames are bare ordinals, so nothing in them says which principle an
 * icon belongs to. The pairing was therefore **checked against the artwork**
 * rather than assumed: a lightbulb for Entrepreneurial, stacked hands for
 * Teamwork, a handshake under a tick for Trust and Respect, a brain for Owner
 * Mind-Set and a wired brain for Continuous Learning all land on the design's
 * own order, and the remaining three are consistent with it. Positional it is.
 *
 * The two that are least self-evident are 5 and 7 — a plain handshake for
 * Integrity and a figure ringed by arrows for Outcome Focused. Both read
 * correctly, but they are the pair to look at first if anyone ever reports an
 * icon looking wrong.
 */
export const guidingPrinciples: {
  eyebrow: string;
  title: ValueGridProps['title'];
  items: readonly PrincipleCopy[];
} = {
  eyebrow: 'What We Believe',
  title: 'Our Guiding Principles',
  items: [
    {
      name: 'Customer-Centric',
      body: 'Foster a positive internal and external customer experience at every stage of the customer journey to build customer loyalty and satisfaction. Always consider the outcomes our decisions will have on the customer.',
      icon: principleIcon(1),
    },
    {
      name: 'Entrepreneurial',
      body: 'Have an optimistic interpretation of adverse events and see problems as potential opportunities; highly resilient, resourceful, and solutions-oriented even within highly uncertain, resource constrained environments.',
      icon: principleIcon(2),
    },
    {
      name: 'Teamwork',
      body: 'Value diverse teams of people. Encourage and help each other through collaboration. Inspire the exchange of ideas to come up with creative ways of doing things.',
      icon: principleIcon(3),
    },
    {
      name: 'Trust and Respect',
      body: 'Extend trust and create a feeling of belonging, listen to different perspectives by being respectful and professional.',
      icon: principleIcon(4),
    },
    {
      name: 'Integrity',
      body: 'Always honest, we do the right thing and adhere to moral and ethical principles for self and team.',
      icon: principleIcon(5),
    },
    {
      name: 'Owner Mind-Set',
      body: 'Demonstrate ownership, taking smart risks, while remaining aligned to organizational pillars. Encourage individuals to take responsibility to hold themselves and others accountable.',
      icon: principleIcon(6),
    },
    {
      name: 'Outcome Focused',
      body: 'Have passion to exceed ambitious goals and safely deliver high quality business results. Strive to delegate for outcomes rather than by task.',
      icon: principleIcon(7),
    },
    {
      name: 'Continuous Learning',
      body: 'Inquisitive and open-minded, actively seeks new and varied experiences, and ideas. Is passionate about continual learning for self and team.',
      icon: principleIcon(8),
    },
  ],
};
