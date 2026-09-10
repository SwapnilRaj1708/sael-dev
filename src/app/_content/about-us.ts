import aboutHeroImage from '@/assets/images/about-us/about-us-hero.jpg';
import ambitionPortrait from '@/assets/images/about-us/our-ambition-person-image.webp';
import principleIcon1 from '@/assets/images/about-us/principle-icon-1.webp';
import principleIcon2 from '@/assets/images/about-us/principle-icon-2.webp';
import principleIcon3 from '@/assets/images/about-us/principle-icon-3.webp';
import principleIcon4 from '@/assets/images/about-us/principle-icon-4.webp';
import principleIcon5 from '@/assets/images/about-us/principle-icon-5.webp';
import principleIcon6 from '@/assets/images/about-us/principle-icon-6.webp';
import principleIcon7 from '@/assets/images/about-us/principle-icon-7.webp';
import principleIcon8 from '@/assets/images/about-us/principle-icon-8.webp';
import solarField from '@/assets/images/about-us/solar-field.webp';
import type { StaticImageData } from 'next/image';
import type { PageHeroProps } from '@/components/sections/page-hero';
import type { ProseSplitProps } from '@/components/sections/prose-split';
import type { ValueGridItem, ValueGridProps } from '@/components/sections/value-grid';

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
 * The eleven assets were supplied on 2026-09-10 as CDN URLs under
 * `<container>/web-assets/images/about-us/`. They are **imported**, not
 * referenced by URL, and they sit at `src/assets/images/about-us/` — the path
 * that mirrors the CDN's own, filename for filename.
 *
 * **One filename does not mirror.** The hero is `about-us-hero.JPG` on the CDN
 * and `about-us-hero.jpg` here, because Turbopack will not bundle an uppercase
 * extension ("Unknown module type") and Azure Blob names are case-sensitive, so
 * the lowercase URL 404s. Every other file in that folder is already lowercase,
 * which makes the blob the odd one out — **it wants renaming on the CDN**, and
 * until it is, the one-line `cdnImage()` swap described below has to spell this
 * file with the uppercase extension. Flagged in the tracker.
 *
 * That is deliberate and it is what `src/lib/assets/cdn.ts` expects: a bundled
 * import carries the intrinsic width, height and `blurDataURL` the bundler
 * measured, which `next/image` needs in order to reserve the right box and
 * avoid a layout shift, and which a bare URL string throws away. When the CDN
 * work merges, pointing these at it is `cdnImage(solarField, 'about-us/solar-field.webp')`
 * per import and nothing else changes — every `StaticImageData` prop
 * downstream is untouched and cannot tell the difference.
 *
 * The marks are joined to their cards by the page, not here: a `mark` is a
 * React node, and this file is data.
 */

/** A pillar's copy. The page supplies the animated mark, which is drawn, not a file. */
export type PillarCopy = Omit<ValueGridItem, 'mark'>;

/** A principle's copy and its supplied icon. */
export interface PrincipleCopy extends Omit<ValueGridItem, 'mark'> {
  icon: StaticImageData;
}

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
  breadcrumb: [
    { name: 'Home', href: '/' },
    // No `href`: "Company" groups the pages under it and is not one itself.
    { name: 'Company' },
    { name: 'About Us', href: '/about-us/' },
  ],
  image: aboutHeroImage,
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
    image: solarField,
    alt: 'Rows of solar panels stretching across open green countryside at sunset',
    orientation: 'landscape',
  },
};

export const ourAmbition: Omit<ProseSplitProps, 'snap'> = {
  title: 'Our Ambition',
  body: [
    'Our aim to sustain energy for life directs our decisions. This purpose ignites an empathic and compassionate blended action towards preserving our planet, ecological nourishment, and society-centered sustainability interventions.',
  ],
  media: {
    image: ambitionPortrait,
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
      icon: principleIcon1,
    },
    {
      name: 'Entrepreneurial',
      body: 'Have an optimistic interpretation of adverse events and see problems as potential opportunities; highly resilient, resourceful, and solutions-oriented even within highly uncertain, resource constrained environments.',
      icon: principleIcon2,
    },
    {
      name: 'Teamwork',
      body: 'Value diverse teams of people. Encourage and help each other through collaboration. Inspire the exchange of ideas to come up with creative ways of doing things.',
      icon: principleIcon3,
    },
    {
      name: 'Trust and Respect',
      body: 'Extend trust and create a feeling of belonging, listen to different perspectives by being respectful and professional.',
      icon: principleIcon4,
    },
    {
      name: 'Integrity',
      body: 'Always honest, we do the right thing and adhere to moral and ethical principles for self and team.',
      icon: principleIcon5,
    },
    {
      name: 'Owner Mind-Set',
      body: 'Demonstrate ownership, taking smart risks, while remaining aligned to organizational pillars. Encourage individuals to take responsibility to hold themselves and others accountable.',
      icon: principleIcon6,
    },
    {
      name: 'Outcome Focused',
      body: 'Have passion to exceed ambitious goals and safely deliver high quality business results. Strive to delegate for outcomes rather than by task.',
      icon: principleIcon7,
    },
    {
      name: 'Continuous Learning',
      body: 'Inquisitive and open-minded, actively seeks new and varied experiences, and ideas. Is passionate about continual learning for self and team.',
      icon: principleIcon8,
    },
  ],
};
