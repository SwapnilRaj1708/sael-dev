import type { StaticImageData } from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Section } from '@/components/ui/section';
import type { BreadcrumbTrailItem } from '@/lib/seo/json-ld';
import { cn } from '@/lib/utils/cn';
import { SIZES_FULL_BLEED } from '@/lib/utils/image-sizes';

export interface PageHeroProps {
  /** The page title. Rendered as the page's single `<h1>`. */
  title: string;
  /** Optional label above the title. About Us has none; later pages may. */
  eyebrow?: string;
  /** One paragraph under the title. Optional. */
  intro?: string;
  /** Root first, current page last. See `<Breadcrumb>`. */
  breadcrumb: readonly BreadcrumbTrailItem[];
  /** The banner photograph. `null` until the client supplies it. */
  image: StaticImageData | null;
  /** Meaningful description of the banner, or `''` if it is decorative. */
  imageAlt: string;
  /** The asset's name in docs/asset-inventory.md, for the pending placeholder. */
  pending?: string;
  snap?: boolean;
}

/**
 * The standard inner-page hero — banner photograph, scrim, breadcrumb, `<h1>`.
 *
 * **This is the inner-page template.** FE-07 → FE-15 all use it, which is why
 * it is content-agnostic to the point of taking its own breadcrumb as data:
 * the trail differs per page and a component that derived it from the route
 * would have to know the site's information architecture.
 *
 * Built to `About Us.dc.html` §01. Two things in that file are worth naming
 * because they differ from `docs/features/06-about-us.md`:
 *
 *  - **The box is `min-h-viewport`, not an aspect ratio.** The feature doc
 *    specifies `3/1` on desktop falling to `4/3` on mobile. The design draws a
 *    full-viewport hero on a page that snaps, and an aspect-ratio hero inside
 *    a snap area would either overflow it or leave a band of ground under it.
 *    The design wins here and the deviation is recorded in the tracker.
 *  - **No `<Reveal>`.** The hero is above the fold on arrival, so there is
 *    nothing to reveal — content that animates in when it was already on
 *    screen reads as a glitch. Every section *below* this one cascades.
 *
 * The scrim is `--gradient-hero-scrim-stacked`, the same ramp the homepage
 * hero uses, so a light photograph cannot take the headline's contrast below
 * the floor whatever the client eventually supplies.
 *
 * `priority` is set on the banner: it is the page's largest contentful paint,
 * and it is the one image per page that should carry it.
 *
 * A Server Component. Nothing here is interactive.
 */
export function PageHero({
  title,
  eyebrow,
  intro,
  breadcrumb,
  image,
  imageAlt,
  pending,
  snap = false,
}: PageHeroProps) {
  return (
    <Section
      data-snap-section
      background="black"
      // The section owns its vertical space through the inner box's padding,
      // so the standard rhythm would only add a band of black under the
      // photograph.
      spacing="none"
      // The photograph reaches the viewport edge, so the Section renders no
      // Container and the copy below carries its own. docs/design-guidelines.md §8.2.
      fullBleed
      className={cn(snap && 'snap-start')}
    >
      <div className="relative flex min-h-viewport w-full max-w-full items-end overflow-hidden">
        <MediaFrame
          image={image}
          alt={imageAlt}
          sizes={SIZES_FULL_BLEED}
          priority
          pending={pending}
          className="absolute inset-0"
        />

        {/* Decorative: it carries no information, it protects the contrast of
            the text over it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-(image:--gradient-hero-scrim-stacked)"
        />

        <Container className="relative z-10">
          {/* The masthead is fixed and overlays this section, so the copy
              clears it here rather than the section offsetting itself — which
              would put a band of ground above a full-bleed photograph. */}
          <div className="flex flex-col gap-stack pt-[calc(var(--spacing-header)+var(--spacing-flow))] pb-hero-pad-bottom">
            <Breadcrumb items={breadcrumb} />

            {eyebrow !== undefined && <Eyebrow tone="bright">{eyebrow}</Eyebrow>}

            <h1 className="max-w-(--hero-measure) text-hero text-white">{title}</h1>

            {intro !== undefined && (
              <p className="max-w-(--measure) text-body text-pretty text-body-on-dark">{intro}</p>
            )}
          </div>
        </Container>
      </div>
    </Section>
  );
}
