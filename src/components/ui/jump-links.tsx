import { cn } from '@/lib/utils/cn';

export interface JumpLink {
  /** The link text, verbatim — the heading it points at. */
  label: string;
  /** An in-page anchor, `#fy2025`. */
  href: string;
}

export interface JumpLinksProps {
  /** The nav's accessible name — functional copy, e.g. "On this page". */
  label: string;
  links: readonly JumpLink[];
  className?: string;
}

/**
 * A row of links to the headings further down the page.
 *
 * **The legacy tab row, turned into links.** The investor pages' year tabs
 * showed one year and hid the rest; this shows every year and lets the reader
 * jump to one. The labels are the headings' own, and the anchors are the
 * legacy tab ids (`#fy2025`), so a legacy deep link lands on the same year it
 * used to open.
 *
 * Plain links in a labelled `<nav>`: keyboard-operable, no script, and the
 * page's own `scroll-padding-top` lands each heading clear of the masthead.
 * They wrap onto as many lines as they need rather than scrolling sideways,
 * so a phone never scrolls the page horizontally for them — and a long label
 * wraps inside its chip ("Environmental, Safety, Social and Governance
 * Committee" at 360px), which is why the chips take the card radius and not
 * a pill's, which a second line would break.
 *
 * Dark ground only. A Server Component.
 */
export function JumpLinks({ label, links, className }: JumpLinksProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex flex-wrap gap-tight">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={cn(
                'inline-flex min-h-touch items-center rounded-(--radius-card) border border-hairline-dark px-stack py-tight',
                'text-body-sm text-on-dark-soft transition-colors duration-(--duration-micro)',
                'hover:border-outline-dark hover:text-white',
                // The global ring is 1.84:1 on this ground; white is the dark
                // surfaces' override.
                'focus-visible:outline-white',
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
