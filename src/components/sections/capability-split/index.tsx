import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { DisplayHeading } from '@/components/ui/display-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_SOLAR_EXECUTION_MEDIA } from '@/lib/utils/image-sizes';

export interface CapabilityItem {
  /** The entry's heading. Rendered as `<h3>` under the section's `<h2>`. */
  name: string;
  body: string;
  /**
   * The mark under the heading. Decorative — `name` carries the meaning — so
   * whatever is passed must be `aria-hidden`. Omit for an entry without one.
   */
  mark?: ReactNode;
}

export interface CapabilitySplitMedia {
  image: StaticImageData | null;
  alt: string;
  /** The asset's name in docs/asset-inventory.md, for the pending placeholder. */
  pending?: string;
}

export interface CapabilitySplitProps {
  /** The small uppercase label — "How Do We Work?". */
  eyebrow: string;
  title: string;
  items: readonly CapabilityItem[];
  /** The portrait photograph beside the list. */
  media: CapabilitySplitMedia;
}

/**
 * A heading over a hairline-separated list of capabilities beside one
 * masked photograph — the Solar Energy page's "How Do We Work?" section.
 *
 * **A new section rather than a `<ValueGrid>` or a `<ProseSplit>`.** The
 * entries are value cards in content — a name, a mark, a paragraph — but not
 * in composition: they stack in one column, separated by rules that run the
 * column's width, with a photograph beside the whole stack. `<ValueGrid>` lays
 * its cards out in a grid and has no media slot; `<ProseSplit>` has the media
 * slot but takes paragraphs, not headed entries. Each row *is* the v2 `<Card>`
 * in its hairline idiom, `inset="block"` so the rule sits between rows, and a
 * closing rule under the last one so the stack reads as a list rather than as
 * three cards hanging in space.
 *
 * The list is a `<div>` of `<article>`s rather than a `<ul>`: each entry has
 * its own heading, and a screen reader walking headings gets the same
 * structure a list would give it, without the row count read twice.
 *
 * Same `auto-fit` grid as `<ProseSplit>`, and for the same reason — the row
 * reflows on the space it has, and `min(100%, …)` keeps the 380px floor from
 * overflowing a 360px viewport. The list is first in the DOM, so stacked it
 * reads before the photograph.
 *
 * A Server Component. Nothing here is interactive; the rows are not links.
 */
export function CapabilitySplit({ eyebrow, title, items, media }: CapabilitySplitProps) {
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
            'grid w-full items-center gap-x-ledger-col-gap gap-y-flow',
            'grid-cols-[repeat(auto-fit,minmax(min(100%,var(--prose-split-col-min)),1fr))]',
          )}
        >
          <Reveal order={2} className="flex flex-col border-b border-hairline-dark">
            {items.map((item) => (
              <Card key={item.name} as="article" ground="dark" inset="block">
                <div className="flex w-full flex-col gap-tight">
                  <div className="flex flex-col items-center gap-tight text-center">
                    <h3 className="text-h3 text-white">{item.name}</h3>
                    {item.mark}
                  </div>
                  <p className="text-body-sm text-pretty text-on-dark-soft">{item.body}</p>
                </div>
              </Card>
            ))}
          </Reveal>

          {/* The photograph, clipped to the designer's notched panel
              (`solarEnergy/mask2.svg`) by the same alpha-mask idiom
              `intro-split` uses. The box takes the mask's own ratio so
              --mask-fill stretches nothing. */}
          <Reveal
            order={3}
            className={cn(
              'relative mx-auto w-full max-w-(--solar-execution-media-w) justify-self-center',
              'aspect-(--aspect-solar-execution)',
              'mask-(--mask-solar-execution) mask-size-(--mask-fill) mask-no-repeat',
            )}
          >
            <MediaFrame
              image={media.image}
              alt={media.alt}
              sizes={SIZES_SOLAR_EXECUTION_MEDIA}
              pending={media.pending}
              className="absolute inset-0"
            />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
