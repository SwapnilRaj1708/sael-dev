import type { StaticImageData } from 'next/image';
import { DisplayHeading } from '@/components/ui/display-heading';
import { MediaFrame } from '@/components/ui/media-frame';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_PROSE_MEDIA_LANDSCAPE, SIZES_PROSE_MEDIA_PORTRAIT } from '@/lib/utils/image-sizes';

/** Which way up the photograph beside the copy is drawn. */
export type ProseSplitOrientation = 'landscape' | 'portrait';

export interface ProseSplitMedia {
  image: StaticImageData | null;
  alt: string;
  /** The asset's name in docs/asset-inventory.md, for the pending placeholder. */
  pending?: string;
  /** `landscape` is 4:3 capped at 560px; `portrait` is 4:5 capped at 420px. */
  orientation: ProseSplitOrientation;
}

export interface ProseSplitProps {
  title: string;
  /** One entry per paragraph, in order. */
  body: string[];
  /** Omit for a section that is copy only — then it is a prose *block*. */
  media?: ProseSplitMedia;
  /**
   * How wide the copy is allowed to run. `default` is `--measure` (68ch), for
   * a section of several paragraphs; `narrow` is `--ledger-measure` (46ch),
   * which is what the design sets on a single-paragraph statement so it does
   * not run out into a long thin line beside a portrait.
   */
  measure?: 'default' | 'narrow';
  snap?: boolean;
}

const MEASURE_CLASS: Record<'default' | 'narrow', string> = {
  default: 'max-w-(--measure)',
  narrow: 'max-w-(--ledger-measure)',
};

const MEDIA_CLASS: Record<ProseSplitOrientation, string> = {
  landscape: 'aspect-(--aspect-prose-landscape) max-w-(--prose-media-landscape-w)',
  portrait: 'aspect-(--aspect-prose-portrait) max-w-(--prose-media-portrait-w)',
};

const MEDIA_SIZES: Record<ProseSplitOrientation, string> = {
  landscape: SIZES_PROSE_MEDIA_LANDSCAPE,
  portrait: SIZES_PROSE_MEDIA_PORTRAIT,
};

/**
 * A display heading and running copy beside one photograph.
 *
 * Built to `About Us.dc.html` §02 "Our Endeavours" and §04 "Our Ambition",
 * which are the same composition twice with three differences — how many
 * paragraphs, how wide the copy runs, and which way up the artwork is. All
 * three are props, so this is one component rather than two, and it is the
 * shape FE-07 → FE-15 inherit for a narrative section.
 *
 * It also answers `docs/features/06-about-us.md`'s `<ProseBlock>`: with `media`
 * omitted the grid has one column and this *is* a heading over capped copy.
 * A separate primitive for that case would have been the same file with a
 * branch removed.
 *
 * **The grid is one `auto-fit` track, not a breakpoint.** Both columns have a
 * `--prose-split-col-min` floor, so the section reflows on the space it
 * actually has rather than on an arbitrary viewport width — which is what
 * keeps it correct inside a snap area on a short laptop screen as well as on a
 * phone. `min(100%, …)` inside the `minmax` is what stops a 380px floor from
 * overflowing a 360px viewport. docs/responsive-strategy.md §4.
 *
 * The copy is DOM-first and screen-first, so the reading order is the same
 * stacked as it is side by side.
 *
 * A Server Component. Nothing here is interactive.
 */
export function ProseSplit({
  title,
  body,
  media,
  measure = 'default',
  snap = false,
}: ProseSplitProps) {
  return (
    <Section
      data-snap-section
      background="black-dots"
      className={cn('flex items-center', snap && 'min-h-viewport snap-start')}
    >
      <div
        className={cn(
          'grid w-full items-center gap-x-ledger-col-gap gap-y-flow',
          'grid-cols-[repeat(auto-fit,minmax(min(100%,var(--prose-split-col-min)),1fr))]',
        )}
      >
        <div className="flex flex-col gap-flow">
          <Reveal order={0}>
            <DisplayHeading ground="dark">{title}</DisplayHeading>
          </Reveal>

          <div className={cn('flex flex-col gap-stack', MEASURE_CLASS[measure])}>
            {body.map((paragraph, index) => (
              <Reveal key={paragraph} order={index + 2}>
                <p className="text-body text-pretty text-body-on-dark">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {media !== undefined && (
          <Reveal
            order={body.length + 2}
            // `justify-self-center` and the auto margins keep the artwork
            // centred in its column once the cap binds, rather than pinned to
            // the column's start edge with the slack all on one side.
            className={cn(
              'relative mx-auto w-full justify-self-center',
              MEDIA_CLASS[media.orientation],
            )}
          >
            <MediaFrame
              image={media.image}
              alt={media.alt}
              sizes={MEDIA_SIZES[media.orientation]}
              pending={media.pending}
              className="absolute inset-0"
            />
          </Reveal>
        )}
      </div>
    </Section>
  );
}
