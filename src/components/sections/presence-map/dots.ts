/**
 * The coordinate space the project sites are placed in.
 *
 * It is the viewBox of `src/assets/images/dotted-map.svg`, the dotted India
 * artwork the client supplied on 2026-08-21, and it is only here so the
 * numbers in `src/app/_content/homepage.ts` have somewhere to say what they
 * are measured against. Change one and change the other.
 *
 * **The generated `DOT_PATH` that used to live here is gone.** Every dot was a
 * subpath of a single `<path>`, sampled from Natural Earth onto a 13px grid
 * and coloured by a gradient this file also defined — about 24 KB of geometry
 * shipped in the page. The supplied SVG draws the same landmass and carries
 * its own ramp, so the artwork is now a file handed to `next/image` like the
 * rest of the brand artwork, and the five `--color-map-dot-*` tokens went with
 * the path.
 *
 * The six site coordinates were carried across rather than re-measured: the
 * old geometry and the new file are the same map at different scales, so each
 * point was mapped through the ratio of the two landmasses' bounding boxes.
 * They agree closely — the two dot fields overlap at about 0.8 by Jaccard on a
 * 24 × 24 occupancy grid — but that is a derivation, not a measurement, and
 * the pins are worth an eye before this ships.
 */
export const MAP_VIEWBOX = { width: 311.33, height: 337.45 } as const;
