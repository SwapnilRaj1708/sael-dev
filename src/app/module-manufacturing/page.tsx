import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { ProductDownloads } from '@/components/sections/product-downloads';
import { ProjectsMap } from '@/components/sections/projects-map';
import { ProseSplit } from '@/components/sections/prose-split';
import { ValueGrid, type ValueGridItem } from '@/components/sections/value-grid';
import {
  CertificateMark,
  DataMark,
  InspectionMark,
} from '@/components/sections/value-grid/business-marks';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  moduleDownloads,
  moduleHero,
  moduleMeta,
  moduleOverview,
  moduleProjects,
  moduleProwess,
  moduleSites,
} from '../_content/module-manufacturing';

export const metadata: Metadata = buildMetadata({
  title: moduleMeta.title,
  description: moduleMeta.description,
  // The legacy URL, trailing slash included. /CLAUDE.md §2 rule 6.
  path: '/module-manufacturing/',
});

/** Drawn marks, in card order — see `business-marks.tsx`. */
const PROWESS_MARKS = [
  <CertificateMark key="certificate" />,
  <DataMark key="data" />,
  <InspectionMark key="inspection" />,
];

const prowessItems: ValueGridItem[] = moduleProwess.items.map((item, index) => ({
  ...item,
  mark: PROWESS_MARKS[index],
}));

/**
 * Module Manufacturing — the Solar Energy template, and the one business page
 * with a section fewer.
 *
 * Built to SAEL's reference screenshot for layout and to
 * https://www.sael.co/module-manufacturing/ for every word, on SAEL's
 * instruction of 2026-09-18 for the four business pages. That instruction still
 * stands for them; it is not the general rule (/CLAUDE.md §2 rule 8). Hero, overview
 * beside a masked photograph, the projects map with its three state pins and
 * portfolio figure, the three product datasheets, and the three numbered
 * "Manufacturing Prowess" cards. There is no "How do we work?" list on this
 * page anywhere, so none is built. The datasheets link to the legacy site's
 * files for now — see `moduleDownloads` in `_content/module-manufacturing.ts`
 * for the cutover consequence.
 *
 * A Server Component apart from the portfolio figure's count-up.
 */
export default function ModuleManufacturingPage() {
  return (
    <div className="-mt-header business-ramp-module lg:mt-0">
      <PageHero titleGradient="module" {...moduleHero} />
      <ProseSplit titleGradient="module" {...moduleOverview} />
      <ProjectsMap titleGradient="module" {...moduleProjects} sites={moduleSites} />
      <ProductDownloads titleGradient="module" {...moduleDownloads} spacing="tight" />
      <ValueGrid
        titleGradient="module"
        title={moduleProwess.title}
        items={prowessItems}
        variant="outlined"
      />
    </div>
  );
}
