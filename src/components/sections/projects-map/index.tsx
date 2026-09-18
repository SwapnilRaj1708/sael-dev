import type { StaticImageData } from 'next/image';
import {
  PresenceMapFigure,
  type PresenceSite,
} from '@/components/sections/presence-map/map-figure';
import { CountUp } from '@/components/ui/count-up';
import { DisplayHeading } from '@/components/ui/display-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';

export interface ProjectsMapFigure {
  /** Pre-formatted, unit included — "8299.5 MWp". Every digit run counts up. */
  value: string;
  /** The caption under it — "Portfolio". */
  label: string;
}

export interface ProjectsMapProps {
  /** The small uppercase label — "Projects". */
  eyebrow: string;
  title: string;
  /** One entry per paragraph, in order. */
  body: string[];
  /** The headline figure under the copy. */
  figure: ProjectsMapFigure;
  /** The dotted India artwork. `null` until it is supplied. */
  map: { image: StaticImageData | null };
  /** The project sites, one pin each. */
  sites: readonly PresenceSite[];
  /** The map's accessible name — "Map of SAEL solar project sites across India". */
  mapLabel: string;
}

/**
 * A heading over the dotted India map beside running copy and one large
 * figure — the Solar Energy page's "Projects" section.
 *
 * **Why this is not `<PresenceMap>` with a prop.** The two sections share the
 * artwork and nothing else. The homepage's column is a display heading, a
 * footprint caption and two counts; this one is two paragraphs and a
 * portfolio figure, under a heading that spans both columns. A `variant` on
 * `<PresenceMap>` would have been a switch over two unrelated compositions.
 * The shared half — the map, its pins and their hover/focus contract — was
 * extracted to `<PresenceMapFigure>` instead, and both sections compose their
 * own copy beside it. The legend is off here: a solar-only map would say
 * "Solar Energy Generation" beside every pin, which is the page's own title.
 *
 * **Map left, copy right, heading above both** — the client's reference.
 * Below `lg` the row stacks and the copy comes first, because it is first in
 * the DOM: the heading, the paragraphs and the figure are the section's
 * content, and the map is their illustration. `lg:flex-row-reverse` is what
 * puts the map on the left only once there is a left to put it on.
 *
 * The figure is `<CountUp>`, so it counts in on arrival and sits still under
 * `prefers-reduced-motion`. Its colour is the solar business's own accent,
 * the same one its figures take on the homepage ledger.
 *
 * A Server Component apart from the figure's count-up.
 */
export function ProjectsMap({
  eyebrow,
  title,
  body,
  figure,
  map,
  sites,
  mapLabel,
}: ProjectsMapProps) {
  return (
    <Section background="black-dots">
      <div className="flex w-full flex-col gap-flow">
        <div className="flex flex-col gap-stack">
          <Reveal order={0}>
            <Eyebrow tone="bright">{eyebrow}</Eyebrow>
          </Reveal>

          <Reveal order={1}>
            <DisplayHeading ground="dark">{title}</DisplayHeading>
          </Reveal>
        </div>

        <div
          className={cn(
            'flex w-full flex-col items-center gap-flow',
            'lg:flex-row-reverse lg:items-center lg:justify-center',
          )}
        >
          <div className="flex w-full max-w-(--map-copy-w) flex-col gap-stack lg:pl-(--map-copy-pad)">
            {body.map((paragraph, index) => (
              <Reveal key={paragraph} order={index + 2}>
                <p className="text-body text-pretty text-body-on-dark">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal order={body.length + 2} className="mt-stack flex flex-col gap-tight">
              <p className="text-stat-large text-figure-solar-bright tabular-nums">
                <CountUp value={figure.value} />
              </p>
              <p className="text-h3 text-white">{figure.label}</p>
            </Reveal>
          </div>

          <PresenceMapFigure
            order={body.length + 3}
            map={map}
            sites={sites}
            label={mapLabel}
            legend={false}
          />
        </div>
      </div>
    </Section>
  );
}
