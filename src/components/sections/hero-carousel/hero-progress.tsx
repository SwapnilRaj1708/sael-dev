'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';

type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroProgressProps {
  /** One label per slide — the headline the segment goes to. */
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Drives the fill: it runs only while autoplay is actually advancing. */
  isPlaying: boolean;
  /** Dwell per slide, and the duration of one full sweep of the bar. */
  intervalMs: number;
}

/**
 * The countdown across the whole carousel, and the control that selects a
 * slide.
 *
 * **One bar, one full sweep per slide.** It started as four segments filling
 * one after another, then briefly as a quarter-width run per slide that read
 * as one continuous pass across the cycle. The client settled it on
 * 2026-08-22: the bar crosses the whole width once per image, resets, and
 * crosses it again for the next. So the bar is a countdown on the slide you
 * are looking at, not on the carousel.
 *
 * The bar is pinned to the base of the section, which is the point of it: the
 * hero is exactly one viewport tall, so a bar on its bottom edge is on screen
 * the whole time the hero is.
 *
 * The controls are four transparent buttons laid over the bar, one per slide.
 * Each is a quarter of the viewport wide and --spacing-hero-progress (44px,
 * the WCAG floor) tall, with nothing above or below to mis-hit.
 * docs/responsive-strategy.md §5.
 *
 * `animation-play-state` is set inline because it is genuinely runtime state:
 * the fill freezes where it is while the carousel is paused and resumes from
 * there, which no static class can express.
 */
export function HeroProgress({
  labels,
  activeIndex,
  onSelect,
  isPlaying,
  intervalMs,
}: HeroProgressProps) {
  const count = labels.length;

  return (
    <div
      // The backdrops above are `pointer-events-none` so that a drag anywhere
      // on the hero reaches the swipe handler; the bar has to opt back in.
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-3"
    >
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-hero-track bg-hero-track">
        <span
          // Re-keyed per slide, which is what restarts the sweep from empty
          // rather than leaving it sat full where the last slide finished.
          key={activeIndex}
          className={cn('anim-track-fill block h-full w-full', 'bg-(image:--gradient-hero-fill)')}
          style={
            {
              '--slide-duration': `${String(intervalMs)}ms`,
              animationPlayState: isPlaying ? 'running' : 'paused',
            } as StyleWithVars
          }
        />
      </div>

      {/* One column per slide. Driven by the data rather than a `grid-cols-4`
          class, so adding or removing a slide cannot leave the controls out of
          step with the bar underneath them. */}
      <div
        className="relative grid"
        style={{ gridTemplateColumns: `repeat(${String(count)}, minmax(0, 1fr))` }}
      >
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              onSelect(index);
            }}
            aria-label={`Show slide ${String(index + 1)} of ${String(count)}: ${label}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            className="h-hero-progress cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
