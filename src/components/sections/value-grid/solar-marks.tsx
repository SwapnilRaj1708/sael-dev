import { cn } from '@/lib/utils/cn';

/**
 * The Solar Energy page's seven marks — three for "Proven Execution
 * Capabilities", four for "Our EPC And O&M Practices".
 *
 * **Drawn here, not supplied.** The live page carries four raster icons on
 * the practice cards and none on the capabilities; the client's reference
 * draws a mark on all seven. On 2026-09-18 the client asked for appropriate
 * marks to be chosen rather than waiting on artwork, so these are line art in
 * the same idiom as `pillar-marks.tsx`: a 56×56 box, `stroke="currentColor"`
 * so the mark takes its card's ink, and no literal colour anywhere
 * (`pnpm verify:guardrails`). Each is a plain pictogram of its card's subject
 * — swap any one for the client's own file by replacing its call site in
 * `app/solar-energy/page.tsx` with a `<ValueMark image={…}>`.
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

/** "Project Selection and Monitoring" — a clipboard with a ticked line. */
export function SelectionMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <rect x="12" y="10" width="32" height="38" rx="3" />
      <path d="M21 10V7h14v3M21 15h14" />
      <path d="M19 30l5 5 12-12" />
      <path d="M19 42h18" />
    </svg>
  );
}

/** "Sustain Operational Efficiencies" — a gauge with its needle high. */
export function EfficiencyMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M8 40a20 20 0 1 1 40 0" />
      <path d="M12 40h4M40 40h4M28 16v4M15.9 22.9l2.8 2.8M40.1 22.9l-2.8 2.8" />
      <path d="M28 40l10-13" />
      <circle cx="28" cy="40" r="3" />
    </svg>
  );
}

/** "Robust Development Capabilities" — a site pin over a plot of land. */
export function DevelopmentMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M28 36c6-7 10-12 10-17a10 10 0 1 0-20 0c0 5 4 10 10 17Z" />
      <circle cx="28" cy="19" r="3.5" />
      <path d="M17 38l-9 10h40l-9-10" />
    </svg>
  );
}

/** "Dedicated Manpower and Supervisory Team" — two people, one ahead. */
export function TeamMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <circle cx="22" cy="19" r="6" />
      <path d="M8 46v-4a10 10 0 0 1 10-10h8a10 10 0 0 1 10 10v4" />
      <circle cx="38" cy="16" r="5" />
      <path d="M41 28h1a8 8 0 0 1 8 8v6" />
    </svg>
  );
}

/** "Implementation & Monitoring of Pre-approved Plan" — a calendar, ticked. */
export function PlanMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <rect x="9" y="12" width="38" height="34" rx="3" />
      <path d="M9 22h38M18 8v8M38 8v8" />
      <path d="M20 35l5 5 11-11" />
    </svg>
  );
}

/** "Designated Engineer for Evacuation" — a transmission pylon. */
export function EvacuationMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M22 48l4-40h4l4 40" />
      <path d="M10 18h36M14 30h28" />
      <path d="M24 18l-10 12M32 18l10 12M18 30l14 18M38 30L24 48" />
      <path d="M10 18v5M46 18v5" />
    </svg>
  );
}

/** "Advanced SCADA Technologies" — a monitor carrying a trend line. */
export function ScadaMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <rect x="6" y="10" width="44" height="28" rx="3" />
      <path d="M22 48h12M28 38v10" />
      <path d="M13 30l8-8 6 5 8-10 8 6" />
    </svg>
  );
}
