import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { DisplayHeading } from '@/components/ui/display-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';

export interface ValueGridItem {
  /**
   * The card's heading. Rendered as `<h3>` under the section's `<h2>`. Omit
   * for a card that is a numbered or marked paragraph with no heading of its
   * own — Module Manufacturing's "Manufacturing Prowess" cards.
   */
  name?: string;
  /** A numeral above the copy — "01". Meta type, not a heading. */
  ordinal?: string;
  body: string;
  /**
   * The mark at the head of the card. Always decorative — `name` is what
   * carries the meaning — so whatever is passed must be `aria-hidden`.
   * Use `<ValueMarkPending>` for an asset the client has not supplied.
   */
  mark: ReactNode;
}

export interface ValueGridProps {
  eyebrow?: string;
  title: string;
  items: readonly ValueGridItem[];
  /**
   * The grid's column floor. `default` is 260px, for short cards;
   * `wide` is 340px, for cards carrying a paragraph.
   */
  columns?: 'default' | 'wide';
  /** `tight` for a section between two taller ones. */
  spacing?: 'default' | 'tight';
  /**
   * Draw the accent that fills across each card's hairline on hover.
   * Off by default: a card that is not interactive should not suggest it is,
   * and neither of these two surfaces links anywhere. Ignored for `outlined`,
   * which has no hairline for the accent to run along.
   */
  accent?: boolean;
  /**
   * `hairline` is the v2 card — a top rule, left-aligned. `outlined` is the
   * client's reference of 2026-09-17 for the strategic pillars: a rounded box
   * bordered on all sides with the mark, name and copy centred inside it.
   */
  variant?: 'hairline' | 'outlined';
}

const COLUMNS_CLASS: Record<'default' | 'wide', string> = {
  default: 'grid-cols-[repeat(auto-fit,minmax(min(100%,var(--value-grid-col-min)),1fr))]',
  wide: 'grid-cols-[repeat(auto-fit,minmax(min(100%,var(--value-grid-col-min-wide)),1fr))]',
};

/**
 * The mark at the head of a value card.
 *
 * The eight guiding-principle icons are monochrome line art drawn in near-black
 * on transparent, so on the black card they would be invisible as supplied.
 * `brightness-0 invert` crushes any colour to black and then flips it to white
 * — the same treatment the homepage's goal marks take, and the reason it is
 * that pair rather than the design file's `invert(1) hue-rotate(180deg)`: hue
 * rotation exists to preserve colour through an inversion, and there is none
 * here to preserve.
 *
 * Always decorative. The card's heading is the mark's name, so announcing it
 * again would be repetition — `alt=""` and `aria-hidden` together, which is
 * what keeps a screen reader from landing on an empty graphic.
 *
 * Sized by `--value-mark-size` rather than by the width and height attributes,
 * which carry the asset's intrinsic 128px so `next/image` can reserve the box
 * and pick a sensible srcset. `image` accepts `null` for a page whose artwork
 * has not been supplied; it then holds the same box as a plain placeholder,
 * which is the bargain `<MediaFrame>` makes for photographs.
 */
export function ValueMark({ image, pending }: { image: StaticImageData | null; pending?: string }) {
  if (image === null) {
    return (
      <span
        aria-hidden="true"
        data-pending={pending}
        className="block size-(--value-mark-size) shrink-0 bg-inert/10"
      />
    );
  }

  return (
    <Image
      src={image}
      alt=""
      aria-hidden
      className="size-(--value-mark-size) shrink-0 object-contain brightness-0 invert"
    />
  );
}

/**
 * A heading over a grid of value cards — a mark, a name, a paragraph.
 *
 * Built to `About Us.dc.html` §05 "Our Strategic Pillars" (three cards, an
 * accent, the 260px floor) and §07 "Our Guiding Principles" (eight cards, no
 * accent, the 340px floor). One component, because the two differ only in
 * things that are properly props, and it is the shape FE-07 → FE-15 inherit
 * for any "here are N things we believe" surface.
 *
 * **The grid arrives as one `<Reveal>`, not one per card.** That is the
 * design's own composition and it is right here: eight cards cascading at
 * `--duration-reveal-step` apart would still be arriving long after the reader
 * got to them. The heading block above still cascades per element, which is
 * the rule that matters — see `design-reconciliation.md` §9.
 *
 * The mark is a `ReactNode` rather than an image, because the two surfaces
 * supply different kinds: §05's are line art drawn in `pillar-marks.tsx` and
 * animated, §07's are artwork files that have not been supplied. Keeping it a
 * node is what lets this component stay ignorant of the difference.
 *
 * A Server Component. The cards' hover and focus states are CSS.
 */
export function ValueGrid({
  eyebrow,
  title,
  items,
  columns = 'default',
  spacing = 'default',
  accent = false,
  variant = 'hairline',
}: ValueGridProps) {
  const outlined = variant === 'outlined';

  return (
    <Section background="black-dots" spacing={spacing === 'tight' ? 'tight' : 'default'}>
      <div className="flex w-full flex-col gap-flow">
        <div className="flex flex-col gap-stack">
          {eyebrow !== undefined && (
            <Reveal order={0}>
              <Eyebrow tone="bright">{eyebrow}</Eyebrow>
            </Reveal>
          )}

          <Reveal order={eyebrow === undefined ? 0 : 1}>
            <DisplayHeading ground="dark">{title}</DisplayHeading>
          </Reveal>
        </div>

        <Reveal order={2}>
          <div className={cn('grid gap-x-gap-grid gap-y-flow', COLUMNS_CLASS[columns])}>
            {items.map((item) => (
              <Card
                key={item.name ?? item.ordinal ?? item.body}
                as="article"
                ground="dark"
                shape={variant}
                inset={outlined ? 'none' : 'top'}
                accentClassName={
                  accent && !outlined ? 'bg-(image:--gradient-eyebrow-bright)' : undefined
                }
              >
                <div
                  className={cn(
                    'flex w-full flex-col gap-tight',
                    outlined && 'items-center gap-stack text-center',
                  )}
                >
                  {item.mark}
                  {item.ordinal !== undefined && (
                    <p className="text-meta text-on-dark-faint uppercase">{item.ordinal}</p>
                  )}
                  {item.name !== undefined && <h3 className="text-h3 text-white">{item.name}</h3>}
                  <p className="text-body-sm text-pretty text-on-dark-soft">{item.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
