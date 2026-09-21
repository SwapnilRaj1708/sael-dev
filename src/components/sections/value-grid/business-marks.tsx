import { cn } from '@/lib/utils/cn';

/**
 * Marks for the three remaining business pages — Solar Cell Manufacturing,
 * Module Manufacturing and Waste To Energy — drawn on 2026-09-19 in the same
 * idiom as `solar-marks.tsx` and for the same reason: the client asked for
 * appropriate marks to be chosen rather than waiting on artwork. The live
 * pages carry raster icons on the Waste To Energy benefit cards and nothing
 * on the rest; the reference screenshots draw one on every entry.
 *
 * A 56×56 box, `stroke="currentColor"`, no literal colour anywhere. Every
 * mark is decorative and `aria-hidden`; the entry's own text is its name.
 * Swap any one for a supplied file by replacing its call site in the page.
 */
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

const MARK_CLASS = 'size-(--value-mark-size) shrink-0 text-white';

interface MarkProps {
  className?: string;
}

/* ---------------------------------------------------------------- Solar cell */

/** Supply-chain resilience — two chain links. */
export function ChainMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M24 32l-4 4a7 7 0 0 1-10-10l6-6a7 7 0 0 1 10 0" />
      <path d="M32 24l4-4a7 7 0 0 1 10 10l-6 6a7 7 0 0 1-10 0" />
      <path d="M22 34l12-12" />
    </svg>
  );
}

/** Advanced automation — a robot arm over a cell. */
export function AutomationMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M10 46h36" />
      <path d="M16 46V30l10-12 10 4" />
      <circle cx="16" cy="30" r="3" />
      <circle cx="26" cy="18" r="3" />
      <path d="M36 22l4-6 6 2-4 6" />
      <path d="M28 40h14v6" />
    </svg>
  );
}

/** Aligned with national targets — a flag on a mast. */
export function TargetMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M14 48V8" />
      <path d="M14 10h26l-6 8 6 8H14" />
      <path d="M8 48h12" />
    </svg>
  );
}

/** Policy support and talent — a handshake. */
export function HandshakeMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M6 22l8-6 10 2 6 6" />
      <path d="M50 22l-8-6-8 2" />
      <path d="M6 34l10 8 8-2 6-6 8 2 10-8" />
      <path d="M22 30l6 6M28 26l6 6" />
    </svg>
  );
}

/* --------------------------------------------------------------- Module */

/** Certifications — a rosette with a tick. */
export function CertificateMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <circle cx="28" cy="22" r="12" />
      <path d="M22 22l4 4 8-8" />
      <path d="M20 32l-4 16 12-6 12 6-4-16" />
    </svg>
  );
}

/** Real-time, data-driven quality — a bar chart with a pulse. */
export function DataMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M8 46h40" />
      <path d="M14 46V30M24 46V20M34 46V26M44 46V14" strokeWidth={4} />
      <path d="M8 16h8l4-6 4 10 4-6h8" />
    </svg>
  );
}

/** Intelligent inspection — a magnifier over a module. */
export function InspectionMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <rect x="8" y="12" width="28" height="20" rx="2" />
      <path d="M8 22h28M22 12v20" />
      <circle cx="38" cy="36" r="8" />
      <path d="M44 42l6 6" />
    </svg>
  );
}

/* ------------------------------------------------------------ Waste to energy */

/** Best available technology — a boiler with a flame. */
export function BoilerMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <rect x="14" y="8" width="28" height="40" rx="4" />
      <path d="M20 48v4M36 48v4" />
      <path d="M28 20c-5 5-6 9-3 13 2 3 4 3 6 0 2 3 4 1 4-2 0-4-2-8-7-11Z" />
    </svg>
  );
}

/** Adaptable feeding — a stack of bales. */
export function BaleMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <rect x="8" y="30" width="18" height="14" rx="2" />
      <rect x="30" y="30" width="18" height="14" rx="2" />
      <rect x="19" y="14" width="18" height="14" rx="2" />
      <path d="M12 37h10M34 37h10M23 21h10" />
    </svg>
  );
}

/** 3-pass boiler — flue gas turning three times. */
export function ThreePassMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <rect x="8" y="10" width="40" height="36" rx="3" />
      <path d="M14 40V18h8v22h8V18h8v22" />
      <path d="M11 18l3-4 3 4M27 40l3 4 3-4" />
    </svg>
  );
}

/** Air-cooled condensers — a fan beside a crossed-out drop. */
export function AirCooledMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <circle cx="22" cy="28" r="4" />
      <path d="M22 24c0-8 6-12 8-8-2 4-4 6-8 8ZM26 28c8 0 12 6 8 8-4-2-6-4-8-8ZM22 32c0 8-6 12-8 8 2-4 4-6 8-8ZM18 28c-8 0-12-6-8-8 4 2 6 4 8 8Z" />
      <path d="M44 14c-4 5-6 8-6 11a6 6 0 0 0 12 0c0-3-2-6-6-11Z" />
      <path d="M36 34l14-14" />
    </svg>
  );
}

/** The cycle of energy — a leaf inside circling arrows. */
export function CycleMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M44 22a17 17 0 0 0-30-6M12 34a17 17 0 0 0 30 6" />
      <path d="M44 12v10h-10M12 44V34h10" />
      <path d="M28 36c-5-3-6-9-2-14 6 1 8 7 2 14ZM28 36c-1-4-1-8 1-11" />
    </svg>
  );
}

/** Rural economy — a coin over a sprouting plant. */
export function RuralMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M10 48h36" />
      <path d="M28 48V30" />
      <path d="M28 36c-8 0-12-4-12-10 6 0 12 4 12 10ZM28 32c8 0 12-4 12-10-6 0-12 4-12 10Z" />
      <circle cx="28" cy="14" r="6" />
      <path d="M28 11v6M26 13h4" />
    </svg>
  );
}

/** Environmental health — a cloud with a leaf. */
export function AirQualityMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M16 40a8 8 0 0 1-1-16 11 11 0 0 1 21-3 8 8 0 0 1 4 19H16Z" />
      <path d="M28 46c4 4 10 3 12-2-5-2-9-2-12 2Z" />
    </svg>
  );
}

/** Reduces reliance on fossil fuels — a barrel, struck through. */
export function FossilMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M16 10h24v36H16z" />
      <path d="M16 22h24M16 34h24" />
      <path d="M10 48L46 8" />
    </svg>
  );
}

/** Steady and reliable — a sun over a level line. */
export function SteadyMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <circle cx="28" cy="22" r="8" />
      <path d="M28 6v4M28 34v4M12 22h4M40 22h4M16.7 10.7l2.8 2.8M36.5 30.5l2.8 2.8M39.3 10.7l-2.8 2.8M19.5 30.5l-2.8 2.8" />
      <path d="M8 46h40" />
    </svg>
  );
}

/** Abundant local fuel — a sheaf of straw. */
export function SheafMark({ className }: MarkProps) {
  return (
    <svg {...MARK_PROPS} className={cn(MARK_CLASS, className)}>
      <path d="M28 48V16" />
      <path d="M28 20c-6-2-8-8-6-12 5 1 7 6 6 12ZM28 20c6-2 8-8 6-12-5 1-7 6-6 12Z" />
      <path d="M28 30c-6-2-8-8-6-12 5 1 7 6 6 12ZM28 30c6-2 8-8 6-12-5 1-7 6-6 12Z" />
      <path d="M20 48c0-6 4-10 8-10s8 4 8 10" />
    </svg>
  );
}
