import type { Metadata } from 'next';
import { CapabilitySplit, type CapabilityItem } from '@/components/sections/capability-split';
import { PageHero } from '@/components/sections/page-hero';
import { ProjectsMap } from '@/components/sections/projects-map';
import { ProseSplit } from '@/components/sections/prose-split';
import { ValueGrid, type ValueGridItem } from '@/components/sections/value-grid';
import {
  AirCooledMark,
  AirQualityMark,
  BaleMark,
  BoilerMark,
  CycleMark,
  FossilMark,
  RuralMark,
  SheafMark,
  SteadyMark,
  ThreePassMark,
} from '@/components/sections/value-grid/business-marks';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  wasteToEnergyBenefits,
  wasteToEnergyHero,
  wasteToEnergyMeta,
  wasteToEnergyOverview,
  wasteToEnergyProjects,
  wasteToEnergySites,
  wasteToEnergyTechnology,
} from '../_content/waste-to-energy';

export const metadata: Metadata = buildMetadata({
  title: wasteToEnergyMeta.title,
  description: wasteToEnergyMeta.description,
  // The legacy URL, trailing slash included. /CLAUDE.md §2 rule 6.
  path: '/waste-to-energy/',
});

/** Drawn marks, in entry order — see `business-marks.tsx`. */
const TECHNOLOGY_MARKS = [
  <BoilerMark key="boiler" />,
  <BaleMark key="bale" />,
  <ThreePassMark key="three-pass" />,
  <AirCooledMark key="air-cooled" />,
];

const BENEFIT_MARKS = [
  <CycleMark key="cycle" />,
  <RuralMark key="rural" />,
  <AirQualityMark key="air-quality" />,
  <FossilMark key="fossil" />,
  <SteadyMark key="steady" />,
  <SheafMark key="sheaf" />,
];

const technologyItems: CapabilityItem[] = wasteToEnergyTechnology.items.map((item, index) => ({
  ...item,
  mark: TECHNOLOGY_MARKS[index],
}));

const benefitItems: ValueGridItem[] = wasteToEnergyBenefits.items.map((item, index) => ({
  ...item,
  mark: BENEFIT_MARKS[index],
}));

/**
 * Waste To Energy — the Solar Energy template, all five sections.
 *
 * Built to the client's reference screenshot for layout and to the live
 * https://www.sael.co/waste-to-energy/ for every word. Hero, overview beside
 * a masked photograph, the projects map with its eleven plant pins and
 * portfolio figure, the four technology entries beside a masked photograph,
 * and six benefit cards — six, because that is what the live page has; the
 * screenshot's four identical cards were placeholder art.
 *
 * A Server Component apart from the portfolio figure's count-up.
 */
export default function WasteToEnergyPage() {
  return (
    <div className="-mt-header lg:mt-0">
      <PageHero {...wasteToEnergyHero} />
      <ProseSplit {...wasteToEnergyOverview} />
      <ProjectsMap {...wasteToEnergyProjects} sites={wasteToEnergySites} />
      <CapabilitySplit
        eyebrow={wasteToEnergyTechnology.eyebrow}
        title={wasteToEnergyTechnology.title}
        items={technologyItems}
        media={wasteToEnergyTechnology.media}
      />
      <ValueGrid
        eyebrow={wasteToEnergyBenefits.eyebrow}
        title={wasteToEnergyBenefits.title}
        items={benefitItems}
        variant="outlined"
      />
    </div>
  );
}
