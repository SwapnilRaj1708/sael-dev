import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { ProseSplit } from '@/components/sections/prose-split';
import { ValueGrid, ValueMark, type ValueGridItem } from '@/components/sections/value-grid';
import {
  ExcellenceMark,
  GrowthMark,
  SustainabilityMark,
} from '@/components/sections/value-grid/pillar-marks';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  aboutHero,
  aboutMeta,
  guidingPrinciples,
  ourAmbition,
  ourEndeavours,
  strategicPillars,
} from '../_content/about-us';

export const metadata: Metadata = buildMetadata({
  title: aboutMeta.title,
  description: aboutMeta.description,
  // `trailingSlash: true` in next.config.ts, and the legacy site's URL is
  // `/about-us/`. /CLAUDE.md §2 rule 6 — the canonical must match exactly.
  path: '/about-us/',
});

/**
 * The three pillar marks, in the order the design lists their cards.
 *
 * Joined here rather than in `_content/about-us.ts` because a mark is a React
 * node and the content file is data. Same division the homepage draws when it
 * joins static tile copy to live capacity figures.
 */
const PILLAR_MARKS = [
  <GrowthMark key="growth" />,
  <ExcellenceMark key="excellence" />,
  <SustainabilityMark key="sustainability" />,
];

const pillarItems: ValueGridItem[] = strategicPillars.items.map((pillar, index) => ({
  ...pillar,
  mark: PILLAR_MARKS[index],
}));

const principleItems: ValueGridItem[] = guidingPrinciples.items.map((principle) => ({
  name: principle.name,
  body: principle.body,
  // Supplied 2026-09-10. <ValueMark> inverts them to white — they are drawn
  // in near-black on transparent and would be invisible on the card as they
  // come.
  mark: <ValueMark image={principle.icon} />,
}));

/**
 * About Us — the first content page, and the template FE-07 → FE-15 inherit.
 *
 * Built to `About Us.dc.html` (Claude Design project
 * `f05dd0a1-42c8-4f44-b688-f8dceb7f677b`), read through the design MCP.
 *
 * **Five sections against the design's seven.** The design wraps its stats
 * band (§03) and its Mission/Vision/Ethos triad (§06) in `sc-if` flags whose
 * placeholder value is `false` — that is, it draws the page with both off, and
 * both already exist on the homepage. `docs/features/06-about-us.md` §3–4 asks
 * for both to be reused here. The client's call on 2026-09-10 was to follow
 * the design and omit them; the deviation is recorded in the tracker so it can
 * be reversed with two lines if that ruling changes.
 *
 * `data-snap-sections` and `-mt-header lg:mt-0` are the same three-part opt-in
 * the homepage uses: globals.css matches the attribute with `html:has(…)`, and
 * the negative margin gives back the `pt-header` the root layout puts on
 * `<main>` so the full-bleed hero starts at the viewport top. Below `lg` the
 * masthead overlays the page; from `lg` the offset is real again.
 * docs/design-guidelines.md §8.7.
 *
 * A Server Component, and so is every section under it — nothing on this page
 * is interactive beyond links and CSS hover states.
 */
export default function AboutUsPage() {
  return (
    <div data-snap-sections className="-mt-header lg:mt-0">
      <PageHero {...aboutHero} snap />
      <ProseSplit {...ourEndeavours} snap />
      <ProseSplit {...ourAmbition} snap />
      <ValueGrid title={strategicPillars.title} items={pillarItems} spacing="tight" accent snap />
      <ValueGrid
        eyebrow={guidingPrinciples.eyebrow}
        title={guidingPrinciples.title}
        items={principleItems}
        columns="wide"
        snap
      />
    </div>
  );
}
