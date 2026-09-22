import { cn } from '@/lib/utils/cn';

/**
 * The Careers page's eight marks — five for "How Do We Work At SAEL?", three
 * for the "Why Join SAEL?" points.
 *
 * **Drawn here, not supplied.** The live page carries five raster icons on
 * the culture cards and three animated third-party icons on the points;
 * none of the eight is among the six assets the client uploaded for this
 * page. Rather than ship eight empty boxes, these follow the decision the
 * client made for Solar Energy on 2026-09-18 — appropriate marks chosen and
 * drawn in the same idiom as `pillar-marks.tsx` and `solar-marks.tsx`: a
 * 56×56 box, `stroke="currentColor"` so the mark takes its card's ink, and
 * no literal colour anywhere (`pnpm verify:guardrails`). Each is a plain
 * pictogram of its card's subject. Swap any one for the client's own file by
 * replacing its call site in `app/career/page.tsx` with a
 * `<ValueMark image={…}>`.
 *
 * They default to white for the black ground. On paper, pass `text-ink`.
 *
 * Every mark is decorative: the card's `<h3>` is its name, so all are
 * `aria-hidden` and `focusable="false"`.
 */

/** Shared geometry. The viewBox is the artwork's own coordinate space. */
const MARK_PROPS = {
  viewBox: '0 0 56 56',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
} as const;

/** Sized by the token, not by width/height attributes, so one value governs. */
const MARK_CLASS = 'size-(--value-mark-size) shrink-0 text-white';

interface MarkProps {
  className?: string;
}

/* ---------------------------------------------------------------------------
 * "How Do We Work At SAEL?"
 * ------------------------------------------------------------------------ */

/** "Empowerment" — a person, and an arrow rising beside them. */
export function EmpowermentMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <circle cx="22" cy="16" r="6" />
      <path d="M8 48v-6a12 12 0 0 1 12-12h4a12 12 0 0 1 12 12v6" />
      <path d="M44 34V12" />
      <path d="M37 19l7-7 7 7" />
    </svg>
  );
}

/** "Appreciation" — a rosette: a star on a medal with its ribbons. */
export function AppreciationMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <circle cx="28" cy="22" r="14" />
      <path d="M28 13l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.5-4.4 6.2-.9L28 13Z" />
      <path d="M20 33l-4 16 12-6 12 6-4-16" />
    </svg>
  );
}

/** "Teamwork" — three people, shoulder to shoulder. */
export function TeamworkMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <circle cx="28" cy="15" r="6" />
      <path d="M17 46v-5a11 11 0 0 1 22 0v5" />
      <circle cx="12" cy="21" r="4.5" />
      <path d="M4 46v-4a8 8 0 0 1 10-7.7" />
      <circle cx="44" cy="21" r="4.5" />
      <path d="M52 46v-4a8 8 0 0 0-10-7.7" />
    </svg>
  );
}

/** "Integrity" — a shield, ticked. */
export function IntegrityMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M28 6l18 6v14c0 11-7.5 19-18 24-10.5-5-18-13-18-24V12l18-6Z" />
      <path d="M19 28l6 6 12-12" />
    </svg>
  );
}

/** "Balance" — a pair of scales, level. */
export function BalanceMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M28 10v37" />
      <path d="M18 47h20" />
      <path d="M11 18h34" />
      <path d="M11 18l-6 14h12l-6-14ZM45 18l-6 14h12l-6-14Z" />
      <path d="M5 32a6 3 0 0 0 12 0M39 32a6 3 0 0 0 12 0" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * "Why Join SAEL?"
 * ------------------------------------------------------------------------ */

/** "Positive Work Culture" — a sun rising over a horizon. */
export function CultureMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M16 38a12 12 0 0 1 24 0" />
      <path d="M6 38h44" />
      <path d="M28 12v6M11 19l4 4M45 19l-4 4M6 30h4M46 30h4" />
      <path d="M14 46h28" />
    </svg>
  );
}

/** "Long-Term Career Paths" — a winding path, with milestones, to an arrow. */
export function PathMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M8 46c10 0 10-14 20-14s10-14 20-14" />
      <circle cx="8" cy="46" r="3" />
      <circle cx="28" cy="32" r="3" />
      <path d="M40 10h8v8" />
    </svg>
  );
}

/** "People-Oriented Leadership" — one person ahead, two behind. */
export function LeadershipMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <circle cx="28" cy="20" r="6" />
      <path d="M16 48v-4a12 12 0 0 1 24 0v4" />
      <circle cx="13" cy="14" r="4" />
      <path d="M4 34v-3a8 8 0 0 1 9-8" />
      <circle cx="43" cy="14" r="4" />
      <path d="M52 34v-3a8 8 0 0 0-9-8" />
    </svg>
  );
}
