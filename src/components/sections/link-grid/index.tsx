import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { GlowFrame } from '@/components/ui/glow-frame';

export interface LinkGridItem {
  /** The link text, verbatim. */
  name: string;
  /** Root-relative, trailing slash included. */
  href: string;
  /** A decorative mark — the page supplies it, since a mark is a node. */
  mark?: ReactNode;
}

export interface LinkGridProps {
  /** Names the list for assistive technology — the area, e.g. "Offer Documents". */
  label: string;
  items: readonly LinkGridItem[];
}

/**
 * An area's index: a tile per page, each one a link.
 *
 * The legacy Offer Documents index is exactly this — an icon and a title per
 * sub-page, three to a row — and the Financials & Reports index will be the
 * same shape, which is why it is a section and not markup in a page.
 *
 * **Columns come from breakpoints, not from `auto-fit`**: one below `sm`,
 * two to `xl`, four above. Eight tiles then fall as 8, 4 × 2 and 2 × 4 — never
 * a row of three over a row of two — which `auto-fit` cannot promise across
 * the widths in between.
 *
 * **Each tile is an outlined `<Card>` in a `<GlowFrame>`** — the React Bits
 * border glow the Careers panel carries, at the client's request of
 * 2026-09-29, in the same heading-ramp colours. Unlike the Careers panel it
 * does not sweep round on arrival (`intro={false}`): the border lights under
 * the pointer as it nears an edge, and all the way round when the tile's
 * link has keyboard focus — which is the tile's focus indicator: the link
 * draws no outline of its own, and the tile takes one only in forced-colours
 * mode, where the light is stripped. It replaced the hairline card's accent bar and
 * the Aceternity dotted glow the tiles had until then; `hoverEffect={false}`
 * keeps the outlined card's own hover gradient off too, so there is one light
 * per tile, not two. The corner is --radius-card rather than the outlined
 * card's 40px, which on a tile a phone draws 90px tall is half a pill — and
 * the frame is told the same radius so its ring sits on the card's border.
 *
 * On a touch screen there is no hover, so no light; the tile is a plain
 * outlined link, which is what it needs to be there.
 *
 * The link's hit area is stretched over the whole card with a pseudo-element
 * rather than by wrapping the card in the link, so the accessible name is
 * the title and nothing else. The mark is decorative; the title says where
 * the link goes. There is no trailing arrow — the client took it off on
 * 2026-09-29 — so the lit frame and the pointer cursor are what say "link".
 *
 * Below `sm` a tile is a row — mark beside title — so eight of them do not
 * stack into a thousand pixels of phone; from `sm` it stands up, mark over
 * title.
 *
 * A `<ul>` with `aria-label`: a screen reader hears "Offer Documents, list,
 * 8 items", which is the right summary of the page.
 *
 * A Server Component; `<GlowFrame>` is the client leaf, for the pointer.
 */
export function LinkGrid({ label, items }: LinkGridProps) {
  return (
    <ul
      aria-label={label}
      className="grid grid-cols-1 gap-x-gap-grid gap-y-stack sm:grid-cols-2 sm:gap-y-flow xl:grid-cols-4"
    >
      {items.map((item) => (
        <li key={item.href} className="flex">
          <GlowFrame intro={false} radius="card" className="flex w-full">
            <Card
              shape="outlined"
              ground="dark"
              inset="none"
              hoverEffect={false}
              // The lit frame is the tile's focus indicator (see below). In
              // forced-colours mode the frame's shadows and masks are dropped,
              // so there the tile takes a real outline instead, in the
              // system's own focus colour.
              className="h-full rounded-(--radius-card) forced-colors:has-focus-visible:outline-2 forced-colors:has-focus-visible:outline-offset-2"
            >
              <div className="flex w-full items-center gap-stack sm:flex-col sm:items-start">
                {item.mark !== undefined && (
                  <span aria-hidden="true" className="flex-none text-brand-red-bright">
                    {item.mark}
                  </span>
                )}

                <Link
                  href={item.href}
                  // Stretched over the card — `<Card>` is the positioned
                  // ancestor — so the mark and the padding are part of the target.
                  // No outline of its own: it would box the title inside a
                  // tile whose whole frame is already lit by this focus.
                  className="flex-1 text-h3 text-pretty text-white before:absolute before:inset-0 focus-visible:outline-none"
                >
                  {item.name}
                </Link>
              </div>
            </Card>
          </GlowFrame>
        </li>
      ))}
    </ul>
  );
}
