import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { CtaPanel } from '@/components/sections/cta-panel';
import { GalleryGrid } from '@/components/sections/gallery-grid';
import { PageHero } from '@/components/sections/page-hero';
import { PointStack, type PointStackItem } from '@/components/sections/point-stack';
import { ProseSplit } from '@/components/sections/prose-split';
import { ValueGrid, type ValueGridItem } from '@/components/sections/value-grid';
import {
  AppreciationMark,
  BalanceMark,
  CultureMark,
  EmpowermentMark,
  IntegrityMark,
  LeadershipMark,
  PathMark,
  TeamworkMark,
} from '@/components/sections/value-grid/career-marks';
import { Button } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  careerHero,
  careerIntro,
  careerMeta,
  careerPortalUrl,
  cultureValues,
  jobCta,
  lifeAtSael,
  whyJoin,
} from '../_content/career';

export const metadata: Metadata = buildMetadata({
  title: careerMeta.title,
  description: careerMeta.description,
  // `trailingSlash: true` in next.config.ts, and the legacy site's URL is
  // `/career/`. /CLAUDE.md §2 rule 6 — the canonical must match exactly.
  path: '/career/',
});

/**
 * The marks are joined here rather than in `_content/career.ts` because a
 * mark is a React node and the content file is data — the same division
 * every other page draws. Drawn in `value-grid/career-marks.tsx`, in card
 * order; see the note there on swapping one for a supplied file.
 */
const CULTURE_MARKS = [
  <EmpowermentMark key="empowerment" />,
  <AppreciationMark key="appreciation" />,
  <TeamworkMark key="teamwork" />,
  <IntegrityMark key="integrity" />,
  <BalanceMark key="balance" />,
];

const POINT_MARKS = [
  <CultureMark key="culture" />,
  <PathMark key="path" />,
  <LeadershipMark key="leadership" />,
];

const cultureItems: ValueGridItem[] = cultureValues.items.map((item, index) => ({
  ...item,
  mark: CULTURE_MARKS[index],
}));

const pointItems: PointStackItem[] = whyJoin.points.map((point, index) => ({
  ...point,
  mark: POINT_MARKS[index],
}));

/**
 * A link to the client's Oracle recruiting portal, or nothing.
 *
 * Both CTAs on the page leave the site for the same destination, and both
 * open in a new tab as the live page's do. This is the applicant's route:
 * there is no form on the page, as there is none on the live one, and the
 * portal is where an application is made. `<Button>` renders a real anchor
 * for an external href and adds `rel="noopener noreferrer"` itself when the
 * target is `_blank`; the visually-hidden suffix is the accessible
 * indication that the link opens a new tab
 * (docs/accessibility-and-seo.md §5). `null` when `CAREER_REDIRECT_URL` is
 * unset — a button that goes nowhere is worse than no button.
 */
function PortalLink({ label }: { label: string }) {
  if (careerPortalUrl === null) return null;

  return (
    <Button href={careerPortalUrl} target="_blank">
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
      <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" focusable="false" />
    </Button>
  );
}

/**
 * Careers — a page as of 2026-09-22, no longer a redirect.
 *
 * Built to the live https://www.sael.co/career/ for every word and every
 * asset, on the inner-page template, and enhanced in layout rather than in
 * content at the client's request: the five culture cards balance rather
 * than hang, the "Why Join" points stand beside their copy as outlined
 * cards, the job CTA is a lit, centred panel, and the four "Life at SAEL"
 * photographs are a two-by-two gallery. Dark throughout, on the client's
 * instruction of 2026-09-22.
 *
 * **No form.** The live page's markup carries a "Get In Touch" modal, but
 * nothing on that page opens it — its trigger class has no elements — so a
 * visitor never sees it, and the client confirmed on 2026-09-22 that
 * applicants go to the Oracle portal through the two "Explore" links
 * instead. Six sections, in the live page's order. One `<h1>` (the hero), an
 * `<h2>` per section, `<h3>` on every card.
 *
 * `-mt-header lg:mt-0` is inherited from About Us and is about the masthead,
 * not snapping: below `lg` the bar overlays the page, so a full-bleed hero
 * has to start at the viewport top. See the note there.
 *
 * A Server Component. The hero's `<VideoFrame>` is the only client leaf.
 */
export default function CareerPage() {
  return (
    <div className="-mt-header lg:mt-0">
      <PageHero {...careerHero} />

      <ProseSplit
        eyebrow={careerIntro.eyebrow}
        title={careerIntro.title}
        body={careerIntro.body}
        media={careerIntro.media}
        action={<PortalLink label={careerIntro.cta} />}
      />

      <ValueGrid
        eyebrow={cultureValues.eyebrow}
        title={cultureValues.title}
        items={cultureItems}
        // Five cards: five across at the design width, three-and-two on a
        // laptop, two-two-one on a tablet — centred, not hung left.
        balance
        // The accent that fills across the hairline on hover, as the guiding
        // principles, the team cards and the capability rows carry it.
        accent
      />

      <ProseSplit
        eyebrow={whyJoin.eyebrow}
        title={whyJoin.title}
        body={whyJoin.body}
        aside={<PointStack items={pointItems} />}
      />

      <CtaPanel
        title={jobCta.title}
        body={jobCta.body}
        action={<PortalLink label={jobCta.cta} />}
      />

      {/* The last section on the page: extra room beneath the photographs
          before the footer's pixel strip, the client's ask of 2026-09-22. */}
      <GalleryGrid {...lifeAtSael} spacing="closing" />
    </div>
  );
}
