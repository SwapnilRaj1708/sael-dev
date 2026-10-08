import { Check } from 'lucide-react';
import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { DisplayHeading } from '@/components/ui/display-heading';
import { MediaFrame } from '@/components/ui/media-frame';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_BELIEF_CUTOUT } from '@/lib/utils/image-sizes';

/** A belief's accent — one of the bright ramps' stops. See --color-ramp-*. */
export type BeliefAccent = 'violet' | 'rose' | 'coral' | 'indigo';

const ACCENT_CLASS: Record<BeliefAccent, string> = {
  violet: 'text-ramp-violet',
  rose: 'text-ramp-rose',
  coral: 'text-ramp-coral',
  indigo: 'text-ramp-indigo',
};

export interface BeliefCutout {
  /** A cut-out on a transparent ground, fitted rather than cropped. */
  image: StaticImageData | null;
  /** Meaningful description, or `''` if the cut-out is decorative. */
  alt: string;
  /** The asset's name in docs/asset-inventory.md, for the pending placeholder. */
  pending?: string;
}

/** One belief: what its card says and shows. */
export interface Belief {
  /** The section's `id`, so a belief can be linked to; its heading's is derived. */
  id: string;
  title: string;
  body: string;
  /** The checklist under the copy, in order. */
  points: readonly string[];
  /** A white line icon, drawn inside the diamond badge. Decorative. */
  icon: ReactNode;
  cutout: BeliefCutout;
  accent: BeliefAccent;
  /** Which half of the card the cut-out takes from `lg`. Beliefs alternate. */
  side: 'start' | 'end';
}

export interface BeliefSectionProps extends Belief {
  /** Something under the card — the page's closing action, on the last belief. */
  action?: ReactNode;
  /** Opt into the page's section snapping. See `data-snap-sections`. */
  snap?: boolean;
}

/**
 * One belief on Our Core Beliefs, as a screen of its own — an outlined card
 * holding a diamond badge, a display heading, a paragraph and a checklist,
 * beside a cut-out figure.
 *
 * Built to `Our Core Beliefs.dc.html` (FE-14). The design stacks the four
 * cards in one long column; the page snaps from one to the next as the
 * homepage does (the client's call of 2026-10-06), so each card is its own
 * section, a screen tall with the card centred in it. Below `lg` a card is
 * taller than a phone's screen, and a snapping section that is taller than
 * the screen scrolls freely inside and snaps at its edges — see globals.css.
 *
 * Three things the design adds to the outlined card, all kept to this file:
 *
 *  - **The cut-out breaks out of the card below `lg`.** It is fitted into a
 *    box that rises `--spacing-belief-rise` out of the card's top edge, the
 *    section's top padding makes room for that, and the card pads its own top
 *    to clear the rest. From `lg` the cut-out is half of the card instead,
 *    fitted and centred in it, alternating sides.
 *  - **A diamond badge** — the live page's diamond, kept: a hairline square
 *    turned 45° with the line icon upright inside it.
 *  - **One accent per belief**, on the check marks and on a glow pooled
 *    behind the cut-out, and nowhere else. The glow's gradient is drawn in
 *    `currentColor` (--gradient-belief-glow-*), so the layer that paints it
 *    takes the accent as its text colour and one token serves all four.
 *
 * The card takes **no hover light** (`hoverEffect={false}`). It is not
 * interactive, and it already carries a light of its own; the two would
 * compete — the same reasoning as the CTA panel's.
 *
 * A Server Component; only `<Reveal>` is client.
 */
export function BeliefSection({
  id,
  title,
  body,
  points,
  icon,
  cutout,
  accent,
  side,
  action,
  snap = false,
}: BeliefSectionProps) {
  const titleId = `${id}-title`;

  return (
    <Section
      id={id}
      aria-labelledby={titleId}
      background="black-dots"
      // Tight, so a belief fits one screen at the sizes the site is
      // reviewed at: the card is the screen's content, not a band in it.
      spacing="tight"
      data-snap-section
      className={cn(
        // Below `lg` the cut-out rises out of the card's top edge, so the
        // section's top padding carries that rise on top of the rhythm.
        'pt-[calc(var(--spacing-section-y-tight)+var(--spacing-belief-rise))] lg:pt-section-y-tight',
        snap && 'flex min-h-viewport snap-start items-center',
      )}
    >
      <Card
        shape="outlined"
        ground="dark"
        inset="none"
        hoverEffect={false}
        className={cn(
          'isolate flex-col pt-belief-card-top',
          'lg:grid lg:items-stretch lg:gap-x-ledger-col-gap lg:pt-flow',
          // The copy takes seven parts to the cut-out's five, so a belief's
          // name holds one line and the card fits a screen; the design's even
          // split set every name on two. The cut-out is fitted, not cropped,
          // so the narrower column costs it nothing but size.
          side === 'end'
            ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]'
            : 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]',
        )}
      >
        {/* The accent's glow, under everything in the card. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 rounded-card-outlined',
            'bg-(image:--gradient-belief-glow-top)',
            side === 'end'
              ? 'lg:bg-(image:--gradient-belief-glow-end)'
              : 'lg:bg-(image:--gradient-belief-glow-start)',
            ACCENT_CLASS[accent],
          )}
        />

        <div
          className={cn(
            'flex flex-col lg:row-start-1',
            side === 'end' ? 'lg:col-start-1' : 'lg:col-start-2',
          )}
        >
          <Reveal order={0}>
            {/* The badge. The square is the frame and the icon stands upright
                in it; both are decoration, the heading names the belief. */}
            <span aria-hidden="true" className="relative block size-14 shrink-0 lg:size-16">
              <span className="absolute inset-0 flex items-center justify-center text-white [&_svg]:size-6 lg:[&_svg]:size-7">
                {icon}
              </span>
            </span>
          </Reveal>

          <Reveal order={1} className="mt-inset">
            <DisplayHeading id={titleId} ground="dark" className="w-fit text-balance">
              {title}
            </DisplayHeading>
          </Reveal>

          <Reveal order={2} className="mt-inset">
            <p className="max-w-(--measure) text-body text-pretty text-body-on-dark">{body}</p>
          </Reveal>

          <Reveal order={3} className="mt-inset">
            <ul className="flex flex-col">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-inset border-t border-hairline-dark py-3 last:border-b lg:py-2.5"
                >
                  <Check
                    aria-hidden="true"
                    focusable="false"
                    className={cn('size-5 shrink-0', ACCENT_CLASS[accent])}
                  />
                  <span className="text-body text-white">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal
          order={1}
          className={cn(
            // Below `lg`: a box over the card's top edge, the figure standing
            // on its foot so it meets the badge rather than floating.
            'absolute inset-x-4 -top-belief-rise h-belief-cutout',
            // From `lg`: a column of the card, the figure fitted and centred.
            'lg:relative lg:inset-x-auto lg:top-auto lg:row-start-1 lg:h-auto lg:min-h-belief-media',
            side === 'end' ? 'lg:col-start-2' : 'lg:col-start-1',
          )}
        >
          <MediaFrame
            image={cutout.image}
            alt={cutout.alt}
            sizes={SIZES_BELIEF_CUTOUT}
            pending={cutout.pending}
            // A cut-out has its own transparent ground: no fill behind it.
            className="absolute inset-0 bg-transparent"
            imageClassName="object-contain object-bottom lg:object-center"
          />
        </Reveal>
      </Card>

      {action !== undefined && action !== null && (
        <Reveal order={4} className="mt-flow flex justify-center">
          {action}
        </Reveal>
      )}
    </Section>
  );
}
