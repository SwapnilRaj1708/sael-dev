import { cn } from '@/lib/utils/cn';

/**
 * The three "Our Strategic Pillars" marks, drawn from `About Us.dc.html` §05.
 *
 * Line art rather than artwork files: they are three shapes in a 56x56 box and
 * each animates one part of itself, which an exported PNG cannot do and an
 * imported SVG file cannot do either without a build step to inline it. The
 * client's supplied marks elsewhere on the site are photographic-weight assets;
 * these are not, and are drawn here deliberately.
 *
 * **`stroke="currentColor"`, never a literal.** A raw hex outside `theme.css`
 * fails `pnpm verify:guardrails`, and inheriting the ink is the right
 * behaviour anyway — the mark takes its card's colour rather than pinning
 * itself to white on a ground that might not stay black.
 *
 * The animation classes are defined in `src/styles/animations.css`, still
 * state first and motion only under `prefers-reduced-motion: no-preference`.
 * /CLAUDE.md §5.
 *
 * `focusable="false"` is for IE/Edge-legacy, which put SVGs in the tab order;
 * it costs nothing and `aria-hidden` alone does not cover it. The mark is
 * decorative in every case — the card's `<h3>` is its name.
 */

/** Shared geometry. The viewBox is the artwork's own coordinate space. */
const MARK_PROPS = {
  viewBox: '0 0 56 56',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  'aria-hidden': true,
  focusable: 'false',
} as const;

/** Sized by the token, not by width/height attributes, so one value governs. */
const MARK_CLASS = 'size-(--value-mark-size) shrink-0 text-white';

export function GrowthMark({ className }: { className?: string }) {
  return (
    <svg
      {...MARK_PROPS}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(MARK_CLASS, className)}
    >
      {/* The baseline the bars stand on. */}
      <path d="M10 46h36" />
      {/* Three bars, growing on a stagger. `anim-pillar-bar` carries the
          animation; the numbered class carries only that bar's delay. */}
      <path className="anim-pillar-bar" d="M16 44V33" strokeWidth={5} />
      <path className="anim-pillar-bar anim-pillar-bar-2" d="M28 44V26" strokeWidth={5} />
      <path className="anim-pillar-bar anim-pillar-bar-3" d="M40 44V19" strokeWidth={5} />
      {/* The trend line and its arrowhead, static above the bars. */}
      <path d="M12 22l12-8 8 5 12-9" />
      <path d="M37 10h7v7" />
    </svg>
  );
}

export function ExcellenceMark({ className }: { className?: string }) {
  return (
    <svg {...MARK_PROPS} strokeLinecap="round" className={cn(MARK_CLASS, className)}>
      {/* The ring and its teeth turn together as one group; the hub does not,
          which is what makes the rotation legible at 56px. */}
      <g className="anim-pillar-gear">
        <circle cx="28" cy="28" r="12" />
        <path d="M43 28h5M38.6 38.6l3.5 3.5M28 43v5M17.4 38.6l-3.5 3.5M13 28H8M17.4 17.4l-3.5-3.5M28 13V8M38.6 17.4l3.5-3.5" />
      </g>
      <circle cx="28" cy="28" r="4.5" />
    </svg>
  );
}

export function SustainabilityMark({ className }: { className?: string }) {
  return (
    <svg
      {...MARK_PROPS}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(MARK_CLASS, className)}
    >
      {/* The leaf and its vein sway from the stem; the ground line under them
          stays put, so the leaf reads as attached rather than floating. */}
      <g className="anim-pillar-leaf">
        <path d="M28 46C15 40 12 24 19 11c15 5 22 21 9 35Z" />
        <path d="M27 43c-2-9-2-19-6-28" />
      </g>
      <path d="M28 46c4 0 9-1 13-4" />
    </svg>
  );
}
