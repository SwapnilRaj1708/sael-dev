import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { DisplayHeading } from '@/components/ui/display-heading';
import { Eyebrow, type EyebrowTone } from '@/components/ui/eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Reveal } from '@/components/ui/reveal';
import { Section, type SectionProps } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_PROSE_MEDIA_LANDSCAPE, SIZES_PROSE_MEDIA_PORTRAIT } from '@/lib/utils/image-sizes';

/** Which way up the photograph beside the copy is drawn. */
export type ProseSplitOrientation = 'landscape' | 'portrait';

/** The ground the section is drawn on. */
export type ProseSplitGround = 'dark' | 'paper';

export interface ProseSplitMedia {
  image: StaticImageData | null;
  alt: string;
  /** The asset's name in docs/asset-inventory.md, for the pending placeholder. */
  pending?: string;
  /** `landscape` is 4:3 capped at 560px; `portrait` is 4:5 capped at 420px. */
  orientation: ProseSplitOrientation;
  /**
   * Utilities describing the media box — its aspect and width cap, e.g.
   * `aspect-(--aspect-solar-overview) max-w-(--business-overview-media-w)`.
   * **Replaces** the orientation's own pair rather than layering over them,
   * so the box is described in one place. Omit for the orientation's
   * default, which is what About Us draws.
   */
  frame?: string;
  /**
   * A mask utility that clips the photograph to a supplied shape, e.g.
   * `mask-(--mask-solar-overview)`. Applied with `--mask-fill` and
   * `mask-no-repeat`, so `frame` must carry that shape's own aspect or the
   * mask is stretched.
   *
   * Omit for a photograph that arrives with its shape already cut into its
   * alpha channel — masking one of those a second time clips the shape it
   * already has. Every business-page asset is currently an opaque rectangle,
   * so every one of them passes a mask; the escape hatch is here because one
   * export briefly was not.
   */
  mask?: string;
  /**
   * The `sizes` hint for the photograph. Defaults to the orientation's; a
   * `mask` that widens the box must supply the hint that matches it.
   */
  sizes?: string;
}

export interface ProseSplitProps {
  /** The small uppercase label above the heading. Omit for a section without one. */
  eyebrow?: string;
  title: string;
  /** One entry per paragraph, in order. */
  body: string[];
  /** Omit for a section that is copy only — then it is a prose *block*. */
  media?: ProseSplitMedia;
  /**
   * Something other than a photograph beside the copy — a stack of cards, a
   * form. Takes the photograph's column and its reveal order. Ignored when
   * `media` is given: a section has one thing beside its copy, not two.
   */
  aside?: ReactNode;
  /**
   * An action under the copy — a `<Button>`. Rendered after the last
   * paragraph, in its own step of the cascade, so the CTA lands after the
   * sentence that earns it.
   */
  action?: ReactNode;
  /**
   * How wide the copy is allowed to run. `default` is `--measure` (68ch), for
   * a section of several paragraphs; `narrow` is `--ledger-measure` (46ch),
   * which is what the design sets on a single-paragraph statement so it does
   * not run out into a long thin line beside a portrait.
   */
  measure?: 'default' | 'narrow';
  /**
   * `dark` is the site's default and needs no instruction
   * (docs/design-guidelines.md §8). `paper` is for a page that alternates its
   * grounds deliberately, and picks the eyebrow ramp, the heading ramp and the
   * body ink to match — the three things that go wrong when a section is
   * simply painted lighter.
   */
  ground?: ProseSplitGround;
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
 * Everything that follows from the ground, decided once. The eyebrow and
 * heading ramps are pairs — `bright` on black, `deep` on paper — and the body
 * ink is the full-strength on-dark value or the paper body colour.
 */
const GROUND: Record<
  ProseSplitGround,
  { section: SectionProps['background']; eyebrow: EyebrowTone; body: string }
> = {
  dark: { section: 'black-dots', eyebrow: 'bright', body: 'text-body-on-dark' },
  paper: { section: 'paper-dots', eyebrow: 'deep', body: 'text-body-base' },
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
 * keeps it correct in a narrow column beside a photograph as well as on a
 * phone. `min(100%, …)` inside the `minmax` is what stops a 380px floor from
 * overflowing a 360px viewport. docs/responsive-strategy.md §4.
 *
 * The copy is DOM-first and screen-first, so the reading order is the same
 * stacked as it is side by side.
 *
 * Two additions on 2026-09-18 for the Solar Energy page, both opt-in so About
 * Us is untouched: an `eyebrow` above the heading, and `frame` / `mask` on
 * the media, which size the box and clip the photograph to a
 * designer-supplied shape — the same alpha mask idiom `intro-split` and
 * `endeavour-split` use.
 *
 * Three more on 2026-09-22 for the Careers page, again opt-in: `ground`,
 * for a page that alternates paper and black; `action`, for a CTA under the
 * copy; and `aside`, for something that is not a photograph in the second
 * column. None of the six earlier call sites changes.
 *
 * A Server Component. Nothing here is interactive.
 */
/**
 * The split itself, without the `<Section>` around it.
 *
 * Exported so `<CutoutSplit>` can render exactly this below `md` and its own
 * composition above, inside one section, without the two drifting apart.
 * Everything documented on {@link ProseSplit} applies here.
 */
export function ProseSplitLayout({
  eyebrow,
  title,
  body,
  media,
  aside,
  action,
  measure = 'default',
  ground = 'dark',
}: ProseSplitProps) {
  const tone = GROUND[ground];
  const headingOrder = eyebrow === undefined ? 0 : 1;
  const actionOrder = body.length + headingOrder + 1;
  const asideOrder = action === undefined ? actionOrder : actionOrder + 1;

  const frame = media && (
    <MediaFrame
      image={media.image}
      alt={media.alt}
      sizes={media.sizes ?? MEDIA_SIZES[media.orientation]}
      pending={media.pending}
      className="absolute inset-0"
    />
  );

  return (
    <div
      className={cn(
        'grid w-full items-center gap-x-ledger-col-gap gap-y-flow',
        'grid-cols-[repeat(auto-fit,minmax(min(100%,var(--prose-split-col-min)),1fr))]',
      )}
    >
      <div className="flex flex-col gap-flow">
        <div className="flex flex-col gap-stack">
          {eyebrow !== undefined && (
            <Reveal order={0}>
              <Eyebrow tone={tone.eyebrow}>{eyebrow}</Eyebrow>
            </Reveal>
          )}

          <Reveal order={headingOrder}>
            <DisplayHeading ground={ground}>{title}</DisplayHeading>
          </Reveal>
        </div>

        <div className={cn('flex flex-col gap-stack', MEASURE_CLASS[measure])}>
          {body.map((paragraph, index) => (
            <Reveal key={paragraph} order={index + headingOrder + 1}>
              <p className={cn('text-body text-pretty', tone.body)}>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        {action !== undefined && action !== null && <Reveal order={actionOrder}>{action}</Reveal>}
      </div>

      {media !== undefined ? (
        <Reveal
          order={asideOrder}
          // `justify-self-center` and the auto margins keep the artwork
          // centred in its column once the cap binds, rather than pinned to
          // the column's start edge with the slack all on one side.
          className={cn(
            'relative mx-auto w-full justify-self-center',
            media.frame ?? MEDIA_CLASS[media.orientation],
            media.mask !== undefined && [media.mask, 'mask-size-(--mask-fill) mask-no-repeat'],
          )}
        >
          {frame}
        </Reveal>
      ) : (
        aside !== undefined &&
        aside !== null && (
          <Reveal order={asideOrder} className="flex w-full justify-center">
            {aside}
          </Reveal>
        )
      )}
    </div>
  );
}

export function ProseSplit(props: ProseSplitProps) {
  return (
    <Section background={GROUND[props.ground ?? 'dark'].section}>
      <ProseSplitLayout {...props} />
    </Section>
  );
}
