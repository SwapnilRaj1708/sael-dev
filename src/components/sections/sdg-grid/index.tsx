import { ArrowUpRight } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { DisplayHeading } from '@/components/ui/display-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils/cn';
import { SIZES_SDG_TILE } from '@/lib/utils/image-sizes';

export interface SdgGoal {
  /** The goal's UN number, 1–17. */
  number: number;
  /** The goal's name as the page writes it — part of the link's accessible name. */
  title: string;
  /** Where the tile goes: the goal's own section on the SDG page. */
  href: string;
  /** The UN's official colour icon for the goal, unaltered. */
  icon: StaticImageData;
}

export interface SdgNoticeLink {
  label: string;
  /** Absolute; the notice links off the site. */
  href: string;
}

export interface SdgNotice {
  /** The UN's disclaimer, verbatim. */
  text: string;
  links: readonly SdgNoticeLink[];
}

export interface SdgGridProps {
  eyebrow?: string;
  title: string;
  /** In numeric order. The grid does not sort them. */
  goals: readonly SdgGoal[];
  /** The notice the UN's guidelines ask for beside the icons. */
  notice?: SdgNotice;
  /**
   * Opt into the page's section snapping — a screen tall, content centred.
   * See `data-snap-sections` in globals.css.
   */
  snap?: boolean;
}

/**
 * The UN Sustainable Development Goals SAEL commits to, as the UN's own
 * icons — Our Key ESG Metrics (FE-13), built to `Our Key ESG Metrics
 * v2.dc.html` in its grid form (the design also offers a carousel; the grid
 * needs nothing new and lays the icons out the way the guidelines prefer).
 *
 * **The icons are shown exactly as the UN issues them, and that constrains
 * everything here** (SDG Guidelines, Sep 2023, as the design's handoff reads
 * them):
 *
 *  - the official colour version, whole — number, name and pictogram — with
 *    `object-contain`, never cropped;
 *  - square, with no radius, mask or clip, which is why the tiles have no
 *    card around them and no `--radius-sdg` on them;
 *  - no filter, overlay, opacity, shadow or hover effect, so a tile answers
 *    the pointer with nothing and the keyboard with a focus ring only;
 *  - in numeric order, rows aligned left — five across from `md`, two below.
 *
 * From `lg` the grid stops at `--sdg-grid-w`, so the section — heading, two
 * rows of icons and the notice — fits one screen on a page that snaps.
 *
 * Each tile links to its goal on the SDG page. The icon is `alt=""` inside
 * the link because the link itself is named — "SDG 7: Affordable & Clean
 * Energy" — and the picture would only say it again.
 *
 * The files are committed (`src/assets/images/sdg/`) rather than hotlinked
 * from un.org, which the guidelines' own download page asks of users.
 *
 * A Server Component; only `<Reveal>` is client.
 */
export function SdgGrid({ eyebrow, title, goals, notice, snap = false }: SdgGridProps) {
  const headingOrder = eyebrow === undefined ? 0 : 1;

  return (
    <Section
      background="black-dots"
      spacing="tight"
      data-snap-section
      className={cn(snap && 'flex min-h-viewport snap-start items-center')}
    >
      <div className="flex flex-col gap-flow">
        <div className="flex flex-col gap-stack">
          {eyebrow !== undefined && (
            <Reveal order={0}>
              <Eyebrow tone="bright">{eyebrow}</Eyebrow>
            </Reveal>
          )}

          <Reveal order={headingOrder}>
            <DisplayHeading ground="dark" className="w-fit">
              {title}
            </DisplayHeading>
          </Reveal>
        </div>

        <Reveal order={headingOrder + 1}>
          <ul className="grid grid-cols-2 gap-stack md:grid-cols-5 lg:max-w-(--sdg-grid-w)">
            {goals.map((goal) => (
              <li key={goal.number}>
                <Link
                  href={goal.href}
                  aria-label={`SDG ${String(goal.number)}: ${goal.title}`}
                  className="relative block aspect-square outline-offset-4 focus-visible:outline-white"
                >
                  <Image
                    src={goal.icon}
                    alt=""
                    fill
                    sizes={SIZES_SDG_TILE}
                    className="object-contain"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {notice !== undefined && (
          <Reveal order={headingOrder + 2} className="flex max-w-(--measure) flex-col gap-tight">
            <p className="text-body-sm text-pretty text-on-dark-soft">{notice.text}</p>

            <ul className="flex flex-wrap gap-x-flow gap-y-tight">
              {notice.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-body-sm text-white underline underline-offset-4 hover:text-body-on-dark focus-visible:outline-white"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      focusable="false"
                      className="size-4 shrink-0"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
