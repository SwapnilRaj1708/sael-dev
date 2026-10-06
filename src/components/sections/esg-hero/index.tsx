import { Eyebrow } from '@/components/ui/eyebrow';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { EsgWheel } from './esg-wheel';

export interface EsgHeroProps {
  /** The page title. Rendered as the page's single `<h1>`. */
  title: string;
  /** The small uppercase label above the title — the nav group. */
  eyebrow?: string;
  /** One line under the title. */
  intro?: string;
  /**
   * Opt into the page's section snapping — a screen tall, content centred.
   * See `data-snap-sections` in globals.css. Without it the hero has the
   * design's own floor from `lg`, `--esg-hero-min-h`.
   */
  snap?: boolean;
}

/**
 * Our Key ESG Metrics' hero (FE-13) — the animated ESG wheel beside the
 * page's eyebrow, title and standfirst, over three soft glows in the wheel's
 * own colours.
 *
 * Built to `Our Key ESG Metrics v2.dc.html`, the client's pick of the two
 * hero treatments: the wheel from `ESG Animated Banner.dc.html`, restyled
 * for the black ground. It replaces the hex-mosaic split hero of the first
 * version, and is the only page hero on the site that is not a photograph.
 *
 * Side by side from `lg`, the wheel leading; stacked below it, the wheel
 * centred above the copy. Below `lg` the masthead overlays the page, so the
 * stack clears it with padding, as `<PageHero>` does.
 *
 * **The motion runs on arrival, not on scroll.** It is the hero, so it is
 * on screen from the first paint and there is nothing to reveal — which is
 * why `<PageHero>` takes no `<Reveal>` either. Every part of it is CSS and
 * every part is skipped under reduced motion; see `anim-esg-*`.
 *
 * A Server Component. Nothing here needs the client.
 */
export function EsgHero({ title, eyebrow, intro, snap = false }: EsgHeroProps) {
  return (
    <Section
      background="black-dots"
      spacing="none"
      data-snap-section
      className={cn('overflow-hidden', snap && 'flex min-h-viewport snap-start items-center')}
    >
      {/* The three glows, drifting. Decorative throughout. */}
      <span
        aria-hidden="true"
        className="anim-esg-glow pointer-events-none absolute -bottom-10 -left-24 size-esg-glow-environment rounded-pill bg-(image:--gradient-esg-glow-environment)"
      />
      <span
        aria-hidden="true"
        className="anim-esg-glow anim-esg-glow-2 pointer-events-none absolute -top-10 right-1/5 size-esg-glow-governance rounded-pill bg-(image:--gradient-esg-glow-governance)"
      />
      <span
        aria-hidden="true"
        className="anim-esg-glow anim-esg-glow-3 pointer-events-none absolute -right-10 bottom-5 size-esg-glow-social rounded-pill bg-(image:--gradient-esg-glow-social)"
      />
      {/* The foot fades to the ground, so the glows end before the next
          section rather than at an edge. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-50 bg-(image:--gradient-esg-hero-foot)"
      />

      <div
        className={cn(
          'relative flex flex-col items-center gap-flow pt-[calc(var(--spacing-header)+var(--spacing-flow))] pb-section-y lg:flex-row lg:gap-x-split-wide lg:py-section-y',
          !snap && 'lg:min-h-(--esg-hero-min-h)',
        )}
      >
        <div className="size-esg-wheel shrink-0">
          <EsgWheel />
        </div>

        <div className="flex w-full max-w-(--esg-hero-copy-w) flex-col gap-stack lg:flex-1">
          {eyebrow !== undefined && (
            <div className="anim-esg-rise">
              <Eyebrow tone="bright">{eyebrow}</Eyebrow>
            </div>
          )}

          <h1 className="anim-esg-rise anim-esg-rise-2 text-hero text-white">{title}</h1>

          {intro !== undefined && (
            <p className="anim-esg-rise anim-esg-rise-2 text-body text-pretty text-body-on-dark">
              {intro}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
