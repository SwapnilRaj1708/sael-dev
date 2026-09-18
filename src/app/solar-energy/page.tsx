import type { Metadata } from 'next';
import { CapabilitySplit, type CapabilityItem } from '@/components/sections/capability-split';
import { PageHero } from '@/components/sections/page-hero';
import { ProjectsMap } from '@/components/sections/projects-map';
import { ProseSplit } from '@/components/sections/prose-split';
import { ValueGrid, type ValueGridItem } from '@/components/sections/value-grid';
import {
  DevelopmentMark,
  EfficiencyMark,
  EvacuationMark,
  PlanMark,
  ScadaMark,
  SelectionMark,
  TeamMark,
} from '@/components/sections/value-grid/solar-marks';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  solarCapabilities,
  solarEnergyHero,
  solarEnergyMeta,
  solarOverview,
  solarPractices,
  solarProjects,
  solarSites,
} from '../_content/solar-energy';

export const metadata: Metadata = buildMetadata({
  title: solarEnergyMeta.title,
  description: solarEnergyMeta.description,
  // `trailingSlash: true` in next.config.ts, and the legacy site's URL is
  // `/solar-energy/`. /CLAUDE.md §2 rule 6 — the canonical must match exactly.
  path: '/solar-energy/',
});

/**
 * The marks are joined here rather than in `_content/solar-energy.ts`
 * because a mark is a React node and the content file is data — the same
 * division About Us draws.
 *
 * Drawn in `value-grid/solar-marks.tsx` at the client's request of
 * 2026-09-18, in card order. See the note there on swapping one for a
 * supplied file.
 */
const CAPABILITY_MARKS = [
  <SelectionMark key="selection" />,
  <EfficiencyMark key="efficiency" />,
  <DevelopmentMark key="development" />,
];

const PRACTICE_MARKS = [
  <TeamMark key="team" />,
  <PlanMark key="plan" />,
  <EvacuationMark key="evacuation" />,
  <ScadaMark key="scada" />,
];

const capabilityItems: CapabilityItem[] = solarCapabilities.items.map((item, index) => ({
  ...item,
  mark: CAPABILITY_MARKS[index],
}));

const practiceItems: ValueGridItem[] = solarPractices.items.map((item, index) => ({
  ...item,
  mark: PRACTICE_MARKS[index],
}));

/**
 * Solar Energy — the first business page, on the About Us template.
 *
 * Built to the client's reference screenshot for layout and to the live
 * https://www.sael.co/solar-energy/ for every word. Five sections: the hero,
 * an overview beside a photograph, the projects map beside its copy and
 * portfolio figure, the three execution capabilities beside a photograph, and
 * the four EPC and O&M practice cards.
 *
 * `-mt-header lg:mt-0` is inherited from About Us and is about the masthead,
 * not snapping: below `lg` the bar overlays the page, so a full-bleed hero has
 * to start at the viewport top. See the note there.
 *
 * A Server Component, and so is every section under it apart from the
 * portfolio figure's count-up.
 */
export default function SolarEnergyPage() {
  return (
    <div className="-mt-header lg:mt-0">
      <PageHero {...solarEnergyHero} />
      <ProseSplit {...solarOverview} />
      <ProjectsMap {...solarProjects} sites={solarSites} />
      <CapabilitySplit
        eyebrow={solarCapabilities.eyebrow}
        title={solarCapabilities.title}
        items={capabilityItems}
        media={solarCapabilities.media}
      />
      {/* Outlined cards, as the reference draws them and as About Us's
          strategic pillars already are. */}
      <ValueGrid
        eyebrow={solarPractices.eyebrow}
        title={solarPractices.title}
        items={practiceItems}
        variant="outlined"
      />
    </div>
  );
}
