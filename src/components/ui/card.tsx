import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The v2 card: a hairline, an inset under it, and an accent that fills across
 * the hairline when the card is hovered or focused. docs/design-guidelines.md §4.
 *
 * **This primitive was rewritten on 2026-08-26 (C-1) to match the built
 * homepage**, which is authoritative. It previously described the pre-v2 card —
 * a white box with `--radius-card`, a border on all four sides,
 * `--shadow-card-hover` and a 5px lift — plus a `tile` variant that wrapped its
 * children in `<TileShape>` for the chamfered business tile. v2 removed both
 * surfaces: the news card "lost its box" and the business tiles became rows of
 * a ledger. Neither variant had a single call site, so the old spec survived
 * only here and in the guidelines, describing a page that no longer existed.
 *
 * What is shared is smaller than the old primitive but real: the two sections
 * had the same six-line accent span duplicated verbatim, and the same
 * `group relative flex w-full border-t` spine underneath it. That trio —
 * hairline, inset, accent — *is* the v2 card idiom, and it is what a new page
 * should reach for.
 *
 * Deliberately **not** in here: flex direction, the column gap, and the one
 * upcoming row's own ground. Those are each section's composition, and pushing
 * them into variants would make this a switch statement over two callers rather
 * than a primitive.
 *
 * The accent is `scaleX` from a left origin, so nothing is laid out again per
 * frame, and it is `aria-hidden` — it repeats the hover state a focus ring
 * already carries. `group-focus-within` mirrors `group-hover` throughout, so a
 * card reached by keyboard behaves as it does under a pointer.
 * docs/responsive-strategy.md §5.
 */
const card = cva('group relative flex w-full border-t', {
  variants: {
    /** Which hairline the card hangs from — follow the section's ground. */
    ground: {
      paper: 'border-hairline-paper',
      dark: 'border-hairline-dark',
    },
    /**
     * `top` insets below the hairline only, for a card whose own last element
     * closes it. `block` insets both edges, for a row in a stack of rows.
     */
    inset: {
      top: 'pt-inset',
      block: 'py-inset',
    },
  },
  defaultVariants: { ground: 'paper', inset: 'top' },
});

export interface CardProps extends ComponentPropsWithRef<'div'>, VariantProps<typeof card> {
  /**
   * The element to render. Both homepage consumers are `article`, and the
   * default stays `div` so a card that is not a self-contained composition is
   * not silently announced as one.
   */
  as?: 'div' | 'article' | 'section';
  /**
   * The accent's colour, e.g. `bg-brand-red` or a per-row gradient class.
   * Omit to render no accent — a card that is not interactive should not
   * suggest it is.
   */
  accentClassName?: string;
}

export function Card({
  as: Element = 'div',
  ground,
  inset,
  accentClassName,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Element className={cn(card({ ground, inset }), className)} {...props}>
      {accentClassName !== undefined && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 -top-px h-rule-accent origin-left',
            'scale-x-0 transition-transform duration-(--duration-card)',
            'group-focus-within:scale-x-100 group-hover:scale-x-100',
            'motion-reduce:transition-none',
            accentClassName,
          )}
        />
      )}
      {children}
    </Element>
  );
}
