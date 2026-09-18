import type { StaticImageData } from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MediaFrame } from '@/components/ui/media-frame';
import { Section } from '@/components/ui/section';
import { VideoFrame } from '@/components/ui/video-frame';
import { cn } from '@/lib/utils/cn';
import type { BreadcrumbTrailItem } from '@/lib/seo/json-ld';
import { SIZES_FULL_BLEED } from '@/lib/utils/image-sizes';

export interface PageHeroProps {
  /** The page title. Rendered as the page's single `<h1>`. */
  title: string;
  /** Optional label above the title. About Us has none; later pages may. */
  eyebrow?: string;
  /** One paragraph under the title. Optional. */
  intro?: string;
  /**
   * Root first, current page last. See `<Breadcrumb>`. Omit to render no
   * trail — About Us dropped its own on 2026-09-17 at the client's request.
   */
  breadcrumb?: readonly BreadcrumbTrailItem[];
  /**
   * Where the copy sits along the bottom edge. `start` is the template's
   * default, bottom-left; `center` sets the stack in the middle of the band
   * and centres the text within it.
   */
  align?: 'start' | 'center';
  /** The banner photograph. `null` until the client supplies it. */
  image: StaticImageData | null;
  /** Meaningful description of the banner, or `''` if it is decorative. */
  imageAlt: string;
  /**
   * A silent looping video drawn over the photograph, which then serves as
   * its poster and as the still for reduced motion. Absolute URL, composed
   * from the blob path at the call site; `null` when the host is unset.
   * See `<VideoFrame>` for what this is and is not for.
   */
  video?: string | null;
  /** The asset's name in docs/asset-inventory.md, for the pending placeholder. */
  pending?: string;
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
 *  - **The box is a full screen with a floor under it, not an aspect ratio.**
 *    The feature doc specifies `3/1` on desktop falling to `4/3` on mobile.
 *    `--page-hero-h` is `max(36rem, --spacing-viewport)`: a screen's worth
 *    wherever a screen is enough, and 576px wherever it is not. The floor is a
 *    `max()` rather than a breakpoint because the failure is a *short* viewport,
 *    not a narrow one — a phone held landscape needs it and the same phone held
 *    upright does not, and no width query tells those apart.
 *    `data-viewport-hero` below is what makes `--spacing-viewport` mean the
 *    whole screen below `lg`, where the masthead overlays rather than offsets;
 *    globals.css carries that swap.
 *  - **No `<Reveal>`.** The hero is above the fold on arrival, so there is
 *    nothing to reveal — content that animates in when it was already on
 *    screen reads as a glitch. Every section *below* this one cascades.
 *
 * The scrim is `--gradient-page-hero-scrim` and is deliberately **not** the
 * homepage's `--gradient-hero-scrim-stacked`, which this used until 2026-09-10.
 * That ramp is 0.3 opaque even at the top of the frame, so it laid a grey film
 * over the whole photograph; it is tuned for a composition where a headline and
 * a progress bar cross the entire image. This one concentrates the same
 * protection under the bottom-anchored copy and is fully clear by 82%, so the
 * picture reads at its own brightness.
 *
 * `priority` is set on the banner: it is the page's largest contentful paint,
 * and it is the one image per page that should carry it.
 *
 * **`video` swaps the banner for a moving one** — added 2026-09-18 for the
 * Solar Energy hero. The photograph stays as poster and reduced-motion still.
 *
 * A Server Component; only `<VideoFrame>` is client, and only when used.
 */
export function PageHero({
  title,
  eyebrow,
  intro,
  breadcrumb,
  image,
  imageAlt,
  pending,
  video,
  align = 'start',
}: PageHeroProps) {
  return (
    <Section
      background="black"
      // The section owns its vertical space through the inner box's padding,
      // so the standard rhythm would only add a band of black under the
      // photograph.
      spacing="none"
      // The photograph reaches the viewport edge, so the Section renders no
      // Container and the copy below carries its own. docs/design-guidelines.md §8.2.
      // Makes --spacing-viewport the whole screen below `lg`, where the
      // masthead overlays the page instead of offsetting it. globals.css does
      // the swap; the attribute is here so an inner page inherits it without
      // having to plumb anything through its own layout.
      data-viewport-hero
      fullBleed
    >
      <div className="relative flex min-h-(--page-hero-h) w-full max-w-full items-end overflow-hidden">
        {video === undefined ? (
          <MediaFrame
            image={image}
            alt={imageAlt}
            sizes={SIZES_FULL_BLEED}
            priority
            pending={pending}
            className="absolute inset-0"
          />
        ) : (
          <VideoFrame
            src={video}
            poster={image}
            posterAlt={imageAlt}
            sizes={SIZES_FULL_BLEED}
            pending={pending}
            className="absolute inset-0"
          />
        )}

        {/* Decorative: it carries no information, it protects the contrast of
            the text over it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-(image:--gradient-page-hero-scrim)"
        />

        <Container className="relative z-10">
          {/* The masthead is fixed and overlays this section, so the copy
              clears it here rather than the section offsetting itself — which
              would put a band of ground above a full-bleed photograph. */}
          <div
            className={cn(
              'flex flex-col gap-stack pt-[calc(var(--spacing-header)+var(--spacing-flow))] pb-hero-pad-bottom',
              // The measure caps below are on the children, so centring the
              // stack is what moves a capped block to the middle of the band.
              align === 'center' && 'items-center text-center',
            )}
          >
            {breadcrumb !== undefined && <Breadcrumb items={breadcrumb} />}

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
