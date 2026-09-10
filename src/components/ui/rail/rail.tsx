'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { RailContextProvider, type RailState } from './rail-context';

/** Sub-pixel slack. `scrollLeft` is fractional on a zoomed or scaled display. */
const EPSILON = 1;

export interface RailProps {
  /** The heading block, the track, and the arrows — in the design's order. */
  children: ReactNode;
}

/**
 * A horizontally scrolling row of cards: the state, and nothing that is drawn.
 *
 * Renders no markup of its own. It exists to own the scroll position and hand
 * it to `<RailTrack>` and `<RailArrows>`, which the section places wherever
 * its design puts them.
 *
 * **The rail is a real scroll container, not a transformed strip.** That
 * single decision is what makes the rest of this small:
 *
 *  - It works before this bundle arrives, and on a page where it never does.
 *    The markup is a list, `overflow-x: auto` makes it swipeable, and CSS
 *    snapping makes it land cleanly. The arrows are an *addition* to a
 *    carousel that already works, not the mechanism of one.
 *  - Touch, trackpad, shift+wheel and a dragged scrollbar are the platform's
 *    problem rather than ours, along with momentum, rubber-banding and the
 *    right-to-left case.
 *  - There is no index in state, so there is no way for the state and the
 *    rendered position to disagree — the failure that makes a hand-rolled
 *    carousel jump when the viewport resizes mid-transition.
 *
 * What is left for script is the two arrows and whether each is spent, and
 * that is read back from the scroll position rather than counted.
 */
export function Rail({ children }: RailProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  // Both spent until measured, which renders both arrows hidden. That is the
  // honest initial state: it is what the server sent, and it is *correct* for
  // a viewport wide enough to show every card.
  const [spent, setSpent] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const element = trackRef.current;
    if (element === null) return;

    const furthest = element.scrollWidth - element.clientWidth;
    setSpent({
      start: element.scrollLeft <= EPSILON,
      end: element.scrollLeft >= furthest - EPSILON,
    });
  }, []);

  useEffect(() => {
    const element = trackRef.current;
    if (element === null) return;

    measure();

    // Resize, not only scroll: the number of cards on screen changes at `md`
    // and `lg`, and crossing a breakpoint can leave the rail scrolled past a
    // maximum that no longer exists. Observing the element rather than the
    // window also catches the page gutter changing under it.
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [measure]);

  /**
   * Move by exactly one card.
   *
   * The distance is measured from the two rendered cards rather than computed
   * from the token, so it stays right through a breakpoint change without this
   * component knowing what the breakpoints are — and a rail holding a single
   * card falls back to its own width rather than to zero.
   */
  const page = useCallback(
    (direction: 1 | -1) => {
      const element = trackRef.current;
      if (element === null) return;

      const [first, second] = element.children;
      const pitch =
        first !== undefined && second !== undefined
          ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
          : element.clientWidth;

      element.scrollBy({
        left: direction * pitch,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [reducedMotion],
  );

  const value = useMemo<RailState>(
    () => ({ trackRef, atStart: spent.start, atEnd: spent.end, page, measure }),
    [spent.start, spent.end, page, measure],
  );

  return <RailContextProvider value={value}>{children}</RailContextProvider>;
}
