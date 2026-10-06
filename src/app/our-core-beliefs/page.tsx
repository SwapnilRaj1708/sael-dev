import { ArrowUpRight, Bird, Landmark, Leaf, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { BeliefStack, type Belief } from '@/components/sections/belief-stack';
import { PageHero } from '@/components/sections/page-hero';
import { CollageBackdrop } from '@/components/sections/page-hero/collage-backdrop';
import { Button } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  beliefs,
  coreBeliefsCollage,
  coreBeliefsHero,
  coreBeliefsMeta,
  esgReport,
} from '../_content/our-core-beliefs';

export const metadata: Metadata = buildMetadata({
  title: coreBeliefsMeta.title,
  description: coreBeliefsMeta.description,
  // `trailingSlash: true` in next.config.ts, and the legacy site's URL is
  // `/our-core-beliefs/`. /CLAUDE.md §2 rule 6.
  path: '/our-core-beliefs/',
});

/**
 * The beliefs' icons, in card order. Joined here rather than in
 * `_content/our-core-beliefs.ts` because an icon is a React node and the
 * content file is data — the division every page draws.
 *
 * lucide's leaf, users, landmark and bird, which are the design's own
 * stand-ins and are this site's icon set. Decorative: the badge they sit
 * in is `aria-hidden`, and the heading beside it names the belief.
 */
const BELIEF_ICONS = [
  <Leaf key="leaf" />,
  <Users key="users" />,
  <Landmark key="landmark" />,
  <Bird key="bird" />,
];

const beliefItems: Belief[] = beliefs.map((belief, index) => ({
  ...belief,
  icon: BELIEF_ICONS[index],
}));

/** The ESG Report link, or nothing if its URL cannot be composed. */
function EsgReportLink() {
  if (esgReport.href === null) return null;

  return (
    <Button
      href={esgReport.href}
      target="_blank"
      variant="pill"
      // The full width on a phone, where the pill is the easier target;
      // its own width from `sm`.
      className="w-full sm:w-fit"
    >
      {esgReport.label}
      <span className="sr-only"> ({esgReport.description})</span>
      <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" focusable="false" />
    </Button>
  );
}

/**
 * Our Core Beliefs (FE-14) — a collage hero, the four beliefs as outlined
 * cards, and the ESG Report.
 *
 * Built to `Our Core Beliefs.dc.html` (Claude Design project `6afc516d-…`,
 * 2026-10-06), read through the design MCP. Two sections:
 *
 *  - the standard `<PageHero>`, centred, with `<CollageBackdrop>` in the
 *    photograph's place — three photographs side by side in the client's
 *    `8.svg` panel shape, fading into the ground;
 *  - `<BeliefStack>`, the four beliefs as cards with their cut-outs, icons,
 *    checklists and accents, and the ESG Report pill under the last.
 *
 * **The page snaps, as the homepage does** (the client's call of 2026-10-06):
 * the hero is the first stop, each belief is a screen of its own, and the
 * footer is the last. It uses the homepage's mechanism, `data-snap-sections`
 * in globals.css, and nothing of its own. The design draws the beliefs as
 * one column with wide gaps; as screens, the gaps are the sections' own.
 *
 * `docs/features/14-our-core-beliefs.md` asks for `<HighlightGrid>` and no
 * new section components. The design draws something `<HighlightGrid>`
 * cannot — a card per belief, each with a cut-out, a checklist and its own
 * accent — so `<BeliefStack>` is new, and is the one new section here.
 * Mission/Vision/Ethos is not repeated: the design does not draw it.
 *
 * `-mt-header lg:mt-0`: below `lg` the masthead overlays the page rather than
 * offsetting it, so the sections start at the viewport top. See the homepage.
 *
 * A Server Component; only the reveals are client.
 */
export default function OurCoreBeliefsPage() {
  return (
    <div data-snap-sections className="-mt-header lg:mt-0">
      <PageHero
        {...coreBeliefsHero}
        backdrop={<CollageBackdrop images={coreBeliefsCollage} />}
        snap
      />
      <BeliefStack beliefs={beliefItems} action={<EsgReportLink />} snap />
    </div>
  );
}
