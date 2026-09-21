import type { Metadata } from 'next';
import { CapabilitySplit, type CapabilityItem } from '@/components/sections/capability-split';
import { PageHero } from '@/components/sections/page-hero';
import { ProjectsMap } from '@/components/sections/projects-map';
import { ProseSplit } from '@/components/sections/prose-split';
import {
  AutomationMark,
  ChainMark,
  HandshakeMark,
  TargetMark,
} from '@/components/sections/value-grid/business-marks';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  solarCellHero,
  solarCellHighlights,
  solarCellMeta,
  solarCellOverview,
  solarCellProjects,
  solarCellSites,
} from '../_content/solar-cell-manufacturing';

export const metadata: Metadata = buildMetadata({
  title: solarCellMeta.title,
  description: solarCellMeta.description,
  // The legacy URL, trailing slash included. /CLAUDE.md §2 rule 6.
  path: '/solar-cell-manufacturing/',
});

/** Drawn marks, in entry order — see `business-marks.tsx`. */
const HIGHLIGHT_MARKS = [
  <ChainMark key="chain" />,
  <AutomationMark key="automation" />,
  <TargetMark key="target" />,
  <HandshakeMark key="handshake" />,
];

const highlightItems: CapabilityItem[] = solarCellHighlights.items.map((item, index) => ({
  ...item,
  mark: HIGHLIGHT_MARKS[index],
}));

/**
 * Solar Cell Manufacturing — the Solar Energy template, four sections.
 *
 * Built to the client's reference screenshot for layout and to the live
 * https://www.sael.co/solar-cell-manufacturing/ for every word. Hero,
 * overview beside a masked photograph, the projects map with its one pin,
 * and the four highlights beside a masked photograph. No practice cards: the
 * live page has none and neither does the screenshot. No portfolio figure
 * either — see the note in `_content/solar-cell-manufacturing.ts`.
 *
 * A Server Component, and so is every section under it.
 */
export default function SolarCellManufacturingPage() {
  return (
    <div className="-mt-header lg:mt-0">
      <PageHero {...solarCellHero} />
      <ProseSplit {...solarCellOverview} />
      <ProjectsMap
        eyebrow={solarCellProjects.eyebrow}
        title={solarCellProjects.title}
        body={[...solarCellProjects.body]}
        map={solarCellProjects.map}
        mapLabel={solarCellProjects.mapLabel}
        sites={solarCellSites}
      />
      <CapabilitySplit
        eyebrow={solarCellHighlights.eyebrow}
        title={solarCellHighlights.title}
        items={highlightItems}
        media={solarCellHighlights.media}
      />
    </div>
  );
}
